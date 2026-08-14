import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../styles/AdminLogin.css";

function AdminLogin() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    // ========================================
    // LOGIN
    // ========================================

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/admin/login`,
                {
                    username,
                    password
                }
            );


            // ========================================
            // SAVE JWT TOKEN
            // ========================================

            localStorage.setItem(
                "adminToken",
                response.data.token
            );


            // ========================================
            // GO TO ADMIN FEEDBACK
            // ========================================

            navigate("/admin/feedback");

        } catch (error) {

            console.error(
                "Admin login failed:",
                error
            );

            setError(
                "Invalid username or password."
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="admin-login-page">

            <div className="admin-login-card">


                {/* ========================================
                    HEADER
                ======================================== */}

                <div className="admin-login-header">

                    <div className="admin-login-icon">
                        🔐
                    </div>

                    <span className="admin-login-eyebrow">
                        ADMIN ACCESS
                    </span>

                    <h1>
                        Welcome Back
                    </h1>

                    <p>
                        Login to manage TrackTally
                        feedback.
                    </p>

                </div>


                {/* ========================================
                    FORM
                ======================================== */}

                <form
                    className="admin-login-form"
                    onSubmit={handleLogin}
                >


                    {/* ========================================
                        USERNAME
                    ======================================== */}

                    <div className="admin-login-field">

                        <label htmlFor="admin-username">
                            Username
                        </label>

                        <input
                            id="admin-username"
                            type="text"
                            value={username}
                            onChange={(e) =>
                                setUsername(
                                    e.target.value
                                )
                            }
                            placeholder="Enter admin username"
                            autoComplete="username"
                            required
                        />

                    </div>


                    {/* ========================================
                        PASSWORD
                    ======================================== */}

                    <div className="admin-login-field">

                        <label htmlFor="admin-password">
                            Password
                        </label>

                        <input
                            id="admin-password"
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Enter admin password"
                            autoComplete="current-password"
                            required
                        />

                    </div>


                    {/* ========================================
                        ERROR
                    ======================================== */}

                    {error && (

                        <div className="admin-login-error">
                            ⚠️ {error}
                        </div>

                    )}


                    {/* ========================================
                        LOGIN BUTTON
                    ======================================== */}

                    <button
                        type="submit"
                        className="admin-login-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Signing in..."
                            : "Sign In"
                        }

                    </button>

                </form>


                {/* ========================================
                    FOOTER
                ======================================== */}

                <div className="admin-login-footer">

                    🔒 Authorized TrackTally admin access only

                </div>


            </div>

        </div>

    );
}

export default AdminLogin;