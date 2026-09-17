import { useState } from "react";
import { Sidebar } from "../Components/Dashboardc/Sidebar";
import {
  FiBell,
  FiCheck,
  FiShoppingBag,
  FiMessageSquare,
  FiBookOpen,
  FiTool,
  FiRefreshCw,
} from "react-icons/fi";
import "../Styles/Pagecss/Notifications.css";

interface Notification {
  id: number;
  type: "maintenance" | "shop" | "announcement" | "booking" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const notificationsData: Notification[] = [
  {
    id: 1,
    type: "maintenance",
    title: "Maintenance Overdue",
    message:
      "Motor Driver X is overdue for scheduled maintenance. Please report to Lab B.",
    time: "5 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "shop",
    title: "Order Confirmed",
    message:
      "Your order for Arduino Mega 2560 (x2) has been confirmed. Ready for pickup at Lab A.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "announcement",
    title: "Lab Announcement",
    message:
      "Lab A will be closed on Friday 3rd May for deep cleaning. All sessions rescheduled.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 4,
    type: "booking",
    title: "Equipment Available",
    message:
      "Robotic Arm (Unit 3) is now available after maintenance. You can book it from the equipment page.",
    time: "3 hours ago",
    read: true,
  },
  {
    id: 5,
    type: "maintenance",
    title: "Service Due Soon",
    message:
      "3D Printer in Lab C is due for service in 3 days. Schedule maintenance to avoid disruption.",
    time: "5 hours ago",
    read: true,
  },
  {
    id: 6,
    type: "shop",
    title: "New Product Added",
    message:
      "ESP32 Development Board (10-pack) is now available in the shop at a discounted rate.",
    time: "Yesterday",
    read: true,
  },
  {
    id: 7,
    type: "announcement",
    title: "Workshop Announcement",
    message:
      "Robotics Workshop on Saturday 10th May, 10AM–2PM. Register via the Collaboration board.",
    time: "Yesterday",
    read: true,
  },
  {
    id: 8,
    type: "system",
    title: "System Update",
    message:
      "The lab management system has been updated to v2.4. New features: Admin Dashboard, Notifications page.",
    time: "2 days ago",
    read: true,
  },
  {
    id: 9,
    type: "booking",
    title: "Booking Reminder",
    message:
      "Your equipment session for Oscilloscope (Lab A) starts in 30 minutes.",
    time: "2 days ago",
    read: true,
  },
  {
    id: 10,
    type: "maintenance",
    title: "Maintenance Complete",
    message:
      "CNC Machine in Lab B has completed maintenance and is now fully operational.",
    time: "3 days ago",
    read: true,
  },
  {
    id: 11,
    type: "shop",
    title: "Low Stock Alert",
    message:
      "Breadboard + Jumper Wire Set is running low (5 units left). Restock expected next week.",
    time: "3 days ago",
    read: true,
  },
  {
    id: 12,
    type: "announcement",
    title: "New Discussion Post",
    message:
      'Dr. Owusu posted a new discussion: "Best practices for PLC programming in industrial settings".',
    time: "4 days ago",
    read: true,
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "maintenance":
      return <FiTool className="type-icon maintenance" />;
    case "shop":
      return <FiShoppingBag className="type-icon shop" />;
    case "announcement":
      return <FiMessageSquare className="type-icon announcement" />;
    case "booking":
      return <FiBookOpen className="type-icon booking" />;
    case "system":
      return <FiRefreshCw className="type-icon system" />;
    default:
      return <FiBell className="type-icon" />;
  }
};

export function NotificationsPage() {
  type NotificationFilter = "all" | Notification["type"];

  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [notifications, setNotifications] =
    useState<Notification[]>(notificationsData);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // The reference flow groups notifications by their system source. Keeping this
  // filter local makes the page immediately testable without needing a backend.
  const filteredNotifications = notifications.filter(
    (notification) => filter === "all" || notification.type === filter,
  );

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-content">
        <div className="notifications-header">
          <div className="header-left">
            <h1>Notifications</h1>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount} unread</span>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="mark-all-btn">
              <FiCheck /> Mark all as read
            </button>
          )}
        </div>

        <div
          className="notifications-filters"
          role="tablist"
          aria-label="Notification categories"
        >
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
            role="tab"
            aria-selected={filter === "all"}
          >
            All
          </button>
          <button
            className={filter === "maintenance" ? "active" : ""}
            onClick={() => setFilter("maintenance")}
            role="tab"
            aria-selected={filter === "maintenance"}
          >
            Maintenance
          </button>
          <button
            className={filter === "booking" ? "active" : ""}
            onClick={() => setFilter("booking")}
            role="tab"
            aria-selected={filter === "booking"}
          >
            Booking
          </button>
          <button
            className={filter === "shop" ? "active" : ""}
            onClick={() => setFilter("shop")}
            role="tab"
            aria-selected={filter === "shop"}
          >
            Shop
          </button>
          <button
            className={filter === "announcement" ? "active" : ""}
            onClick={() => setFilter("announcement")}
            role="tab"
            aria-selected={filter === "announcement"}
          >
            Announcements
          </button>
          <button
            className={filter === "system" ? "active" : ""}
            onClick={() => setFilter("system")}
            role="tab"
            aria-selected={filter === "system"}
          >
            System
          </button>
        </div>

        <div className="notifications-list">
          {filteredNotifications.length === 0 && (
            <div className="notifications-empty">
              No notifications in this category.
            </div>
          )}

          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${!notification.read ? "unread" : ""}`}
              onClick={() => markAsRead(notification.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  markAsRead(notification.id);
                }
              }}
            >
              <div className="notification-icon">
                {getTypeIcon(notification.type)}
              </div>
              <div className="notification-content">
                <div className="notification-title">
                  {notification.title}
                  {!notification.read && <span className="new-dot">New</span>}
                </div>
                <div className="notification-message">
                  {notification.message}
                </div>
                <div className="notification-time">{notification.time}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
