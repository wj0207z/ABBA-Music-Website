import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import songs from "../data/songs";

const MusicContext = createContext(null);

export function MusicProvider({ children }) {
    const audioRef = useRef(new Audio());

    const [currentSong, setCurrentSong] = useState(songs[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;

        audio.src = currentSong.audio;
        audio.load();

        function handleLoadedMetadata() {
            setDuration(audio.duration);
        }

        function handleTimeUpdate() {
            setCurrentTime(audio.currentTime);
        }

        function handleSongEnded() {
            playNext();
        }

        audio.addEventListener(
            "loadedmetadata",
            handleLoadedMetadata
        );

        audio.addEventListener(
            "timeupdate",
            handleTimeUpdate
        );

        audio.addEventListener(
            "ended",
            handleSongEnded
        );

        return () => {
            audio.removeEventListener(
                "loadedmetadata",
                handleLoadedMetadata
            );

            audio.removeEventListener(
                "timeupdate",
                handleTimeUpdate
            );

            audio.removeEventListener(
                "ended",
                handleSongEnded
            );

            audio.pause();
        };
    }, [currentSong]);

    useEffect(() => {
        const audio = audioRef.current;

        if (isPlaying) {
            audio.play().catch(() => {
                setIsPlaying(false);
            });
        } else {
            audio.pause();
        }
    }, [isPlaying, currentSong]);

    function playSong(song) {
        setCurrentSong(song);
        setIsPlaying(true);
    }

    function togglePlay() {
        setIsPlaying((current) => !current);
    }

    function playNext() {
        const currentIndex = songs.findIndex(
            (song) => song.id === currentSong.id
        );

        const nextIndex =
            (currentIndex + 1) % songs.length;

        setCurrentSong(songs[nextIndex]);
        setIsPlaying(true);
    }

    function playPrevious() {
        const currentIndex = songs.findIndex(
            (song) => song.id === currentSong.id
        );

        const previousIndex =
            (currentIndex - 1 + songs.length) %
            songs.length;

        setCurrentSong(songs[previousIndex]);
        setIsPlaying(true);
    }

    function seek(time) {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    }

    return (
        <MusicContext.Provider
            value={{
                songs,
                currentSong,
                isPlaying,
                currentTime,
                duration,
                playSong,
                togglePlay,
                playNext,
                playPrevious,
                seek,
            }}
        >
            {children}
        </MusicContext.Provider>
    );
}

export function useMusic() {
    return useContext(MusicContext);
}