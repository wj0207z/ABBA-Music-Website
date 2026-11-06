import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSpringAuth } from "../context/SpringAuthContext";

function SpringLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const {
        user,
        checkingSession,
        sessionError,
        login,
        logout
    } = useSpringAuth();

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            await login(email.trim(), password);
            setPassword("");
            navigate("/community");
        } catch (error) {
            const status = error.response?.status;

            setError(
                status === 401
                    ? "Invalid email or password."
                    : status === 403
                    ? "Security token expired. Please try again."
                    : "Could not complete login. Please try again."
            );
        } finally {
            setLoading(false);
            }
        }

        async function handleLogout(){
            setError("");
            setLoading(true);

            try {
                await logout();
            } catch {
                setError("Could not log out. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        if (checkingSession) {
            return (
                <main className="community_page">
                    <p>Checking your session...</p>
                </main>
            );
        }

    return (
        <main className="community-page">
            <h1>Sign in to ABBA</h1>

            {sessionError && <p role="alert">{sessionError}</p>}
            {error && <p role="alert">{error}</p>}

            {user ? (
                <section>
                    <p>Signed in as {user.name}</p>
                    <Link to="/spring-posts">View Posts</Link>

                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loading}
                        >
                            {loading ? "Signing out..." : "Sign out"}
                    </button>
                </section>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="spring-email">Email</label>
                        <input
                            id="spring-email"
                            type="email"
                            autoComplete="username"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="spring-password">Password</label>
                        <input
                            id="spring-password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading || checkingSession}>
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
            )}
        </main>
    );
}

export default SpringLogin;