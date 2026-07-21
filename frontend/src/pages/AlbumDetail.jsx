import { Link, useParams } from "react-router-dom";

const albums = [
    {
        slug: "ring-ring",
        title: "Ring Ring",
        year: "1973",
        image: "/images/albums/1_RingRing.jpg",
        description:
            "ABBA's debut studio album, introducing their early pop sound.",
    },
    {
        slug: "waterloo",
        title: "Waterloo",
        year: "1974",
        image: "/images/albums/2_Waterloo.jpg",
        description:
            "The album that launched ABBA internationally after their Eurovision victory.",
    },
    {
        slug: "abba",
        title: "ABBA",
        year: "1975",
        image: "/images/albums/3_ABBA.jpg",
        description:
            "A collection of songs that established ABBA's signature style.",
    },
    {
        slug: "arrival",
        title: "Arrival",
        year: "1976",
        image: "/images/albums/4_Arrival.jpg",
        description:
            "One of ABBA's most successful albums, featuring several iconic songs.",
    },
    {
        slug: "the-album",
        title: "The Album",
        year: "1977",
        image: "/images/albums/5_Album.jpg",
        description:
            "An ambitious album connected to ABBA: The Movie.",
    },
    {
        slug: "voulez-vous",
        title: "Voulez-Vous",
        year: "1979",
        image: "/images/albums/6_VoulezVous.jpg",
        description:
            "A disco-influenced album filled with energetic and memorable tracks.",
    },
];

function AlbumDetail() {
    const { slug } = useParams();

    const album = albums.find((item) => item.slug === slug);

    if (!album) {
        return (
            <main className="album-detail-page">
                <h1>Album Not Found</h1>

                <p>We could not find the album you selected.</p>

                <Link to="/albums">Back to Albums</Link>
            </main>
        );
    }

    return (
        <main className="album-detail-page">
            <Link className="back-link" to="/albums">
                Back to Albums
            </Link>

            <section className="album-detail">
                <div className="album-detail-image">
                    <img
                        src={album.image}
                        alt={`${album.title} album cover`}
                    />
                </div>

                <div className="album-detail-content">
                    <p className="eyebrow">ABBA ALBUM</p>

                    <h1>{album.title}</h1>

                    <p className="album-year">{album.year}</p>

                    <p>{album.description}</p>

                    <h2>Tracklist</h2>

                    <ol>
                        <li>Opening Track</li>
                        <li>Second Track</li>
                        <li>Third Track</li>
                    </ol>
                </div>
            </section>
        </main>
    );
}

export default AlbumDetail;