import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const API_BASE =
                process.env.REACT_APP_API_BASE || 'http://localhost:5000';

            const res = await axios.post(
                `${API_BASE}/api/auth/login`,
                { username, password }
            );

            localStorage.setItem('token', res.data.token);
            navigate('/');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{ maxWidth: "400px", margin: "auto" }}
        >
            {/* Username */}
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "15px"
                }}
            />

            {/* Password Field */}
            <div style={{ position: "relative", marginBottom: "15px" }}>
                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    style={{
                        width: "100%",
                        padding: "10px",
                        paddingRight: "45px",
                        position: "relative"
                    }}
                />

                {/* Eye Icon Button */}
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                        position: "absolute",
                        right: "0px",
                        top: "40%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        zIndex: 2,
                        color: "#333",
                        fontSize: "16px"
                    }}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>

            {/* Login Button */}
            <button
                type="submit"
                style={{
                    width: "100%",
                    padding: "10px",
                    background: "#3b82b6",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer"
                }}
            >
                Login
            </button>
        </form>
    );
};

export default Login;