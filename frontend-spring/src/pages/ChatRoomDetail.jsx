import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import echo from "../echo";

function ChatRoomDetail() {
    const { id } = useParams();

    const [room, setRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState("");

    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchRoomData() {
            try {
                const [roomResponse, messagesResponse] = await Promise.all([
                    api.get(`/rooms/${id}`),
                    api.get(`/rooms/${id}/messages`),
                ]);

                setRoom(roomResponse.data);
                setMessages(messagesResponse.data);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load this chat room."
                );
            } finally {
                setLoading(false);
            }
        }

        fetchRoomData();
    }, [id]);

    async function handleSubmit(event) {
        event.preventDefault();

        const trimmedContent = content.trim();

        if (!trimmedContent) {
            return;
        }

        setSending(true);
        setError("");

        try {
            const response = await api.post(`/rooms/${id}/messages`, {
                content: trimmedContent,
            });

            const sentMessage = response.data.data;

            setMessages((currentMessages) => {
                const alreadyExists = currentMessages.some(
                    (message) => message.id === sentMessage.id
                );

                if (alreadyExists) {
                    return currentMessages;
                }

                return [
                    ...currentMessages,
                    sentMessage,
                ];
            });

            setContent("");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to send message."
            );
        } finally {
            setSending(false);
        }
    }

    useEffect(() => {
        const channelName = `room.${id}`;

        echo.channel(channelName).listen(
            "MessageSent",
            (event) => {
                const incomingMessage = event.message;

                setMessages((currentMessages) => {
                    const alreadyExists = currentMessages.some(
                        (message) => message.id === incomingMessage.id
                    );

                    if (alreadyExists) {
                        return currentMessages;
                    }

                    return [
                        ...currentMessages,
                        incomingMessage,
                    ];
                });
            }
        );

        return () => {
            echo.leave(channelName);
        };
    }, [id]);

    if (loading) {
        return (
            <main className="chat-detail-page">
                <p>Loading chat room...</p>
            </main>
        );
    }

    if (error && !room) {
        return (
            <main className="chat-detail-page">
                <p className="error">{error}</p>
                <Link className="back-link" to="/chatroom">
                    Back to chat rooms
                </Link>
            </main>
        );
    }

    return (
        <main className="chat-detail-page">
            <Link className="back-link" to="/chatroom">
                Back to chat rooms
            </Link>

            <section className="chat-detail-header">
                <p className="eyebrow">COMMUNITY CHAT</p>
                <h1>{room.name}</h1>
                <p>{room.description || "No room description."}</p>
            </section>

            <section className="chat-panel">
                <div className="message-list">
                    {messages.length === 0 ? (
                        <p className="empty-messages">
                            No messages yet. Start the conversation.
                        </p>
                    ) : (
                        messages.map((message) => (
                            <article
                                className="message-item"
                                key={message.id}
                            >
                                <div className="message-avatar">
                                    {message.user?.avatar ? (
                                        <img
                                            src={`http://127.0.0.1:8000/storage/${message.user.avatar}`}
                                            alt=""
                                        />
                                    ) : (
                                        <img
                                            src="/images/nav_icon/user.png"
                                            alt=""
                                        />
                                    )}
                                </div>

                                <div className="message-content">
                                    <div className="message-meta">
                                        <strong>
                                            {message.user?.name || "Unknown user"}
                                        </strong>

                                        <span>
                                            {new Date(
                                                message.created_at
                                            ).toLocaleString()}
                                        </span>
                                    </div>

                                    <p>{message.content}</p>
                                </div>
                            </article>
                        ))
                    )}
                </div>

                {error && <p className="error">{error}</p>}

                <form
                    className="message-form"
                    onSubmit={handleSubmit}
                >
                    <textarea
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                        placeholder="Write a message..."
                        rows="3"
                        disabled={sending}
                    />

                    <button type="submit" disabled={sending}>
                        {sending ? "Sending..." : "Send Message"}
                    </button>
                </form>
            </section>
        </main>
    );
}

export default ChatRoomDetail;