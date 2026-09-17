import { Link } from 'react-router-dom';
import { FiAlertCircle, FiShoppingCart, FiPrinter } from 'react-icons/fi';
import '../../Styles/Componentcss/NotificationsPanel.css';

const notifications = [
  { text: 'Motor X maintenance overdue', time: '5m ago', live: true, icon: FiAlertCircle },
  { text: 'New shop order confirmed', time: '1h ago', live: true, icon: FiShoppingCart },
  { text: '3D Printer returned to Lab B', time: '2h ago', live: true, icon: FiPrinter },
];

export function NotificationsPanel() {
  return (
    <div className="notifications-panel">
      <div className="notifications-panel-header">
        <h3>Notifications</h3>
        <Link to="/notifications" className="view-all">View all</Link>
      </div>
      <ul>
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <li key={notification.text}>
              <div className="notif-content"><Icon className="notif-icon" /><span>{notification.text}</span></div>
              <div className="meta"><span className="time">{notification.time}</span>{notification.live && <span className="live">Live</span>}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
