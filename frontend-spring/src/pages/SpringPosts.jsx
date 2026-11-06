import { useEffect, useState } from "react";
import springApi from "../api/springApi";

import { getCsrf } from "../api/springApi";
import { useSpringAuth } from "../context/SpringAuthContext";

function SpringPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [content, setContent] = useState("");
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState("");

    const { user, checkingSession} = useSpringAuth();

    useEffect(() => {
        let active = true;

        async function loadPosts() {
            try {
                const response = await springApi.get("/posts");

                if (!Array.isArray(response.data)) {
                    throw new Error("Expected a list of posts");
                }

                if (active) {
                    setPosts(response.data);
                }
            } catch {
                if (active) {
                    setError("Could not load posts from Spring Boot.");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadPosts();

        return () => {
            active = false;
        };
    }, []);

    async function handleCreatePost(event) {
        event.preventDefault();
        setCreateError("");

        if (!content.trim()) {
            setCreateError("Please write something first.");
            return;
        }

        setCreating(true);

        try {
            const csrf = await getCsrf();

            const response = await springApi.post(
                "/posts",
                {content: content.trim() },
                {
                    headers: {
                        [csrf.headerName]: csrf.token,
                    },
                }
            );

            setPosts((previousPosts) => [
                response.data,
                ...previousPosts,
            ]);

            setContent("");
        } catch (error) {
            const status = error.response?.status;
            const data = error.response?.data;

            if (data?.errors) {
                setCreateError(
                    Object.values(data.errors).flat().join(" ")
                );
            } else if (status === 401) {
                setCreateError("Please sign in again before posting.");
            } else if (status === 403) {
                setCreateError("Could not authorize this. Refresh and try again.");
            } else {
                setCreateError("Could not create your posts. Please try again.");
            }
        } finally {
            setCreating(false);
        }
    }

    return (
        <main className="community-page">
            <section className="community-heading">
                <p className="eyebrow">FAN COMMUNITY</p>
                <h1>Community</h1>
                <p>
                    Share your favourite ABBA songs, albums, memories.
                </p>
            </section>

            <section className="community-layout">
                <aside className="profile-card">
                    <div className="profile-avatar">
                        {user?.name?.charAt(0). toUpperCase() || "?"}
                    </div>

                    <h2>
                        {checkingSession
                            ? "Checking session..."
                            : user?.name || "Guest"}
                    </h2>

                    <p className="username">
                        {user
                        ? "Welcome to the community"
                        : "Sign in to share your thoughts"}
                    </p>
                </aside>

                <section
                    className="post-list"
                    style={{ color: "#101010" }}
                >
                    {!checkingSession && (
                        user ? (
                            <form
                                className="post-form"
                                onSubmit={handleCreatePost}
                            >
                                <label htmlFor="post-content">
                                    Share something about ABBA
                                </label>

                                <textarea
                                    id="post-content"
                                    value={content}
                                    onChange={(event) =>
                                        setContent(event.target.value)
                                    }
                                    placeholder="What is your favourite ABBA song?"
                                    row={4}
                                    maxLength={2000}
                                    disabled={creating}
                                    required
                                />

                                {createError && (
                                    <p role="alert">{createError}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={
                                        creating ||
                                        loading ||
                                        Boolean(error)
                                    }
                                >
                                    {creating ? "Posting..." : "Post"}
                                </button>
                            </form>
                        ) : (
                        <p>Sign in to create a post</p>
                        )
                    )}

                    {loading && <p>Loading posts...</p>}

                    {error && <p role="alert">{error}</p>}

                    {!loading && error && posts.length === 0 && (
                        <p>No posts yet. Be the first one to share!</p>
                    )}

                    {!loading && !error && posts.map((post) => (
                        <article
                            className="community-post"
                            key={post.id}
                        >
                            <div className="post-header">
                                <strong>{post.author}</strong>
                            </div>

                            <p style={{ whiteSpace: "pre-wrap" }}>
                                {post.content}
                            </p>
                        </article>
                    ))}
                </section>
            </section>
        </main>
    )

}

export default SpringPosts;
