import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function MyPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function fetchMyPosts() {
            try {
                const response = await api.get("/my-posts");
                setPosts(response.data);
            } catch (error) {
                setError(
                    error.response?.status === 401
                        ? "Please log in to view your posts."
                        : "Failed to load your posts."
                );
            } finally {
                setLoading(false);
            }
        }

        fetchMyPosts();
    }, []);

    function startEditing(post) {
        setEditingId(post.id);
        setEditText(post.content);
        setError("");
    }

    function cancelEditing() {
        setEditingId(null);
        setEditText("");
    }

    async function handleUpdate(postId) {
        if (editText.trim() === "") {
            setError("Post content cannot be empty.");
            return;
        }

        setSaving(true);
        setError("");

        try {
            const response = await api.put(
                `/posts/${postId}`,
                {
                    content: editText,
                }
            );

            setPosts((currentPosts) =>
                currentPosts.map((post) =>
                    post.id === postId
                        ? response.data.post
                        : post
                )
            );

            cancelEditing();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update post."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(postId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this post?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/posts/${postId}`);

            setPosts((currentPosts) =>
                currentPosts.filter(
                    (post) => post.id !== postId
                )
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete post."
            );
        }
    }

    function formatDate(date) {
        if (!date) {
            return "Just now";
        }

        return new Date(date).toLocaleString();
    }

    return (
        <main className="community-page">
            <section className="community-heading">
                <p className="eyebrow">YOUR POSTS</p>

                <h1>My Posts</h1>

                <p>
                    View and manage the posts you have shared.
                </p>
            </section>

            <section className="post-list my-posts-list">
                {loading && <p>Loading your posts...</p>}

                {error && (
                    <p className="error">
                        {error}
                    </p>
                )}

                {!loading &&
                    !error &&
                    posts.length === 0 && (
                        <p>
                            You have not created any posts yet.
                        </p>
                    )}

                {!loading &&
                    !error &&
                    posts.map((post) => (
                        <article
                            className="community-post"
                            key={post.id}
                        >
                            <div className="post-header">
                                <strong>
                                    {post.author}
                                </strong>

                                <span>
                                    {formatDate(
                                        post.created_at
                                    )}
                                </span>
                            </div>

                            {editingId === post.id ? (
                                <>
                                    <textarea
                                        className="edit-post-input"
                                        value={editText}
                                        onChange={(event) =>
                                            setEditText(
                                                event.target.value
                                            )
                                        }
                                    />

                                    <div className="post-actions">
                                        <button
                                            className="post-manage-action"
                                            onClick={() =>
                                                handleUpdate(
                                                    post.id
                                                )
                                            }
                                            disabled={saving}
                                        >
                                            {saving
                                                ? "Saving..."
                                                : "Save"}
                                        </button>

                                        <button
                                            className="post-manage-action"
                                            onClick={
                                                cancelEditing
                                            }
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p>{post.content}</p>

                                    <div className="post-actions">
                                        <span className="post-action">
                                            {post.likes} Likes
                                        </span>

                                        <button
                                            className="post-manage-action"
                                            onClick={() =>
                                                startEditing(
                                                    post
                                                )
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="post-manage-action delete-post-action"
                                            onClick={() =>
                                                handleDelete(
                                                    post.id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </article>
                    ))}
            </section>

            <p className="back-to-community">
                <Link to="/community">
                    Back to Community Feed
                </Link>
            </p>
        </main>
    );
}

export default MyPosts;