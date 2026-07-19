function Home() {
    return (
        <main className="home-page">
            <section className="hero-section">
                <div className="hero-text">
                    <p className="eyebrow">THE MUSIC LIVES ON</p>

                    <h1>ABBA</h1>

                    <p>
                        Explore the music, memories and timeless legacy
                        of one of the world's most iconic pop groups.
                    </p>

                    <div className="hero-actions">
                        <a className="primary-button" href="/albums">
                            Explore Albums
                        </a>

                        <a className="secondary-button" href="/gallery">
                            View Gallery
                        </a>
                    </div>
                </div>

                <div className="hero-image">
                    <img
                        src="images/Home/ABBAwallpapers.jpeg"
                        alt="ABBA band"
                    />
                </div>
            </section>

            <section className="home-section">
                <div className="section-heading">
                    <p className="eyebrow">DISCOVER</p>
                    <h2>Featured Moments</h2>
                </div>

                <div className="feature-grid">
                    <article
                        className="feature-card feature-card-one"
                        style={{
                            backgroundImage:
                                "url('images/Home/s-l1200.jpg')",
                        }}
                    >
                        <div className="feature-overlay">
                            <h3>Timeless Pop Legends</h3>
                            <p>Discover ABBA's musical journey.</p>
                        </div>
                    </article>

                    <article
                        className="feature-card feature-card-two"
                        style={{
                            backgroundImage:
                                "url('images/Home/ABBAfever.jpeg')",
                        }}
                    >
                        <div className="feature-overlay">
                            <h3>ABBA Fever</h3>
                            <p>Experience the ultimate pop sensation.</p>
                        </div>
                    </article>

                    <article
                        className="feature-card feature-card-three"
                        style={{
                            backgroundImage:
                                "url('/images/Home/EhMAuWcXcAApZO5.jpeg')",
                        }}
                    >
                        <div className="feature-overlay">
                            <h3>Disco Diva</h3>
                            <p>Let the music take over.</p>
                        </div>
                    </article>
                </div>
            </section>

            <section className="home-section events-section">
                <div className="section-heading">
                    <p className="eyebrow">WHAT'S HAPPENING</p>
                    <h2>Upcoming Events</h2>
                </div>

                <div className="event-list">
                    <article className="event-row">
                        <div className="event-date">
                            <strong>14</strong>
                            <span>JUN</span>
                        </div>

                        <div>
                            <h3>Summer Nights Live</h3>
                            <p>Arena Hall, London</p>
                        </div>

                        <button className="event-button">
                            View Event
                        </button>
                    </article>

                    <article className="event-row">
                        <div className="event-date">
                            <strong>21</strong>
                            <span>JUN</span>
                        </div>

                        <div>
                            <h3>Music of the 70s Festival</h3>
                            <p>Open Air Theatre, Berlin</p>
                        </div>

                        <button className="event-button">
                            View Event
                        </button>
                    </article>
                </div>
            </section>
        </main>
    );
}

export default Home;