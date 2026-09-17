import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  FiGrid,
  FiTool,
  FiShoppingBag,
  FiCalendar,
  FiFileText,
  FiUsers,
  FiBell,
  FiUser,
  FiSettings,
  FiLogOut,
  FiShield,
} from 'react-icons/fi';
import { FaWrench } from 'react-icons/fa';
import { AppHeader } from '../common/AppHeader';
import { SignOutModal } from './SignOutModal';
import '../../Styles/Componentcss/Sidebar.css';

const baseMenuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
  { name: 'Equipment', path: '/equipment', icon: FiTool },
  { name: 'Shop', path: '/shop', icon: FiShoppingBag },
  { name: 'Schedule', path: '/schedule', icon: FiCalendar },
  { name: 'Maintenance', path: '/maintenance', icon: FaWrench },
  { name: 'Reports', path: '/reports', icon: FiFileText },
  { name: 'Collaboration', path: '/collaboration', icon: FiUsers },
  { name: 'Notifications', path: '/notifications', icon: FiBell },
  { name: 'Profile', path: '/profile', icon: FiUser },
];

const adminMenuItems = [
  { name: 'Admin', path: '/admin', icon: FiShield },
  { name: 'Settings', path: '/settings', icon: FiSettings },
];

const mobileMenuNames = new Set(['Dashboard', 'Equipment', 'Shop', 'Notifications', 'Profile']);

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);

  const roleDisplay = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Student';
  const isAdmin = user?.role === 'admin';
  const menuItems = isAdmin ? [...baseMenuItems, ...adminMenuItems] : baseMenuItems;
  const mobileItems = menuItems.filter((item) => mobileMenuNames.has(item.name));

  const confirmLogout = async () => {
    setIsSignOutOpen(false);
    await logout();
    navigate('/signin', { replace: true });
  };

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand-mark" aria-hidden="true">M</div>
          <div>
            <h2>Mechatronics</h2>
            <p className="sub">Lab System</p>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Primary navigation">
          <ul>
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink to={item.path} className={({ isActive }) => (isActive ? 'active' : '')}>
                  <item.icon className="icon" aria-hidden="true" />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar" aria-hidden="true">{user?.name?.charAt(0).toUpperCase() || 'U'}</div>
            <div>
              <p className="name">{user?.name || 'User'}</p>
              <p className="role">{roleDisplay}</p>
            </div>
          </div>

          <button onClick={() => setIsSignOutOpen(true)} className="logout-btn" type="button">
            <FiLogOut aria-hidden="true" />
            Sign Out
          </button>
        </div>
      </aside>

      <AppHeader onSignOut={() => setIsSignOutOpen(true)} />

      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        {mobileItems.map((item) => (
          <NavLink key={item.name} to={item.path} className={({ isActive }) => (isActive ? 'active' : '')}>
            <item.icon aria-hidden="true" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <SignOutModal
        isOpen={isSignOutOpen}
        onCancel={() => setIsSignOutOpen(false)}
        onConfirm={() => void confirmLogout()}
        userName={user?.name || 'User'}
        userRole={roleDisplay}
      />
    </>
  );
}
