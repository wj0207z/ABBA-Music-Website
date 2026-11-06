import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import springApi, { getCsrf } from "../api/springApi";

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
            const csrf = await getCsrf();

            await springApi.post(
                "/register",
                {
                    name: form.name.trim(),
                    email: form.email.trim(),
                    password: form.password
                },
                {
                    headers: {
                        [csrf.headerName]: csrf.token,
                    },
                }
            );

            navigate("/login", {
                state: {
                    message: "Account created. Please sign in.",
                },
            });
    
        } catch (error) {
            const status = error.response?.status;
            const data = error.response?.data;

            if (data?.errors) {
                setError(Object.values(data.errors).flat().join(" "));
            } else if (status === 409) {
                setError("This email is already registered.");
            } else if (status === 403) {
                setError("Security token expired. Please try again.");
            } else {
                setError("Could not create your account. Please try again.");
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