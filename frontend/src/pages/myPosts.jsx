import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function MyPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectionMode, setSelectionMode] =
        useState(false);

    const [selectedPostId, setSelectedPostId] =
        useState(null);

    const [editingId, setEditingId] =
        useState(null);

    const [editText, setEditText] =
        useState("");

    const [saving, setSaving] =
        useState(false);

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

    function enterSelectionMode() {
        setSelectionMode(true);
        setSelectedPostId(null);
        setError("");
    }

    function cancelSelection() {
        setSelectionMode(false);
        setSelectedPostId(null);
        setError("");
    }

    function startEditing() {
        if (!selectedPostId) {
            setError("Please choose a post to edit.");
            return;
        }

        const selectedPost = posts.find(
            (post) => post.id === selectedPostId
        );

        if (!selectedPost) {
            return;
        }

        setEditingId(selectedPost.id);
        setEditText(selectedPost.content);
        setSelectionMode(false);
        setError("");
    }

    function cancelEditing() {
        setEditingId(null);
        setEditText("");
    }

    function getPostDateLabel(post) {
        const createdTime = new Date(
            post.created_at
        ).getTime();

        const updatedTime = new Date(
            post.updated_at
        ).getTime();

        if (updatedTime > createdTime) {
            return `Modified at ${formatDate(
                post.updated_at
            )}`;
        }

        return `Posted at ${formatDate(
            post.created_at
        )}`;
    }

    async function handleUpdate() {
        if (editText.trim() === "") {
            setError("Post content cannot be empty.");
            return;
        }

        setSaving(true);
        setError("");

        try {
            const response = await api.put(
                `/posts/${editingId}`,
                {
                    content: editText,
                }
            );

            setPosts((currentPosts) =>
                currentPosts.map((post) =>
                    post.id === editingId
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

    async function handleDelete() {
        if (!selectedPostId) {
            setError("Please choose a post to delete.");
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete this post?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(
                `/posts/${selectedPostId}`
            );

            setPosts((currentPosts) =>
                currentPosts.filter(
                    (post) => post.id !== selectedPostId
                )
            );

            cancelSelection();
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
                <div className="my-posts-toolbar">
                    <div>
                        <p className="history-label">
                            YOUR POST HISTORY
                        </p>

                        <h2>
                            {selectionMode
                                ? "Choose a post"
                                : "My Posts"}
                        </h2>
                    </div>

                    {!selectionMode &&
                        !editingId && (
                            <button
                                className="select-post-button"
                                onClick={enterSelectionMode}
                            >
                                <span aria-hidden="true">
                                    ✎
                                </span>
                                Edit
                            </button>
                        )}
                </div>

                {selectionMode && (
                    <div className="selection-toolbar">
                        <p>
                            Please choose a post to edit or delete.
                        </p>

                        <div>
                            <button
                                className="manage-selected-button"
                                onClick={startEditing}
                                disabled={!selectedPostId}
                            >
                                Edit Selected
                            </button>

                            <button
                                className="delete-selected-button"
                                onClick={handleDelete}
                                disabled={!selectedPostId}
                            >
                                Delete Selected
                            </button>

                            <button
                                className="cancel-selection-button"
                                onClick={cancelSelection}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {loading && (
                    <p>Loading your posts...</p>
                )}

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
                            className={
                                selectedPostId === post.id
                                    ? "community-post selected-post"
                                    : "community-post"
                            }
                            key={post.id}
                        >
                            <div className="post-header">
                                <strong>
                                    {post.author}
                                </strong>

                                <span>
                                    {getPostDateLabel(post)}
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
                                            className="manage-selected-button"
                                            onClick={
                                                handleUpdate
                                            }
                                            disabled={saving}
                                        >
                                            {saving
                                                ? "Saving..."
                                                : "Save"}
                                        </button>

                                        <button
                                            className="cancel-selection-button"
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

                                        {selectionMode && (
                                            <label className="post-selector">
                                                <input
                                                    type="radio"
                                                    name="selectedPost"
                                                    checked={
                                                        selectedPostId ===
                                                        post.id
                                                    }
                                                    onChange={() =>
                                                        setSelectedPostId(
                                                            post.id
                                                        )
                                                    }
                                                />

                                                <span>
                                                    Select
                                                </span>
                                            </label>
                                        )}
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