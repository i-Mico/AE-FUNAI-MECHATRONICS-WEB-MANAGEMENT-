import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import "../Styles/Pagecss/ForgotPassword.css";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setSubmitting(true);

    try {
      const result = await api.forgotPassword({ email });

      setMessage(
        result.message ||
          "If an account with that email exists, a password reset link has been sent."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to process your password reset request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <h1>Forgot Password?</h1>
          <p>
            Enter the email address associated with your account and we'll send
            you a password reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="reset-email">Email</label>
            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
                setMessage("");
              }}
              placeholder="Enter your email address"
              required
              disabled={submitting}
            />
          </div>

          {message && <p className="success">{message}</p>}
          {error && <p className="error">{error}</p>}

          <button
            type="submit"
            className="forgot-password-btn"
            disabled={submitting}
          >
            {submitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="forgot-password-links">
          <Link to="/signin">Back to Sign In</Link>
          <span>•</span>
          <Link to="/signup">Create Account</Link>
        </div>
      </div>
    </div>
  );
}