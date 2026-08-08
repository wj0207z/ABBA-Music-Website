import { useMusic } from "../context/MusicContext";

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
}

function MusicPlayer() {
    const {
        currentSong,
        isPlaying,
        currentTime,
        duration,
        togglePlay,
        playNext,
        playPrevious,
        seek,
    } = useMusic();

    if (!currentSong) {
        return null;
    }

    return (
        <aside className="music-player">
            <div className="music-player-song">
                <img
                    className={
                        isPlaying
                            ? "music-player-cover spinning"
                            : "music-player-cover"
                    }
                    src={currentSong.cover}
                    alt={currentSong.title}
                />

                <div className="music-player-details">
                    <strong>{currentSong.title}</strong>
                    <span>{currentSong.artist}</span>
                </div>
            </div>

            <div className="music-player-controls">
                <button
                    type="button"
                    onClick={playPrevious}
                    title="Previous song"
                    aria-label="Previous song"
                >
                    |&lt;
                </button>

                <button
                    className="music-play-button"
                    type="button"
                    onClick={togglePlay}
                    title={isPlaying ? "Pause" : "Play"}
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? "||" : ">"}
                </button>

                <button
                    type="button"
                    onClick={playNext}
                    title="Next song"
                    aria-label="Next song"
                >
                    &gt;|
                </button>
            </div>

            <div className="music-player-progress">
                <span>{formatTime(currentTime)}</span>

                <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={(event) => seek(Number(event.target.value))}
                    aria-label="Song progress"
                />

                <span>{formatTime(duration)}</span>
            </div>
        </aside>
    );
}

export default MusicPlayer;