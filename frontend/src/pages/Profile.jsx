import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Profile() {
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
    });

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await api.get("/me");

                setProfile(response.data);

                setForm({
                    name: response.data.name,
                    email: response.data.email,
                });
            } catch (error) {
                setError("Failed to load profile.");
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, []);

    useEffect(() => {
        if (!success) {
            return;
        }

        const timer = setTimeout(() => {
            setSuccess("");
        }, 5000);

        return () => {
            clearTimeout(timer);
        };
    }, [success]);

    function handleChange(event) {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    }

    function startEditing() {
        setSuccess("");
        setError("");
        setEditing(true);
    }

    function cancelEditing() {
        setForm({
            name: profile.name,
            email: profile.email,
        });

        setError("");
        setEditing(false);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const response = await api.put("/me", form);
            const updatedUser = response.data.user;

            setProfile(updatedUser);

            setForm({
                name: updatedUser.name,
                email: updatedUser.email,
            });

            localStorage.setItem(
                "user",
                JSON.stringify(updatedUser)
            );

            window.dispatchEvent(
                new Event("auth-changed")
            );

            setEditing(false);
            setSuccess("Profile updated successfully.");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update profile."
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <main className="profile-page">
                <p>Loading profile...</p>
            </main>
        );
    }

    if (!profile) {
        return (
            <main className="profile-page">
                <p className="error">
                    {error || "Profile not found."}
                </p>

                <Link to="/login">
                    Login
                </Link>
            </main>
        );
    }

    const initials = profile.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <main className="profile-page">
            <section className="profile-header">
                <div className="profile-avatar-large">
                    {initials}
                </div>

                <p className="eyebrow">MY PROFILE</p>

                {editing ? (
                    <form
                        className="profile-edit-form"
                        onSubmit={handleSubmit}
                    >
                        <label htmlFor="name">
                            Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />

                        <div className="profile-form-actions">
                            <button
                                type="submit"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>

                            <button
                                type="button"
                                onClick={cancelEditing}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <h1>{profile.name}</h1>
                        <p>{profile.email}</p>

                        <button
                            className="profile-edit-button"
                            onClick={startEditing}
                        >
                            Edit Profile
                        </button>
                    </>
                )}

                {error && (
                    <p className="error">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="profile-success">
                        {success}
                    </p>
                )}
            </section>

            <section className="profile-stat-grid">
                <div className="profile-stat">
                    <strong>
                        {profile.posts_count || 0}
                    </strong>

                    <span>Posts</span>
                </div>

                <div className="profile-stat">
                    <strong>
                        {profile.comments_count || 0}
                    </strong>

                    <span>Comments</span>
                </div>

                <div className="profile-stat">
                    <strong>
                        {profile.likes_count || 0}
                    </strong>

                    <span>Liked Posts</span>
                </div>
            </section>

            <Link
                className="profile-back-link"
                to="/community"
            >
                Back to Community
            </Link>
        </main>
    );
}

export default Profile;