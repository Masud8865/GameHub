import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const API_BASE =
    process.env.REACT_APP_API_BASE || "http://localhost:5000";

  const [form, setForm] = useState({
    identifier: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit login
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/user/login`, {
        username: form.identifier.trim(),
        password: form.password,
      }, {
        withCredentials: true
      });

      login(res.data.data.user);

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid username or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Welcome Back</h2>

        {error && <p style={styles.error}>{error}</p>}

        {/* Username / Email */}
        <input
          name="identifier"
          placeholder="Username or Email"
          value={form.identifier}
          onChange={handleChange}
          required
          autoComplete="username"
          style={styles.input}
        />

        {/* Password */}
        <div style={styles.passwordWrapper}>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            style={styles.input}
          />

          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            style={styles.eyeBtn}
            aria-label="Toggle password visibility"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Remember + Forgot */}
        <div style={styles.optionsRow}>
          <label style={{ cursor: "pointer" }}>
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
            />{" "}
            Remember me
          </label>

          <Link to="/forgot-password" style={styles.link}>
            Forgot password?
          </Link>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.loginBtn,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={styles.registerText}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f4f6f8",
  },
  form: {
    width: "400px",
    padding: "32px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  passwordWrapper: {
    position: "relative",
  },
  eyeBtn: {
    position: "absolute",
    right: "0px",
    top: "40%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    color: "#444",
  },
  optionsRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "18px",
    fontSize: "14px",
  },
  loginBtn: {
    width: "100%",
    padding: "12px",
    background: "#3b82b6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  link: {
    color: "#3b82b6",
    textDecoration: "none",
  },
  registerText: {
    textAlign: "center",
    marginTop: "18px",
    fontSize: "14px",
  },
  error: {
    color: "#e11d48",
    textAlign: "center",
    marginBottom: "12px",
  },
};

export default Login;