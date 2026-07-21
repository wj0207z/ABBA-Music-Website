import { Link } from "react-router-dom";

const albums = [
    {
        slug: "ring-ring",
        title: "Ring Ring",
        year: "1973",
        image: "/images/albums/1_RingRing.jpg",
    },
    {
        slug: "waterloo",
        title: "Waterloo",
        year: "1974",
        image: "/images/albums/2_Waterloo.jpg",
    },
    {
        slug: "abba",
        title: "ABBA",
        year: "1975",
        image: "/images/albums/3_ABBA.jpg",
    },
    {
        slug: "arrival",
        title: "Arrival",
        year: "1976",
        image: "/images/albums/4_Arrival.jpg",
    },
    {
        slug: "the-album",
        title: "The Album",
        year: "1977",
        image: "/images/albums/5_Album.jpg",
    },
    {
        slug: "voulez-vous",
        title: "Voulez-Vous",
        year: "1979",
        image: "/images/albums/6_VoulezVous.jpg",
    },
];

function Albums() {
    return (
        <main className="albums-page">
            <section className="albums-heading">
                <p className="eyebrow">THE COLLECTION</p>
                <h1>Albums</h1>
                <p>
                    Explore the records that shaped ABBA's timeless musical
                    legacy.
                </p>
            </section>

            <section className="album-grid">
                {albums.map((album) => (
                    <article className="album-card" key={album.title}>
                        <img
                            src={album.image}
                            alt={`${album.title} album cover`}
                        />

                        <div className="album-card-content">
                            <h2>{album.title}</h2>
                            <p>{album.year}</p>

                            <Link to={`/albums/${album.slug}`}>
                                View Album
                            </Link>
                        </div>
                    </article>
                ))}
            </section>
        </main>
    );
}

export default Albums;