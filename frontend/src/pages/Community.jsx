import { useState } from "react";


function Community() {

    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(74);

    const [postText, setPostText] = useState("");
    const [posts, setPosts] = useState([]);

    function handleLike() {
        if (liked) {
            setLikeCount(likeCount - 1);
        } else {
            setLikeCount(likeCount + 1);
        }
    
        setLiked(!liked);
    }

    function handleSubmit(event) {
        event.preventDefault();
    
        if (postText.trim() === "") {
            return;
        }
    
        const newPost = {
            id: Date.now(),
            author: "You",
            content: postText,
            createdAt: "Just now",
        };
    
        setPosts([newPost, ...posts]);
        setPostText("");
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
                    <div className="profile-avatar">ES</div>

                    <h2>Elena Starling</h2>

                    <p className="username">@elenastarling</p>

                    <div className="profile-stats">
                        <div>
                            <strong>124</strong>
                            <span>Posts</span>
                        </div>

                        <div>
                            <strong>362</strong>
                            <span>Followers</span>
                        </div>

                        <div>
                            <strong>198</strong>
                            <span>Following</span>
                        </div>
                    </div>

                    <button className="profile-button">
                        Edit Profile
                    </button>
                </aside>

                <form className="post-form" onSubmit={handleSubmit}>
                    <textarea
                        value={postText}
                        onChange={(event) => setPostText(event.target.value)}
                        placeholder="Share something about ABBA..."
                    />

                    <button type="submit">
                        Post
                    </button>
                </form>

                <section className="post-list">
                    {posts.map((post) => (
                        <article className="community-post" key={post.id}>
                            <div className="post-header">
                                <strong>{post.author}</strong>
                                <span>{post.createdAt}</span>
                            </div>

                            <p>{post.content}</p>

                            <div className="post-actions">
                                <button>♡ 0</button>
                                <button>◇ 0</button>
                                <button>Comment</button>
                            </div>
                        </article>
                        
                    ))}
                    
                        <article className="community-post">
                        <div className="post-header">
                            <strong>Elena Starling</strong>
                            <span>2 hours ago</span>
                        </div>

                        <p>
                            There is something magical about the way this song
                            builds. Timeless!
                        </p>

                        <div className="song-preview">
                            <div className="song-cover">✦</div>

                            <div>
                                <strong>Dancing Queen</strong>
                                <span>Arrival · 1976</span>
                            </div>

                            <button className="play-button">
                                ▶
                            </button>
                        </div>

                        <div className="post-actions">
                            <button
                                className={liked ? "post-action liked" : "post-action"}
                                onClick={handleLike}
                            >
                                {liked ? "♥" : "♡"} {likeCount}
                            </button>                            <button>◇ 24</button>
                            <button>Comment</button>
                        </div>
                    </article>

                    <article className="community-post">
                        <div className="post-header">
                            <strong>Marina79</strong>
                            <span>1 hour ago</span>
                        </div>

                        <p>
                            ABBA's music still gives me chills every time.
                        </p>

                        <div className="post-actions">
                            <button>♡ 42</button>
                            <button>◇ 9</button>
                            <button>Comment</button>
                        </div>
                    </article>
                </section>
            </section>
        </main>
    );
}

export default Community;