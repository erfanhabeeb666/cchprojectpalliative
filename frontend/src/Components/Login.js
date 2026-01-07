import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { scheduleAutoLogout } from "../utils/auth";
// Removed old CSS imports to use new design system

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const apiUrl = process.env.REACT_APP_API_URL;

        try {
            const response = await axios.post(`${apiUrl}auth/authenticate`, {
                email,
                password,
            });

            const token = response.data.token;
            localStorage.setItem("jwtToken", token);
            scheduleAutoLogout();

            const decodedToken = jwtDecode(token);
            const role = decodedToken.userType;

            if (role === "ADMIN") {
                navigate("/admin");
            } else if (role === "VOLUNTEER") {
                navigate("/volunteer");
            } else {
                setError("Invalid role assigned");
            }
        } catch (err) {
            console.error("Login error", err);
            setError("Invalid email or password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at top right, #f0fdfa, #f8fafc)',
            padding: '1.5rem'
        }}>
            <div className="card" style={{
                width: '100%',
                maxWidth: '420px',
                padding: '3rem 2.5rem',
                borderRadius: 'var(--border-radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                border: '1px solid rgba(226, 232, 240, 0.8)'
            }}>
                <div className="text-center mb-8">
                    <div style={{
                        width: '64px',
                        height: '64px',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary-color)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.25rem auto',
                        fontSize: '1.75rem',
                        boxShadow: '0 4px 6px -1px rgba(13, 148, 136, 0.1)'
                    }}>
                        <i className="fas fa-heartbeat"></i>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">PASS CARE</h1>
                    <p className="text-secondary text-sm mt-2 font-medium">Palliative Care Information System</p>
                </div>

                <form onSubmit={handleLogin} className="mt-4">
                    <div className="mb-5">
                        <label className="block text-sm font-semibold text-primary mb-1.5" htmlFor="email">
                            Email Address
                        </label>
                        <div className="relative">
                            <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-muted"></i>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="input-field"
                                style={{ paddingLeft: '3rem', height: '48px' }}
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-primary mb-1.5" htmlFor="password">
                            Password
                        </label>
                        <div className="relative">
                            <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-muted"></i>
                            <input
                                type="password"
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="input-field"
                                style={{ paddingLeft: '3rem', height: '48px' }}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="mb-5 p-3.5 bg-red-50 text-red-600 text-sm font-medium rounded-lg flex items-center border border-red-100">
                            <i className="fas fa-exclamation-circle mr-2.5"></i>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary w-full py-3 text-lg shadow-md hover:shadow-lg transition-all mt-8"
                        disabled={isLoading}
                        style={{ width: '100%', justifyContent: 'center', height: '48px', marginTop: '1rem' }}
                    >
                        {isLoading ? (
                            <>
                                <i className="fas fa-circle-notch fa-spin mr-2"></i> Signing In...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-xs text-muted font-medium uppercase tracking-widest">
                    &copy; {new Date().getFullYear()} PASS Care System
                </div>
            </div>
        </div>
    );
};

export default Login;
