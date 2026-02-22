import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkAuthStatus = async () => {
        try {
            const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";
            const response = await axios.get(`${API_BASE}/api/user/check-auth`, {
                withCredentials: true // Important to send cookies
            });

            if (response.data.data.isAuthenticated) {
                setIsAuthenticated(true);
                // We might need to modify checkAuth backend to return user details as well
                setUser(response.data.data.user || null);
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const login = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
    };

    const logout = async () => {
        try {
            const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";
            await axios.post(`${API_BASE}/api/user/logout`, {}, {
                withCredentials: true
            });
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            setIsAuthenticated(false);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};
