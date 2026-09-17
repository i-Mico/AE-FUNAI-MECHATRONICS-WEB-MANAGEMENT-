import { useEffect, useState } from "react";
import { Sidebar } from "../Components/Dashboardc/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import {
  FiSave,
  FiBell,
  FiMoon,
  FiGlobe,
  FiShield,
  FiUser,
  FiHome,
} from "react-icons/fi";
import "../Styles/Pagecss/Settings.css";

type SettingsTab =
  | "profile"
  | "notifications"
  | "lab"
  | "appearance"
  | "security"
  | "system";

const SETTINGS_STORAGE_KEY = "labSettings";

interface LabSettings {
  profile: {
    fullName: string;
    email: string;
    department: string;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    bookingReminders: boolean;
    maintenanceAlerts: boolean;
    systemUpdates: boolean;
  };
  appearance: {
    theme: "light" | "dark";
    compactMode: boolean;
  };
  lab: {
    labName: string;
    openingTime: string;
    closingTime: string;
    maxBookingDuration: number;
    bookingLeadTime: number;
  };
}

const defaultSettings = (user?: {
  name: string;
  email: string;
}): LabSettings => ({
  profile: {
    fullName: user?.name || "Admin User",
    email: user?.email || "admin@mechatronicslab.edu",
    department: "Mechatronics Engineering",
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    bookingReminders: true,
    maintenanceAlerts: true,
    systemUpdates: false,
  },
  appearance: {
    theme: "light",
    compactMode: false,
  },
  lab: {
    labName: "Mechatronics Engineering Lab",
    openingTime: "08:00",
    closingTime: "18:00",
    maxBookingDuration: 4,
    bookingLeadTime: 2,
  },
});

function loadSettings(user?: { name: string; email: string }): LabSettings {
  const defaults = defaultSettings(user);
  const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (!stored) return defaults;

  try {
    const parsed = JSON.parse(stored) as Partial<LabSettings>;
    return {
      profile: { ...defaults.profile, ...parsed.profile },
      notifications: { ...defaults.notifications, ...parsed.notifications },
      appearance: { ...defaults.appearance, ...parsed.appearance },
      lab: { ...defaults.lab, ...parsed.lab },
    };
  } catch {
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
    return defaults;
  }
}

