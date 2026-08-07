import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const backendUrl = "http://127.0.0.1:8000";

function Profile() {
    const [profile, setProfile] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
    });

    const [passwordForm, setPasswordForm] = useState({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const [avatarFile, setAvatarFile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [passwordSaving, setPasswordSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");

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

        return () => clearTimeout(timer);
    }, [success]);

    useEffect(() => {
        if (!passwordSuccess) {
            return;
        }

        const timer = setTimeout(() => {
            setPasswordSuccess("");
        }, 5000);

        return () => clearTimeout(timer);
    }, [passwordSuccess]);

    function handleChange(event) {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    }

    function handlePasswordChange(event) {
        setPasswordForm({
            ...passwordForm,
            [event.target.name]: event.target.value,
        });
    }

    function handleAvatarChange(event) {
        const file = event.target.files[0];

        if (file) {
            setAvatarFile(file);
        }
    }

    function getInitials(name) {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    }

    function getAvatarUrl(avatar) {
        if (!avatar) {
            return null;
        }

        return `${backendUrl}/storage/${avatar}`;
    }

    function startEditing() {
        setError("");
        setSuccess("");
        setPasswordError("");
        setPasswordSuccess("");
        setEditing(true);
    }

    function cancelEditing() {
        setForm({
            name: profile.name,
            email: profile.email,
        });

        setPasswordForm({
            current_password: "",
            password: "",
            password_confirmation: "",
        });

        setAvatarFile(null);
        setError("");
        setPasswordError("");
        setEditing(false);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setSaving(true);
        setError("");
        setSuccess("");

        const formData = new FormData();

        formData.append("_method", "PUT");
        formData.append("name", form.name);
        formData.append("email", form.email);

        if (avatarFile) {
            formData.append("avatar", avatarFile);
        }

        try {
            const response = await api.post(
                "/me",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const updatedUser = response.data.user;

            setProfile(updatedUser);

            setForm({
                name: updatedUser.name,
                email: updatedUser.email,
            });

            setAvatarFile(null);

            localStorage.setItem(
                "user",
                JSON.stringify(updatedUser)
            );

            window.dispatchEvent(
                new Event("auth-changed")
            );

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

    async function handlePasswordSubmit(event) {
        event.preventDefault();

        setPasswordSaving(true);
        setPasswordError("");
        setPasswordSuccess("");

        try {
            await api.put(
                "/me/password",
                passwordForm
            );

            setPasswordForm({
                current_password: "",
                password: "",
                password_confirmation: "",
            });

            setPasswordSuccess(
                "Password updated successfully."
            );
        } catch (error) {
            setPasswordError(
                error.response?.data?.message ||
                "Failed to update password."
            );
        } finally {
            setPasswordSaving(false);
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

    const avatarUrl = getAvatarUrl(profile.avatar);

    return (
        <main className="profile-page">
            <section className="profile-header">
                <div className="profile-avatar-large">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={profile.name}
                        />
                    ) : (
                        getInitials(profile.name)
                    )}
                </div>

                <p className="eyebrow">MY PROFILE</p>

                {editing ? (
                    <>
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

                            <label htmlFor="avatar">
                                Profile Picture
                            </label>

                            <input
                                id="avatar"
                                name="avatar"
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={handleAvatarChange}
                            />

                            {avatarFile && (
                                <p className="selected-file">
                                    Selected: {avatarFile.name}
                                </p>
                            )}

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

                        <section className="password-section">
                            <p className="eyebrow">
                                SECURITY
                            </p>

                            <h2>Change Password</h2>

                            {passwordError && (
                                <p className="error">
                                    {passwordError}
                                </p>
                            )}

                            {passwordSuccess && (
                                <p className="profile-success">
                                    {passwordSuccess}
                                </p>
                            )}

                            <form
                                className="password-form"
                                onSubmit={handlePasswordSubmit}
                            >
                                <label htmlFor="current_password">
                                    Current Password
                                </label>

                                <input
                                    id="current_password"
                                    name="current_password"
                                    type="password"
                                    value={
                                        passwordForm.current_password
                                    }
                                    onChange={
                                        handlePasswordChange
                                    }
                                    required
                                />

                                <label htmlFor="password">
                                    New Password
                                </label>

                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={
                                        passwordForm.password
                                    }
                                    onChange={
                                        handlePasswordChange
                                    }
                                    required
                                />

                                <label htmlFor="password_confirmation">
                                    Confirm New Password
                                </label>

                                <input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    value={
                                        passwordForm.password_confirmation
                                    }
                                    onChange={
                                        handlePasswordChange
                                    }
                                    required
                                />

                                <button
                                    type="submit"
                                    disabled={passwordSaving}
                                >
                                    {passwordSaving
                                        ? "Updating..."
                                        : "Update Password"}
                                </button>
                            </form>
                        </section>
                    </>
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