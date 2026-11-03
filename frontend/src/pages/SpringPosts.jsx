import { useEffect, useState } from "react";
import springApi from "../api/springApi";

function SpringPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    return (
        <main className="community-page">
            <section className="community-heading">
                <p className="eyebrow">FAN COMMUNITY</p>
                <h1>Posts</h1>
            </section>

            {loading && <p>Loading posts...</p>}

            {error && <p role="alert">{error}</p>}

            {!loading && !error && posts.length === 0 && (
                <p>No posts yet.</p>
            )}

            {!loading && !error && posts.map((post) => (
                <article key={post.id}>
                    <h2>{post.author}</h2>
                    <p style={{ whiteSpace: "pre-wrap" }}>
                        {post.content}
                    </p>
                    <hr />
                </article>
            ))}
        </main>
    );
}

export default SpringPosts;