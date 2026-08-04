import { useEffect, useState } from "react";
import api from "../api/axios";

function Community() {
    const [postText, setPostText] = useState("");
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [likedPosts, setLikedPosts] = useState({});
    const [myPosts, setMyPosts] = useState([]);

    const [commentsByPost, setCommentsByPost] = useState({});
    const [commentTextByPost, setCommentTextByPost] = useState({});
    const [openComments, setOpenComments] = useState({});
    const [commentLoading, setCommentLoading] = useState({});
    const [commentError, setCommentError] = useState({});


    //get user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    const displayName = user?.name || "Guest User";

    const initials = displayName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const postCount = myPosts.length;

    async function fetchLikedPostIds() {
        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        try {
            const response = await api.get("/liked-post-ids");

            const likedState = {};

            response.data.liked_post_ids.forEach((postId) => {
                likedState[String(postId)] = true;
            });

            setLikedPosts(likedState);
        } catch (error) {
            console.error("Failed to load liked posts.");
        }
    }
    
    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await api.get("/posts");
                setPosts(response.data);
            } catch (error) {
                setError("Failed to load posts.");
            } finally {
                setLoading(false);
            }
        }

        async function fetchMyPosts() {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) {
                return;
            }

            try {
                const response = await api.get("/my-posts");
                setMyPosts(response.data);
            } catch (error) {
                setError("Failed to load user's posts.");
            }
        }

        fetchPosts();
        fetchMyPosts();
        fetchLikedPostIds();
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();

        if (postText.trim() === "") {
            return;
        }

        try {
            const response = await api.post("/posts", {
                content: postText,
            });

            const newPost = response.data.post;

            setPosts((currentPosts) => [
                newPost,
                ...currentPosts,
            ]);

            setMyPosts((currentMyPosts) => [
                newPost,
                ...currentMyPosts,
            ]);

            setPostText("");
            setError("");
        } catch (error) {
            if (error.response?.status === 401) {
                setError("Please log in to create a post.");
            } else {
                setError("Failed to create post.");
            }
        }
    }

    async function toggleComments(postId) {
        //check whether the comments for this post are already open
        const isCurrentlyOpen = openComments[postId];

        setOpenComments((current) => ({
            ...current,
            [postId]: !isCurrentlyOpen,
        }));

        //stop if the comments are already open or if they have already been loaded
        if (isCurrentlyOpen || commentsByPost[postId]) {
            return;
        }

        setCommentLoading((current) => ({
            ...current,
            [postId]: true,
        }));

        try {
            const response = await api.get(`/posts/${postId}/comments`);

            setCommentsByPost((current) => ({
                ...current,
                [postId]: response.data,
            }));
        } catch (error) {
            setCommentError((current) => ({
                ...current,
                [postId]: "Failed to load comments.",
            }));
        } finally {
            setCommentLoading((current) => ({
                ...current,
                [postId]: false,
            }));
        }
    }

    function handleCommentChange(postId, value) {
        setCommentTextByPost((current) => ({
            ...current,
            [postId]: value,
        }));
    }

    async function handleCommentSubmit(event, postId) {
        event.preventDefault();

        const content = commentTextByPost[postId]?.trim();

        if (!content) {
            return;
        }

        try {
            const response = await api.post(
                `/posts/${postId}/comments`,
                { content }
            );

            setCommentsByPost((current) => ({
                ...current,
                [postId]: [
                    response.data.comment,
                    ...(current[postId] || []),
                ],
            }));

            setCommentTextByPost((current) => ({
                ...current,
                [postId]: "",
            }));

            setCommentError((current) => ({
                ...current,
                [postId]: "",
            }));

            setPosts((currentPosts) =>
                currentPosts.map((post) =>
                    post.id === postId
                        ? {
                            ...post,
                            comments_count:
                                (post.comments_count || 0) + 1,
                        }
                        : post
                )
            );

        } catch (error) {
            setCommentError((current) => ({
                ...current,
                [postId]:
                    error.response?.status === 401
                        ? "Please log in to comment."
                        : "Failed to create comment.",
            }));
        }
    }

    async function handleLike(postId) {
        try {
            const response = await api.post(
                `/posts/${postId}/like`
            );

            const { liked, likes_count } = response.data;

            setLikedPosts((currentLikes) => ({
                ...currentLikes,
                [postId]: liked,
            }));

            setPosts((currentPosts) =>
                currentPosts.map((post) =>
                    post.id === postId
                        ? {
                            ...post,
                            likes_count,
                        }
                        : post
                )
            );

            setError("");
        } catch (error) {
            if (error.response?.status === 401) {
                setError("Please log in to like a post.");
            } else {
                setError("Failed to update like.");
            }
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
                <p className="eyebrow">FAN COMMUNITY</p>

                <h1>Community</h1>

                <p>
                    Share your favorite ABBA songs, albums and memories.
                </p>
            </section>

            <section className="community-layout">
                <aside className="profile-card">
                    <div className="profile-avatar">
                        {initials}
                    </div>

                    <h2>{displayName}</h2>

                    <p className="username">
                        {user
                        ? `@${user.name.toLowerCase().replaceAll(" ", "")}`
                        : "@guest"}
                    </p>

                    <div className="profile-stats">
                        <div>
                            <strong>{postCount}</strong>
                            <span>Posts</span>
                        </div>

                        <div>
                            <strong>0</strong>
                            <span>Followers</span>
                        </div>

                        <div>
                            <strong>0</strong>
                            <span>Following</span>
                        </div>
                    </div>

                    <button className="profile-button">
                        Edit Profile
                    </button>
                </aside>

                <section className="post-list">

                    <form className="post-form" onSubmit={handleSubmit}>
                        <textarea
                            value={postText}
                            onChange={(event) =>
                                setPostText(event.target.value)
                            }
                            placeholder="Share something about ABBA..."
                        />

                        <button type="submit">
                            Post
                        </button>
                    </form>

                    {loading && <p>Loading posts...</p>}

                    {error && <p className="error">{error}</p>}

                    {!loading && !error && posts.length === 0 && (
                        <p>
                            No posts to display. Be the first to share
                        </p>
                    )}

                    {posts.map((post) => {
                        const isLiked = Boolean(likedPosts[String(post.id)]);
                        const displayedLikes = post.likes_count || 0;

                        return (
                            <article
                                className="community-post"
                                key={post.id}
                            >
                                <div className="post-header">
                                    <strong>{post.author}</strong>
                                    <span>
                                        {formatDate(post.created_at)}
                                    </span>
                                </div>

                                <p>{post.content}</p>

                                <div className="post-actions">
                                    <button
                                        type="button"
                                        className={
                                            isLiked
                                                ? "post-action liked"
                                                : "post-action"
                                        }
                                        onClick={() => handleLike(post.id)}
                                    >
                                        {isLiked ? "♥" : "♡"}{" "}
                                        {displayedLikes}
                                    </button>

                                    <button
                                        type="button"
                                        className="post-action"
                                        onClick={() => toggleComments(post.id)}
                                    >
                                        {openComments[post.id]
                                            ? "Hide Comments"
                                            : "Comments"}{" "}
                                        ({post.comments_count || 0})
                                    </button>
                                </div>

                                {openComments[post.id] && (
                                    <section className="comments-section">
                                        {commentLoading[post.id] && (
                                            <p>Loading comments...</p>
                                        )}

                                        {commentError[post.id] && (
                                            <p className="error">
                                                {commentError[post.id]}
                                            </p>
                                        )}

                                        {!commentLoading[post.id] &&
                                            commentsByPost[post.id]?.length === 0 && (
                                                <p>No comments yet.</p>
                                            )}

                                        {commentsByPost[post.id]?.map((comment) => (
                                            <div
                                                className="comment-item"
                                                key={comment.id}
                                            >
                                                <strong>
                                                    {comment.user?.name || "User"}
                                                </strong>

                                                <span>
                                                    {formatDate(comment.created_at)}
                                                </span>

                                                <p>{comment.content}</p>
                                            </div>
                                        ))}

                                        <form
                                            className="comment-form"
                                            onSubmit={(event) =>
                                                handleCommentSubmit(event, post.id)
                                            }
                                        >
                                            <textarea
                                                value={commentTextByPost[post.id] || ""}
                                                onChange={(event) =>
                                                    handleCommentChange(
                                                        post.id,
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Write a comment..."
                                            />

                                            <button type="submit">
                                                Comment
                                            </button>
                                        </form>
                                    </section>
                                )}
                            </article>
                        );
                    })}
                </section>
            </section>
        </main>
    );
}

export default Community;