import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <header className="navbar">
            <div className="nav-brand">
                <h2>🎮 GameHub</h2>
            </div>
            <nav className="nav-links">
                <Link to="/">Home</Link>
                {!isAuthenticated ? (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                ) : (
                    <>
                        <span style={{ marginRight: "1rem" }}>Welcome, {user?.username}</span>
                        <button onClick={handleLogout} className="logout-btn" style={{ background: "transparent", border: "none", color: "red", cursor: "pointer", fontSize: "1rem", fontWeight: "bold" }}>Logout</button>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
