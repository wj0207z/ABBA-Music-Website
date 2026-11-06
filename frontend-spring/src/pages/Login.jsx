import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSpringAuth } from "../context/SpringAuthContext";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, checkingSession } = useSpringAuth();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(event) {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setLoading(true);
        setError("");

        try {
            await login(form.email.trim(), form.password);
            navigate("/community");
        } catch (error) {

            const status = error.response?.status;

            setError(
                status === 401
                    ? "Invalid email or password."
                    : status === 403
                    ? "Security token expired. Please try again."
                    : "Could not log in. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-card">
                <p className="eyebrow">WELCOME BACK</p>

                <h1>Login</h1>
                {location.state?.message && (
                    <p role="status">{location.state.message}</p>
                )}

                {error && (
                    <p className="error">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">
                        Email
                    </label>

                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="password">
                        Password
                    </label>

                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading || checkingSession}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>
                </form>

                <p className="auth-switch">
                    New to the community?{" "}
                    <Link to="/register">
                        Register now
                    </Link>
                </p>
            </section>
        </main>
    );
}

export default Login;