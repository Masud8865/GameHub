import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Form data
    const [identifier, setIdentifier] = useState("");
    const [otp, setOtp] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [newPassword, setNewPassword] = useState("");

    // Step 1: Request OTP
    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const res = await axios.post(`${API_BASE}/api/user/forgot-password`, {
                username: identifier.trim(),
                email: identifier.trim(),
            });

            setSuccess(res.data.message || "OTP sent to your registered email");
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to request OTP. Ensure your username/email is correct.");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const res = await axios.post(`${API_BASE}/api/user/verify-otp`, {
                username: identifier.trim(),
                email: identifier.trim(),
                otp: otp.trim(),
            });

            setResetToken(res.data.data.resetToken);
            setSuccess("OTP Verified. Please enter your new password.");
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid or expired OTP");
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await axios.post(`${API_BASE}/api/user/reset-password`, {
                username: identifier.trim(),
                email: identifier.trim(),
                resetToken,
                newPassword,
            });

            setSuccess("Password reset successfully. Redirecting to login...");

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h2 style={styles.title}>Forgot Password</h2>

                {error && <p style={styles.error}>{error}</p>}
                {success && <p style={styles.success}>{success}</p>}

                {/* Step 1 Form */}
                {step === 1 && (
                    <form onSubmit={handleRequestOtp}>
                        <p style={styles.instruction}>
                            Enter your registered Username or Email address below to receive an OTP.
                        </p>
                        <input
                            type="text"
                            placeholder="Username or Email"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                            style={styles.input}
                        />
                        <button
                            type="submit"
                            disabled={loading || !identifier.trim()}
                            style={{ ...styles.btn, opacity: (loading || !identifier.trim()) ? 0.7 : 1 }}
                        >
                            {loading ? "Sending..." : "Request OTP"}
                        </button>
                    </form>
                )}

                {/* Step 2 Form */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOtp}>
                        <p style={styles.instruction}>
                            Enter the 6-digit OTP sent to your email.
                        </p>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            maxLength={6}
                            style={styles.input}
                        />
                        <button
                            type="submit"
                            disabled={loading || !otp.trim() || otp.trim().length !== 6}
                            style={{ ...styles.btn, opacity: (loading || !otp.trim() || otp.trim().length !== 6) ? 0.7 : 1 }}
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </form>
                )}

                {/* Step 3 Form */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword}>
                        <p style={styles.instruction}>
                            Create a new password. Your active sessions will be invalidated.
                        </p>
                        <div style={styles.passwordWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
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
                        <button
                            type="submit"
                            disabled={loading || !newPassword.trim() || newPassword.length < 6}
                            style={{ ...styles.btn, opacity: (loading || !newPassword.trim() || newPassword.length < 6) ? 0.7 : 1 }}
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}

                <div style={styles.footer}>
                    <p style={styles.backText}>
                        Remembered your password?{" "}
                        <Link to="/login" style={styles.link}>
                            Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f4f6f8",
    },
    formContainer: {
        width: "400px",
        padding: "32px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
    },
    title: {
        textAlign: "center",
        marginBottom: "20px",
        color: "#333",
    },
    instruction: {
        fontSize: "14px",
        color: "#666",
        marginBottom: "15px",
        textAlign: "center",
    },
    input: {
        width: "100%",
        padding: "12px",
        marginBottom: "15px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "14px",
        boxSizing: "border-box",
    },
    passwordWrapper: {
        position: "relative",
    },
    eyeBtn: {
        position: "absolute",
        right: "12px",
        top: "40%",
        transform: "translateY(-50%)",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "16px",
        color: "#444",
    },
    btn: {
        width: "100%",
        padding: "12px",
        background: "#3b82b6",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "600",
        marginTop: "10px",
    },
    link: {
        color: "#3b82b6",
        textDecoration: "none",
        fontWeight: "500",
    },
    footer: {
        marginTop: "20px",
        textAlign: "center",
    },
    backText: {
        fontSize: "14px",
        color: "#555",
    },
    error: {
        color: "#e11d48",
        textAlign: "center",
        marginBottom: "15px",
        fontSize: "14px",
    },
    success: {
        color: "#16a34a",
        textAlign: "center",
        marginBottom: "15px",
        fontSize: "14px",
    }
};

export default ForgotPassword;
