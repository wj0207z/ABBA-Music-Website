import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
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

        setError("");
        setLoading(true);

        try {
            const response = await api.post("/register", form);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            window.dispatchEvent(new Event("auth-changed"));
            
            navigate("/community");
        } catch (error) {
            console.error(
                error.response?.data || error.message
            );

            if (error.response?.data?.errors) {
                const validationErrors =
                    Object.values(error.response.data.errors)
                        .flat()
                        .join(" ");

                setError(validationErrors);
            } else {
                setError(
                    error.response?.data?.message ||
                    "Registration failed."
                );
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-card">
                <p className="eyebrow">JOIN THE COMMUNITY</p>

                <h1>Register</h1>

                {error && (
                    <p className="error">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">
                        Name
                    </label>

                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

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
                        minLength="8"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating account..."
                            : "Create Account"}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account?{" "}
                    <Link to="/login">
                        Login
                    </Link>
                </p>
            </section>
        </main>
    );
}

export default Register;