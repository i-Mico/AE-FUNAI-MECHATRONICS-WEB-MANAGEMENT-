import { Sidebar } from '../Components/Dashboardc/Sidebar';
import { WeeklyChart } from '../Components/Dashboardc/WeeklyChart';
import { RecentActivity } from '../Components/Dashboardc/RecentActivity';
import { AIInsights } from '../Components/Dashboardc/AIInsights';
import { NotificationsPanel } from '../Components/Dashboardc/NotificationsPanel';
import { useAuth } from '../contexts/AuthContext';
import { products } from '../data/productData';
import { equipmentList } from '../data/equipmentData';
import { FiAlertCircle, FiCalendar, FiCheckCircle, FiPackage, FiShoppingBag, FiTool, FiTrendingUp, FiUsers } from 'react-icons/fi';
import '../Styles/Pagecss/Dashboard.css';

const activeStudentCount = 89;

export function Dashboard() {
  const { user } = useAuth();
  const role = user?.role ?? 'student';

  const adminMetrics = [
    { label: 'Shop Products', value: products.length, icon: FiShoppingBag, tone: 'green' },
    { label: 'In-stock Items', value: products.reduce((sum, product) => sum + product.stock, 0), icon: FiPackage, tone: 'green' },
    { label: 'Lab Equipment', value: equipmentList.length, icon: FiTool, tone: 'blue' },
    { label: 'Active Students', value: activeStudentCount, icon: FiUsers, tone: 'purple' },
  ];

  return (
    <div className="dashboard-page">
      <Sidebar />
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">{role === 'admin' ? 'Admin Overview' : role === 'staff' ? 'Staff Workspace' : 'Student Workspace'}</p>
            <h1>Dashboard</h1>
            <p className="dashboard-welcome">Welcome back, {user?.name || 'Guest'}</p>
          </div>
          <div className={`dashboard-role-badge role-${role}`}>{role.charAt(0).toUpperCase() + role.slice(1)}</div>
        </header>

        {role === 'admin' && (
          <>
            <section className="admin-metrics-grid" aria-label="Admin lab summary">
              {adminMetrics.map(({ label, value, icon: Icon, tone }) => (
                <div key={label} className={`admin-metric-card ${tone}`}>
                  <div className="metric-icon"><Icon /></div>
                  <div><strong>{value.toLocaleString()}</strong><span>{label}</span></div>
                </div>
              ))}
            </section>
            <section className="dashboard-two-columns">
              <div className="left-col">
                <RecentActivity />
              </div>
              <div className="right-col">
                <NotificationsPanel />
                <AIInsights />
              </div>
            </section>
          </>
        )}

        {role === 'staff' && (
          <>
            <section className="staff-summary-grid">
              <div className="staff-summary-card"><FiCalendar /><strong>3</strong><span>My Shifts This Week</span></div>
              <div className="staff-summary-card warning"><FiAlertCircle /><strong>3</strong><span>Pending Approvals</span></div>
              <div className="staff-summary-card danger"><FiTool /><strong>1</strong><span>Flagged Equipment</span></div>
              <div className="staff-summary-card"><FiPackage /><strong>7</strong><span>Low-stock Materials</span></div>
            </section>
            <section className="staff-dashboard-grid">
              <div className="staff-duty-card">
                <div className="section-title-row"><h2>My Duty Shifts This Week</h2><span>3 shifts</span></div>
                <div className="shift-list"><div>Lab B <span>Monday · Morning</span></div><div>Lab B <span>Tuesday · Afternoon</span></div><div>Lab A <span>Friday · Morning</span></div></div>
              </div>
              <div className="staff-availability-card">
                <div className="section-title-row"><h2>My Availability</h2><button type="button">Manage</button></div>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => <div key={day} className="availability-row"><span>{day}</span><strong className={day === 'Wednesday' ? 'unavailable' : ''}>{day === 'Wednesday' ? 'Unavailable' : 'Available'}</strong></div>)}
              </div>
            </section>
            <section className="dashboard-two-columns">
              <div className="left-col"><WeeklyChart /><RecentActivity /></div>
              <div className="right-col"><NotificationsPanel /><AIInsights /></div>
            </section>
          </>
        )}

        {role === 'student' && (
          <>
            <section className="student-summary-grid">
              <div className="student-summary-card"><FiCalendar /><strong>2</strong><span>Upcoming Bookings</span></div>
              <div className="student-summary-card"><FiCheckCircle /><strong>{equipmentList.filter((item) => item.status === 'available').length}</strong><span>Available Equipment</span></div>
              <div className="student-summary-card"><FiTrendingUp /><strong>4</strong><span>Active Projects</span></div>
            </section>
            <section className="dashboard-two-columns">
              <div className="left-col"><WeeklyChart /><RecentActivity /></div>
              <div className="right-col"><NotificationsPanel /><AIInsights /></div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
