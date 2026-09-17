import { useEffect, useState } from "react";
import { Sidebar } from "../Components/Dashboardc/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import { FiEdit2, FiSave, FiX, FiCamera } from "react-icons/fi";
import "../Styles/Pagecss/Profile.css";

interface ProfileFormData {
  fullName: string;
  email: string;
  studentId: string;
  department: string;
  phoneNumber: string;
  role: "admin" | "staff" | "student";
  bio: string;
  avatarUrl: string;
}

const PROFILE_STORAGE_KEY = "labProfile";

export function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [formData, setFormData] = useState<ProfileFormData>(() => {
    // Keep profile edits separate from AuthContext until a real backend is introduced.
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as ProfileFormData;
      } catch {
        localStorage.removeItem(PROFILE_STORAGE_KEY);
      }
    }

    return {
      fullName: user?.name || "Admin User",
      email: user?.email || "admin@mechatronicslab.edu",
      studentId: "MCT/2024/001",
      department: "Mechatronics Engineering",
      phoneNumber: "+233 20 123 4567",
      role: user?.role || "admin",
      bio: "Lab administrator responsible for equipment management and student support.",
      avatarUrl: "",
    };
  });

  useEffect(() => {
    if (user && !localStorage.getItem(PROFILE_STORAGE_KEY)) {
      setFormData((current) => ({
        ...current,
        fullName: user.name || current.fullName,
        email: user.email || current.email,
        role: user.role || current.role,
      }));
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
    setSaveMessage("");
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview only; a backend upload can replace this later.
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((current) => ({
        ...current,
        avatarUrl: String(reader.result),
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(formData));
    setSaveMessage("Profile updated successfully.");
    setIsEditing(false);
  };

  const roleDisplay =
    formData.role === "admin"
      ? "Administrator"
      : formData.role === "staff"
        ? "Staff Member"
        : "Student";

  const initials = formData.fullName.trim().charAt(0).toUpperCase() || "A";

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-content profile-page">
        <div className="profile-header">
          <div>
            <h1>My Profile</h1>
            <p>Manage your personal information and account details.</p>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="edit-btn"
              type="button"
            >
              <FiEdit2 /> Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button
                onClick={() => setIsEditing(false)}
                className="cancel-btn"
                type="button"
              >
                <FiX /> Cancel
              </button>
              <button onClick={handleSave} className="save-btn" type="button">
                <FiSave /> Save Changes
              </button>
            </div>
          )}
        </div>

        {saveMessage && (
          <div className="profile-save-message" role="status">
            {saveMessage}
          </div>
        )}

        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar" aria-label="Profile avatar">
              {formData.avatarUrl ? (
                <img src={formData.avatarUrl} alt="Profile" />
              ) : (
                initials
              )}

              {isEditing && (
                <label
                  className="change-photo-btn"
                  title="Change profile photo"
                >
                  <FiCamera />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </label>
              )}
            </div>
            <div className="profile-role-badge">{roleDisplay}</div>
          </div>

          <div className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                {isEditing ? (
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{formData.fullName}</p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                {isEditing ? (
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{formData.email}</p>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="studentId">Student / Staff ID</label>
                {isEditing ? (
                  <input
                    id="studentId"
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{formData.studentId}</p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="department">Department</label>
                {isEditing ? (
                  <input
                    id="department"
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{formData.department}</p>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                {isEditing ? (
                  <input
                    id="phoneNumber"
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{formData.phoneNumber}</p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="role">Role</label>
                {isEditing ? (
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                    <option value="student">Student</option>
                  </select>
                ) : (
                  <p>{roleDisplay}</p>
                )}
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="bio">Bio</label>
              {isEditing ? (
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                />
              ) : (
                <p className="bio-text">{formData.bio}</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
