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
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            padding: '1rem'
        }}>
            <div className="card" style={{
                width: '100%',
                maxWidth: '400px',
                padding: '2.5rem',
                borderRadius: '1rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)'
            }}>
                <div className="text-center mb-8">
                    <div style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem auto',
                        fontSize: '1.5rem'
                    }}>
                        <i className="fas fa-heartbeat"></i>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">PASS CARE</h1>
                    <p className="text-gray-500 text-sm mt-2">Palliative Care Information System</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                            Email Address
                        </label>
                        <div className="relative">
                            <i className="fas fa-envelope absolute left-3 top-3 text-gray-400"></i>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="input-field"
                                style={{ paddingLeft: '2.5rem' }}
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                            Password
                        </label>
                        <div className="relative">
                            <i className="fas fa-lock absolute left-3 top-3 text-gray-400"></i>
                            <input
                                type="password"
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="input-field"
                                style={{ paddingLeft: '2.5rem' }}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center">
                            <i className="fas fa-exclamation-circle mr-2"></i>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary w-full py-3 text-lg shadow-md hover:shadow-lg transition-all mt-8"
                        disabled={isLoading}
                        style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
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

                <div className="mt-6 text-center text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} PASS Care System
                </div>
            </div>
        </div>
    );
};

export default Login;
