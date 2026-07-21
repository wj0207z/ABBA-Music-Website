import { useState } from "react";

function Gallery() {
    const imagePath = "/images/biography/photogrid/";

    const [selectedImage, setSelectedImage] = useState(null);

    function handleGalleryClick(event) {
        const image = event.target.closest("img");

        if (image) {
            setSelectedImage(image.src);
        }
    }

    function closeModal() {
        setSelectedImage(null);
    }

    return (
        <main className="gallery-page">
            <h1>US</h1>

            <div className="scrollContainer">
                <div className="UScon">
                    <div
                        className="imgGal"
                        onClick={handleGalleryClick}
                    >
                        <div className="column">
                            <div className="img1">
                                <img
                                    src={`${imagePath}1.jpg`}
                                    alt="ABBA"
                                />
                            </div>

                            <div className="img2">
                                <img
                                    src={`${imagePath}2.jpg`}
                                    alt="ABBA"
                                />
                            </div>
                        </div>

                        <div className="column">
                            <div className="img3">
                                <img
                                    src={`${imagePath}3.jpg`}
                                    alt="ABBA"
                                />
                            </div>

                            <div className="img4">
                                <img
                                    src={`${imagePath}4.jpg`}
                                    alt="ABBA"
                                />
                            </div>
                        </div>

                        <div className="column">
                            <div className="img5">
                                <img
                                    src={`${imagePath}5.jpg`}
                                    alt="ABBA"
                                />
                            </div>

                            <div className="img67">
                                <div className="img6">
                                    <img
                                        src={`${imagePath}6.jpeg`}
                                        alt="ABBA"
                                    />
                                </div>

                                <div className="img7">
                                    <img
                                        src={`${imagePath}7.png`}
                                        alt="ABBA"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="column">
                            <div className="img89">
                                <div className="img8">
                                    <img
                                        src={`${imagePath}8.jpg`}
                                        alt="ABBA"
                                    />
                                </div>

                                <div className="img9">
                                    <img
                                        src={`${imagePath}9.png`}
                                        alt="ABBA"
                                    />
                                </div>
                            </div>

                            <div className="img10">
                                <img
                                    src={`${imagePath}10.jpg`}
                                    alt="ABBA"
                                />
                            </div>
                        </div>

                        <div className="column">
                            <div className="img11">
                                <img
                                    src={`${imagePath}11.jpg`}
                                    alt="ABBA"
                                />
                            </div>

                            <div className="img12">
                                <img
                                    src={`${imagePath}12.jpg`}
                                    alt="ABBA"
                                />
                            </div>
                        </div>

                        <div className="column">
                            <div className="img13">
                                <img
                                    src={`${imagePath}13.jpg`}
                                    alt="ABBA"
                                />
                            </div>

                            <div className="img14">
                                <img
                                    src={`${imagePath}14.jpg`}
                                    alt="ABBA"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {selectedImage && (
                <div
                    className="gallery-modal"
                    onClick={closeModal}
                >
                    <button
                        className="gallery-modal-close"
                        onClick={closeModal}
                    >
                        ×
                    </button>

                    <img
                        src={selectedImage}
                        alt="Selected ABBA gallery image"
                        onClick={(event) => event.stopPropagation()}
                    />
                </div>
            )}
        </main>
    );
}

export default Gallery;