export function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [settings, setSettings] = useState<LabSettings>(() =>
    loadSettings(user || undefined),
  );
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    if (!localStorage.getItem(SETTINGS_STORAGE_KEY) && user) {
      setSettings(loadSettings(user));
    }
  }, [user]);

  const updateSettings = <K extends keyof LabSettings>(
    section: K,
    value: LabSettings[K],
  ) => {
    setSettings((current) => ({ ...current, [section]: value }));
    setSaveMessage("");
  };

  const saveSettings = () => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    setSaveMessage("Settings saved successfully.");
  };

  const toggleNotification = (key: keyof LabSettings["notifications"]) => {
    updateSettings("notifications", {
      ...settings.notifications,
      [key]: !settings.notifications[key],
    });
  };

  const toggleAppearance = (key: "compactMode") => {
    updateSettings("appearance", {
      ...settings.appearance,
      [key]: !settings.appearance[key],
    });
  };

  const syncGlobalAppearance = (nextAppearance: LabSettings["appearance"]) => {
    // Settings are applied to <body> so the preference survives navigation and
    // affects the sidebar plus every authenticated page, not just this screen.
    document.body.classList.toggle(
      "theme-dark",
      nextAppearance.theme === "dark",
    );
    document.body.classList.toggle("compact-mode", nextAppearance.compactMode);
  };

  useEffect(() => {
    syncGlobalAppearance(settings.appearance);

    // Appearance is a global preference, so persist just this section as soon
    // as it changes instead of waiting for the full Settings form to be saved.
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      const parsed = stored ? (JSON.parse(stored) as Partial<LabSettings>) : {};
      localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify({
          ...defaultSettings(user || undefined),
          ...parsed,
          appearance: settings.appearance,
        }),
      );
    } catch {
      // The active UI state still works even if localStorage is unavailable.
    }
  }, [settings.appearance, user]);

  const toggleTheme = () => {
    const nextAppearance = {
      ...settings.appearance,
      theme: settings.appearance.theme === "light" ? "dark" : "light",
    } as LabSettings["appearance"];
    updateSettings("appearance", nextAppearance);
  };

  return (
    <div className="page-layout settings-page">
      <Sidebar />
      <main className="page-content">
        <div className="settings-header">
          <h1>Settings</h1>
          <p>Manage your preferences and system configuration</p>
        </div>

        {saveMessage && (
          <div className="settings-save-message" role="status">
            {saveMessage}
          </div>
        )}

        <div className="settings-container">
          <div
            className="settings-sidebar"
            role="tablist"
            aria-label="Settings sections"
          >
            <button
              className={activeTab === "profile" ? "active" : ""}
              onClick={() => setActiveTab("profile")}
              role="tab"
            >
              <FiUser /> Profile
            </button>
            <button
              className={activeTab === "notifications" ? "active" : ""}
              onClick={() => setActiveTab("notifications")}
              role="tab"
            >
              <FiBell /> Notifications
            </button>
            <button
              className={activeTab === "lab" ? "active" : ""}
              onClick={() => setActiveTab("lab")}
              role="tab"
            >
              <FiHome /> Lab Configuration
            </button>
            <button
              className={activeTab === "appearance" ? "active" : ""}
              onClick={() => setActiveTab("appearance")}
              role="tab"
            >
              <FiMoon /> Appearance
            </button>
            <button
              className={activeTab === "security" ? "active" : ""}
              onClick={() => setActiveTab("security")}
              role="tab"
            >
              <FiShield /> Security
            </button>
            <button
              className={activeTab === "system" ? "active" : ""}
              onClick={() => setActiveTab("system")}
              role="tab"
            >
              <FiGlobe /> System
            </button>
          </div>

          <div className="settings-content">
            {activeTab === "profile" && (
              <div className="settings-panel">
                <h2>Profile Settings</h2>
                <p className="section-desc">
                  Update the profile details used throughout the interface.
                </p>
                <div className="settings-form">
                  <div className="form-group">
                    <label htmlFor="settings-fullName">Full Name</label>
                    <input
                      id="settings-fullName"
                      type="text"
                      value={settings.profile.fullName}
                      onChange={(e) =>
                        updateSettings("profile", {
                          ...settings.profile,
                          fullName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="settings-email">Email Address</label>
                    <input
                      id="settings-email"
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) =>
                        updateSettings("profile", {
                          ...settings.profile,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="settings-department">Department</label>
                    <input
                      id="settings-department"
                      type="text"
                      value={settings.profile.department}
                      onChange={(e) =>
                        updateSettings("profile", {
                          ...settings.profile,
                          department: e.target.value,
                        })
                      }
                    />
                  </div>
                  <button onClick={saveSettings} className="save-settings-btn">
                    <FiSave /> Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="settings-panel">
                <h2>Notification Preferences</h2>
                <p className="section-desc">
                  Choose how the lab system should notify you.
                </p>
                <div className="toggle-list">
                  {(
                    [
                      [
                        "emailNotifications",
                        "Email Notifications",
                        "Receive notifications via email",
                        FiBell,
                      ],
                      [
                        "pushNotifications",
                        "Push Notifications",
                        "Receive real-time push notifications",
                        FiBell,
                      ],
                      [
                        "bookingReminders",
                        "Booking Reminders",
                        "Get reminders for upcoming bookings",
                        FiBell,
                      ],
                      [
                        "maintenanceAlerts",
                        "Maintenance Alerts",
                        "Get notified about equipment maintenance",
                        FiBell,
                      ],
                      [
                        "systemUpdates",
                        "System Updates",
                        "Receive system update announcements",
                        FiBell,
                      ],
                    ] as const
                  ).map(([key, title, description, Icon]) => (
                    <div className="toggle-item" key={key}>
                      <div className="toggle-info">
                        <Icon />
                        <div>
                          <strong>{title}</strong>
                          <p>{description}</p>
                        </div>
                      </div>
                      <button
                        aria-label={`${title}: ${settings.notifications[key] ? "on" : "off"}`}
                        className={`toggle-switch ${settings.notifications[key] ? "active" : ""}`}
                        onClick={() => toggleNotification(key)}
                      >
                        <span className="toggle-slider" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "lab" && (
              <div className="settings-panel">
                <h2>Lab Configuration</h2>
                <p className="section-desc">
                  Configure the booking rules shown in the reference workflow.
                </p>
                <div className="settings-form lab-config-form">
                  <div className="form-group">
                    <label htmlFor="labName">Lab Name</label>
                    <input
                      id="labName"
                      value={settings.lab.labName}
                      onChange={(e) =>
                        updateSettings("lab", {
                          ...settings.lab,
                          labName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="openingTime">Opening Time</label>
                      <input
                        id="openingTime"
                        type="time"
                        value={settings.lab.openingTime}
                        onChange={(e) =>
                          updateSettings("lab", {
                            ...settings.lab,
                            openingTime: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="closingTime">Closing Time</label>
                      <input
                        id="closingTime"
                        type="time"
                        value={settings.lab.closingTime}
                        onChange={(e) =>
                          updateSettings("lab", {
                            ...settings.lab,
                            closingTime: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="maxBookingDuration">
                        Max Booking Duration (hrs)
                      </label>
                      <input
                        id="maxBookingDuration"
                        type="number"
                        min="1"
                        max="12"
                        value={settings.lab.maxBookingDuration}
                        onChange={(e) =>
                          updateSettings("lab", {
                            ...settings.lab,
                            maxBookingDuration: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="bookingLeadTime">
                        Booking Lead Time (hrs)
                      </label>
                      <input
                        id="bookingLeadTime"
                        type="number"
                        min="0"
                        max="72"
                        value={settings.lab.bookingLeadTime}
                        onChange={(e) =>
                          updateSettings("lab", {
                            ...settings.lab,
                            bookingLeadTime: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                  <button onClick={saveSettings} className="save-settings-btn">
                    <FiSave /> Save Lab Configuration
                  </button>
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="settings-panel">
                <h2>Appearance</h2>
                <p className="section-desc">
                  Customize the density and theme of the settings interface.
                </p>
                <div className="toggle-list">
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <FiMoon />
                      <div>
                        <strong>Dark Mode</strong>
                        <p>Switch between light and dark theme</p>
                      </div>
                    </div>
                    <button
                      aria-label={`Dark mode: ${settings.appearance.theme === "dark" ? "on" : "off"}`}
                      className={`toggle-switch ${settings.appearance.theme === "dark" ? "active" : ""}`}
                      onClick={toggleTheme}
                    >
                      <span className="toggle-slider" />
                    </button>
                  </div>
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <FiGlobe />
                      <div>
                        <strong>Compact Mode</strong>
                        <p>Reduce spacing for more content density</p>
                      </div>
                    </div>
                    <button
                      aria-label={`Compact mode: ${settings.appearance.compactMode ? "on" : "off"}`}
                      className={`toggle-switch ${settings.appearance.compactMode ? "active" : ""}`}
                      onClick={() => toggleAppearance("compactMode")}
                    >
                      <span className="toggle-slider" />
                    </button>
                  </div>
                </div>
                <button onClick={saveSettings} className="save-settings-btn">
                  <FiSave /> Save Appearance
                </button>
              </div>
            )}

            {activeTab === "security" && (
              <div className="settings-panel">
                <h2>Security</h2>
                <p className="section-desc">Manage your account security.</p>
                <div className="security-form">
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                      id="currentPassword"
                      type="password"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <button
                    className="save-settings-btn"
                    type="button"
                    onClick={() =>
                      setSaveMessage(
                        "Password change is ready for backend integration.",
                      )
                    }
                  >
                    <FiShield /> Update Password
                  </button>
                </div>
              </div>
            )}

            {activeTab === "system" && (
              <div className="settings-panel">
                <h2>System Configuration</h2>
                <p className="section-desc">
                  Administrative system information and maintenance actions.
                </p>
                <div className="system-settings">
                  <div className="info-box">
                    <strong>System Version:</strong> v2.4.0
                  </div>
                  <div className="info-box">
                    <strong>Last Backup:</strong> 2 days ago
                  </div>
                  <div className="info-box">
                    <strong>Maintenance Mode:</strong> Off
                  </div>
                  <button
                    className="danger-btn"
                    type="button"
                    onClick={() =>
                      setSaveMessage(
                        "System log export is ready for backend integration.",
                      )
                    }
                  >
                    Export System Logs
                  </button>
                  <button
                    className="danger-btn danger"
                    type="button"
                    onClick={() =>
                      setSaveMessage(
                        "Cache clear is ready for backend integration.",
                      )
                    }
                  >
                    Clear System Cache
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
