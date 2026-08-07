import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function ChatRoom() {
    const [rooms, setRooms] = useState([]);
    const [form, setForm] = useState({
        name: "",
        description: "",
    });

    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        async function fetchRooms() {
            try {
                const response = await api.get("/rooms");
                setRooms(response.data);
            } catch (error) {
                setError("Failed to load chat rooms.");
            } finally {
                setLoading(false);
            }
        }

        fetchRooms();
    }, []);

    function handleChange(event) {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setCreating(true);
        setError("");
        setSuccess("");

        try {
            const response = await api.post(
                "/rooms",
                form
            );

            setRooms((currentRooms) => [
                response.data.room,
                ...currentRooms,
            ]);

            setForm({
                name: "",
                description: "",
            });

            setSuccess("Room created successfully.");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to create room."
            );
        } finally {
            setCreating(false);
        }
    }

    return (
        <main className="chatroom-page">
            <section className="chatroom-heading">
                <p className="eyebrow">FAN COMMUNITY</p>

                <h1>Chat Rooms</h1>

                <p>
                    Join a room and talk about ABBA.
                </p>
            </section>

            <section className="chatroom-layout">
                <section className="room-create-card">
                    <h2>Create a Room</h2>

                    {error && (
                        <p className="error">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="chatroom-success">
                            {success}
                        </p>
                    )}

                    <form onSubmit={handleSubmit}>
                        <label htmlFor="room-name">
                            Room Name
                        </label>

                        <input
                            id="room-name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Example: ABBA Albums"
                            required
                        />

                        <label htmlFor="room-description">
                            Description
                        </label>

                        <textarea
                            id="room-description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="What can people discuss here?"
                        />

                        <button
                            type="submit"
                            disabled={creating}
                        >
                            {creating
                                ? "Creating..."
                                : "Create Room"}
                        </button>
                    </form>
                </section>

                <section className="room-list">
                    <h2>Available Rooms</h2>

                    {loading && (
                        <p>Loading rooms...</p>
                    )}

                    {!loading &&
                        rooms.length === 0 && (
                            <p>
                                No rooms yet.
                            </p>
                        )}

                    {!loading &&
                        rooms.map((room) => (
                            <Link
                                className="room-card"
                                to={`/chatroom/${room.id}`}
                                key={room.id}
                            >
                                <h3>{room.name}</h3>

                                <p>
                                    {room.description ||
                                        "No description provided."}
                                </p>

                                <span>
                                    Created by{" "}
                                    {room.creator?.name ||
                                        "Unknown user"}
                                </span>
                            </Link>
                        ))}
                </section>
            </section>
        </main>
    );
}

export default ChatRoom;