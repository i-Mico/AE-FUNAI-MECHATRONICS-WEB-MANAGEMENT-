import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import type { UserRole } from "../contexts/AuthContext";
import images from "../assets/images/Teo.png";
import "../Styles/Pagecss/Signin.css";

export function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>("student");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const success = await login(email, password, role);
    if (success) navigate("/dashboard");
    else setError("Unable to sign in. Check your credentials and try again.");
  };

  return (
    <div className="signin-container">
      <div className="signin-left">
        <div className="signin-form-wrapper">
          <h1>Welcome back</h1>
          <p className="subtitle">Sign in to access the lab system</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
              >
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                <option value="student">Student</option>
              </select>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <div className="form-links">
              <a href="#">Forgot Password?</a>
              <Link to="/signup">Create Account</Link>
            </div>
            <button type="submit" className="signin-btn">
              Sign In
            </button>
            {error && <p className="error">{error}</p>}
          </form>
        </div>
      </div>
      <div
        className="signin-right"
        style={{ backgroundImage: `url(${images})` }}
      >
        <div className="brand">
          <h2>Mechatronics</h2>
          <h3>Lab Management System</h3>
          <p>
            Manage your lab smarter, not harder. Book equipment, track
            maintenance, and collaborate with your team — all in one place.
          </p>
          <div className="stats">
            <div>
              <span>120+</span> Equipment
            </div>
            <div>
              <span>3</span> Labs
            </div>
            <div>
              <span>500+</span> Students
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
