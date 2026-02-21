import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE}/api/auth/register`, { username, password });
            navigate('/login');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
            
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
            />

            {/* Password Field with Eye Icon */}
            <div style={{ position: "relative", marginBottom: "15px" }}>
                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    style={{ width: "100%", padding: "10px", paddingRight: "40px" }}
                />

                <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                        position: "absolute",
                        right: "20px",
                        top: "55%",
                        transform: "translateY(-50%)",
                        cursor: "pointer"
                    }}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
            </div>

            <button type="submit" style={{ width: "100%", padding: "10px" }}>
                Register
            </button>
        </form>
    );
};

export default Register;