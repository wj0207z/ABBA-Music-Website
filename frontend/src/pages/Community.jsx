import { useEffect, useState } from "react";
import api from "../api/axios";

function Community() {
    const [postText, setPostText] = useState("");
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [likedPosts, setLikedPosts] = useState({});
    const [myPosts, setMyPosts] = useState([]);


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

    function handleLike(postId) {
        setLikedPosts((currentLikes) => ({
            ...currentLikes,
            [postId]: !currentLikes[postId],
        }));
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
                        const isLiked = Boolean(likedPosts[post.id]);
                        const displayedLikes =
                            post.likes + (isLiked ? 1 : 0);

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

                                    <button className="post-action">
                                        Comment
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </section>
            </section>
        </main>
    );
}

export default Community;