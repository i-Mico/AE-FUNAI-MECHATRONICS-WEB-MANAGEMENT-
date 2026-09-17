import { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FiBell, FiChevronDown, FiLogOut, FiMoon, FiSettings, FiSun, FiUser } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const pageNames: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/equipment': 'Equipment',
  '/shop': 'Shop',
  '/schedule': 'Schedule',
  '/maintenance': 'Maintenance',
  '/reports': 'Reports',
  '/collaboration': 'Collaboration',
  '/notifications': 'Notifications',
  '/profile': 'Profile',
  '/settings': 'Settings',
  '/admin': 'Admin',
};

interface AppHeaderProps {
  onSignOut: () => void;
}

export function AppHeader({ onSignOut }: AppHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => document.body.classList.contains('theme-dark'));

  const pageName = useMemo(() => pageNames[location.pathname] || 'Mechatronics Lab System', [location.pathname]);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.body.classList.toggle('theme-dark', next);

    try {
      const stored = localStorage.getItem('labSettings');
      const parsed = stored ? JSON.parse(stored) : {};
      localStorage.setItem(
        'labSettings',
        JSON.stringify({ ...parsed, appearance: { ...parsed.appearance, theme: next ? 'dark' : 'light' } }),
      );
    } catch {
      // Theme still works for the current session when settings storage is unavailable.
    }
  };

  const displayName = user?.name || 'Guest';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <header className="app-header">
      <div className="app-header-title">
        <div className="app-header-brand">Mechatronics Lab System</div>
        <span className="app-header-separator">|</span>
        <h1>{pageName}</h1>
      </div>

      <div className="app-header-actions">
        <button type="button" className="icon-button" onClick={toggleTheme} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
          {isDark ? <FiSun /> : <FiMoon />}
        </button>
        <NavLink to="/notifications" className="icon-button notification-button" aria-label="Notifications">
          <FiBell />
          <span className="notification-dot" />
        </NavLink>

        <div className="profile-menu-wrap">
          <button
            type="button"
            className="profile-menu-trigger"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <span className="profile-avatar">{initials}</span>
            <span className="profile-menu-name">{displayName}</span>
            <FiChevronDown className={menuOpen ? 'rotate-180' : ''} />
          </button>

          {menuOpen && (
            <div className="profile-menu" role="menu">
              <NavLink to="/profile" role="menuitem"><FiUser /> Profile</NavLink>
              {user?.role === 'admin' && <NavLink to="/settings" role="menuitem"><FiSettings /> Settings</NavLink>}
              <button type="button" onClick={onSignOut} role="menuitem"><FiLogOut /> Sign Out</button>
              <button type="button" className="profile-menu-close" onClick={() => { setMenuOpen(false); navigate(location.pathname); }} aria-label="Close profile menu" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
