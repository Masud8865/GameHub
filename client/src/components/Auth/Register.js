import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaGithub,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const API_BASE =
    process.env.REACT_APP_API_BASE || "http://localhost:5000";

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  // handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // register submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      await axios.post(`${API_BASE}/api/user/register`, {
        username: form.username,
        email: form.email,
        password: form.password,
      }).then(async () => {
        // login after registration
        const res = await axios.post(`${API_BASE}/api/user/login`, {
          username: form.email,
          password: form.password,
        }, {
          withCredentials: true
        });

        login(res.data.data.user);

        navigate("/");
      })
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    }
  };

  // OAuth redirects
  const handleGoogleRegister = () => {
    window.location.href = `${API_BASE}/api/auth/google`;
  };

  const handleGithubRegister = () => {
    window.location.href = `${API_BASE}/api/auth/github`;
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={{ textAlign: "center" }}>Create Account</h2>

        {error && <p style={styles.error}>{error}</p>}

        {/* Username */}
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          style={styles.input}
        />

        {/* Email */}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
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
            style={styles.input}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={styles.eye}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Confirm Password */}
        <div style={styles.passwordWrapper}>
          <input
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <span
            onClick={() => setShowConfirm(!showConfirm)}
            style={styles.eye}
          >
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit" style={styles.registerBtn}>
          Register
        </button>

        {/* Divider */}
        <div style={styles.divider}>OR</div>

        {/* OAuth Buttons */}
        <button
          type="button"
          onClick={handleGoogleRegister}
          style={{ ...styles.oauthBtn, background: "#db4437" }}
        >
          <FaGoogle /> Register with Google
        </button>

        <button
          type="button"
          onClick={handleGithubRegister}
          style={{ ...styles.oauthBtn, background: "#24292e" }}
        >
          <FaGithub /> Register with GitHub
        </button>
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
    padding: "30px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  passwordWrapper: {
    position: "relative",
  },
  eye: {
    position: "absolute",
    right: "15px",
    top: "30%",
    cursor: "pointer",
  },
  registerBtn: {
    width: "100%",
    padding: "12px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "5px",
  },
  oauthBtn: {
    width: "100%",
    padding: "12px",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    marginTop: "10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  divider: {
    textAlign: "center",
    margin: "15px 0",
    color: "#888",
  },
  error: {
    color: "red",
    marginBottom: "10px",
    textAlign: "center",
  },
};

export default Register;