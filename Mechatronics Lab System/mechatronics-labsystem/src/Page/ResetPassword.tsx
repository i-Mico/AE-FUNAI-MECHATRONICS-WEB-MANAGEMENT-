import { useMemo, useState, type FormEvent } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { api } from "../api/client";
import "../Styles/Pagecss/ResetPassword.css";

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const passwordRequirements = useMemo(
    () => ({
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
    }),
    [password]
  );

  const passwordIsValid = Object.values(passwordRequirements).every(Boolean);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!token) {
      setError(
        "This password reset link is invalid or incomplete. Please request a new reset link."
      );
      return;
    }

    if (!passwordIsValid) {
      const missingRequirements: string[] = [];

      if (!passwordRequirements.minLength) {
        missingRequirements.push("at least 8 characters");
      }

      if (!passwordRequirements.uppercase) {
        missingRequirements.push("one uppercase letter");
      }

      if (!passwordRequirements.lowercase) {
        missingRequirements.push("one lowercase letter");
      }

      if (!passwordRequirements.number) {
        missingRequirements.push("one number");
      }

      setError(
        `Your password is missing ${missingRequirements.join(", ")}.`
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const result = await api.resetPassword({
        token,
        password,
      });

      setMessage(
        result.message ||
          "Password reset successfully. You can now sign in with your new password."
      );

      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/signin");
      }, 1800);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to reset your password. Please request a new reset link."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="reset-password-header">
          <h1>Reset Password</h1>
          <p>Create a new password for your Mechatronics Lab System account.</p>
        </div>

        {!token ? (
          <div className="reset-password-invalid">
            <p>
              This reset link is missing its security token. Please request a
              new password reset link.
            </p>

            <Link to="/forgot-password" className="reset-password-btn">
              Request New Reset Link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="reset-password">New Password</label>

              <div className="password-field">
                <input
                  id="reset-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                    setMessage("");
                  }}
                  placeholder="Enter your new password"
                  required
                  disabled={submitting}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="password-requirements">
              <p className="password-requirements-title">
                Password requirements
              </p>

              <div
                className={`password-requirement ${
                  passwordRequirements.minLength ? "met" : "unmet"
                }`}
              >
                <span className="password-requirement-icon">
                  {passwordRequirements.minLength ? "✓" : "○"}
                </span>
                <span>At least 8 characters</span>
              </div>

              <div
                className={`password-requirement ${
                  passwordRequirements.uppercase ? "met" : "unmet"
                }`}
              >
                <span className="password-requirement-icon">
                  {passwordRequirements.uppercase ? "✓" : "○"}
                </span>
                <span>One uppercase letter</span>
              </div>

              <div
                className={`password-requirement ${
                  passwordRequirements.lowercase ? "met" : "unmet"
                }`}
              >
                <span className="password-requirement-icon">
                  {passwordRequirements.lowercase ? "✓" : "○"}
                </span>
                <span>One lowercase letter</span>
              </div>

              <div
                className={`password-requirement ${
                  passwordRequirements.number ? "met" : "unmet"
                }`}
              >
                <span className="password-requirement-icon">
                  {passwordRequirements.number ? "✓" : "○"}
                </span>
                <span>One number</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirm-reset-password">
                Confirm New Password
              </label>

              <div className="password-field">
                <input
                  id="confirm-reset-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    setError("");
                    setMessage("");
                  }}
                  placeholder="Re-enter your new password"
                  required
                  disabled={submitting}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword((visible) => !visible)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirmation password"
                      : "Show confirmation password"
                  }
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}

            <button
              type="submit"
              className="reset-password-btn"
              disabled={submitting}
            >
              {submitting ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="reset-password-links">
          <Link to="/signin">Back to Sign In</Link>
          <span>•</span>
          <Link to="/forgot-password">Forgot Password</Link>
        </div>
      </div>
    </div>
  );
}