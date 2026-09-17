import {  useMemo, useState, type FormEvent } from 'react';
import { Sidebar } from '../Components/Dashboardc/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { equipmentList } from '../data/equipmentData';
import {
  FiUsers, FiTool, FiShoppingBag, FiCalendar,
  FiTrendingUp, FiBell, FiAlertCircle, FiCheckCircle,
  FiPlus, FiCheck, FiX, FiSend,
} from 'react-icons/fi';
import '../Styles/Pagecss/Admin.css';

interface ProductDraft {
  name: string;
  category: string;
  price: string;
  stock: string;
}

interface BookingRequest {
  id: number;
  equipment: string;
  requester: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const initialRequests: BookingRequest[] = [
  { id: 1, equipment: 'CNC Machine', requester: 'Alice Tan', date: '2026-09-08', status: 'Pending' },
  { id: 2, equipment: 'Robotic Arm', requester: 'David Ng', date: '2026-09-09', status: 'Pending' },
  { id: 3, equipment: '3D Printer', requester: 'Eva Chen', date: '2026-09-10', status: 'Approved' },
];

const recentActivities = [
  { id: 1, action: 'New user registered', user: 'John Doe', time: '5 mins ago', type: 'user' },
  { id: 2, action: 'Equipment booking', user: 'Alice Tan', time: '1 hour ago', type: 'booking' },
  { id: 3, action: 'Maintenance request', user: 'David Ng', time: '2 hours ago', type: 'maintenance' },
  { id: 4, action: 'New product added', user: 'Admin', time: '3 hours ago', type: 'shop' },
];

export function AdminDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<BookingRequest[]>(initialRequests);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(equipmentList[0]?.id ?? '');
  const [equipmentStatus, setEquipmentStatus] = useState(equipmentList[0]?.status ?? 'available');
  const [productDraft, setProductDraft] = useState<ProductDraft>({ name: '', category: 'Microcontroller', price: '', stock: '' });
  const [announcement, setAnnouncement] = useState('');
  const [feedback, setFeedback] = useState('');

  const selectedEquipment = useMemo(
    () => equipmentList.find((item) => item.id === selectedEquipmentId),
    [selectedEquipmentId],
  );

  const pendingRequests = requests.filter((request) => request.status === 'Pending').length;

  const updateRequest = (id: number, status: 'Approved' | 'Rejected') => {
    setRequests((current) => current.map((request) => (
      request.id === id ? { ...request, status } : request
    )));
    setFeedback(`Request #${id} ${status.toLowerCase()}.`);
  };

  const handleEquipmentStatusChange = () => {
    if (!selectedEquipment) return;
    setFeedback(`${selectedEquipment.name} marked as ${equipmentStatus}. This status is local to the admin session until a shared data store is introduced.`);
  };

