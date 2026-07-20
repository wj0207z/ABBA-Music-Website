function Community() {
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

                <section className="post-list">
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
                            <button>♡ 74</button>
                            <button>◇ 24</button>
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