  const handleProductSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!productDraft.name.trim() || !productDraft.price || !productDraft.stock) return;
    setFeedback(`Product “${productDraft.name.trim()}” queued for the shop with ${productDraft.stock} units.`);
    setProductDraft({ name: '', category: 'Microcontroller', price: '', stock: '' });
  };

  const handleAnnouncement = (event: FormEvent) => {
    event.preventDefault();
    if (!announcement.trim()) return;
    setFeedback('Announcement posted to the local admin session.');
    setAnnouncement('');
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-content admin-page">
        <div className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {user?.name || 'Administrator'}</p>
          </div>
          {feedback && <div className="admin-feedback" role="status">{feedback}</div>}
        </div>

        <div className="admin-stats-grid">
          <div className="admin-stat-card"><div className="stat-icon"><FiUsers /></div><div className="stat-info"><h3>125</h3><p>Total Users</p></div></div>
          <div className="admin-stat-card"><div className="stat-icon"><FiTool /></div><div className="stat-info"><h3>{equipmentList.length}</h3><p>Equipment Items</p></div></div>
          <div className="admin-stat-card"><div className="stat-icon"><FiShoppingBag /></div><div className="stat-info"><h3>342</h3><p>Total Bookings</p></div></div>
          <div className="admin-stat-card"><div className="stat-icon"><FiAlertCircle /></div><div className="stat-info"><h3>6</h3><p>Pending Maintenance</p></div></div>
          <div className="admin-stat-card"><div className="stat-icon"><FiTrendingUp /></div><div className="stat-info"><h3>N$12,450</h3><p>Monthly Revenue</p></div></div>
          <div className="admin-stat-card"><div className="stat-icon"><FiUsers /></div><div className="stat-info"><h3>89</h3><p>Active Students</p></div></div>
        </div>

        <div className="admin-management-grid">
          <section className="admin-section admin-management-card">
            <div className="section-heading">
              <div><h2>Equipment Management</h2><p>Update equipment availability from the admin panel.</p></div>
            </div>
            <label className="admin-field-label" htmlFor="equipment-select">Equipment</label>
            <select
              id="equipment-select"
              value={selectedEquipmentId}
              onChange={(event) => {
                setSelectedEquipmentId(event.target.value);
                const next = equipmentList.find((item) => item.id === event.target.value);
                setEquipmentStatus(next?.status ?? 'available');
              }}
            >
              {equipmentList.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            <label className="admin-field-label" htmlFor="equipment-status">Status</label>
            <select id="equipment-status" value={equipmentStatus} onChange={(event) => setEquipmentStatus(event.target.value as typeof equipmentStatus)}>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
              <option value="maintenance">Maintenance</option>
            </select>
            <button className="admin-primary-btn" onClick={handleEquipmentStatusChange}><FiCheck /> Save Equipment Status</button>
          </section>

          <section className="admin-section admin-management-card">
            <div className="section-heading">
              <div><h2>Add New Product</h2><p>Create a shop item from the admin panel.</p></div>
              <FiPlus className="section-heading-icon" />
            </div>
            <form onSubmit={handleProductSubmit} className="admin-form-grid">
              <input placeholder="Product name" value={productDraft.name} onChange={(event) => setProductDraft({ ...productDraft, name: event.target.value })} required />
              <select value={productDraft.category} onChange={(event) => setProductDraft({ ...productDraft, category: event.target.value })}>
                <option>Microcontroller</option><option>Sensors</option><option>Actuators</option><option>Measurement</option><option>Electronics</option><option>Tools</option>
              </select>
              <input type="number" min="0" step="1" placeholder="Price (N$)" value={productDraft.price} onChange={(event) => setProductDraft({ ...productDraft, price: event.target.value })} required />
              <input type="number" min="0" step="1" placeholder="Stock" value={productDraft.stock} onChange={(event) => setProductDraft({ ...productDraft, stock: event.target.value })} required />
              <button type="submit" className="admin-primary-btn"><FiPlus /> Add Product</button>
            </form>
          </section>
        </div>

        <section className="admin-section requests-section">
          <div className="section-heading">
            <div><h2>Pending Booking Requests</h2><p>{pendingRequests} request{pendingRequests === 1 ? '' : 's'} awaiting admin action.</p></div>
            <span className="request-count">{pendingRequests}</span>
          </div>
          <div className="request-list">
            {requests.map((request) => (
              <div key={request.id} className="request-row">
                <div><strong>{request.equipment}</strong><span>{request.requester} • {request.date}</span></div>
                <span className={`request-status ${request.status.toLowerCase()}`}>{request.status}</span>
                {request.status === 'Pending' ? (
                  <div className="request-actions">
                    <button className="approve-btn" onClick={() => updateRequest(request.id, 'Approved')}><FiCheck /> Approve</button>
                    <button className="reject-btn" onClick={() => updateRequest(request.id, 'Rejected')}><FiX /> Reject</button>
                  </div>
                ) : <span className="request-complete">Processed</span>}
              </div>
            ))}
          </div>
        </section>

        <section className="admin-section announcement-section">
          <div className="section-heading">
            <div><h2>Post Announcement</h2><p>Share a notice with students and staff.</p></div>
            <FiBell className="section-heading-icon" />
          </div>
          <form onSubmit={handleAnnouncement} className="announcement-form">
            <textarea rows={3} placeholder="Write an announcement..." value={announcement} onChange={(event) => setAnnouncement(event.target.value)} required />
            <button type="submit" className="admin-primary-btn"><FiSend /> Publish Announcement</button>
          </form>
        </section>

        <div className="admin-sections">
          <div className="admin-section">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className={`activity-icon ${activity.type}`}>
                    {activity.type === 'user' && <FiUsers />}
                    {activity.type === 'booking' && <FiCalendar />}
                    {activity.type === 'maintenance' && <FiTool />}
                    {activity.type === 'shop' && <FiShoppingBag />}
                  </div>
                  <div className="activity-details"><p className="activity-action">{activity.action}</p><p className="activity-user">{activity.user} • {activity.time}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-section">
            <h2>System Status</h2>
            <div className="status-list">
              <div className="status-item"><FiCheckCircle className="status-good" /><span>Server Status: Operational</span></div>
              <div className="status-item"><FiCheckCircle className="status-good" /><span>Database: Connected</span></div>
              <div className="status-item"><FiAlertCircle className="status-warning" /><span>Backup: 2 days ago</span></div>
              <div className="status-item"><FiBell className="status-info" /><span>Last System Update: v2.4.0</span></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
