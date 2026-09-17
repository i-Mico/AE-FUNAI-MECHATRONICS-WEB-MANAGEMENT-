import { useMemo, useState } from 'react';
import { Sidebar } from '../Components/Dashboardc/Sidebar';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiSearch,
  FiFilter,
  FiX,
  FiCalendar,
} from 'react-icons/fi';
import '../Styles/Pagecss/Maintenance.css';

interface Equipment {
  id: number;
  name: string;
  lab: string;
  status: 'Faulty' | 'Service Due' | 'Good';
  lastService: string;
  nextService: string;
  technician: string;
  priority: 'High' | 'Medium' | 'Low';
}

const equipmentList: Equipment[] = [
  { id: 1, name: 'Motor X', lab: 'Lab A', status: 'Faulty', lastService: '2026-01-10', nextService: 'Overdue', technician: 'James Tan', priority: 'High' },
  { id: 2, name: '3D Printer', lab: 'Lab B', status: 'Service Due', lastService: '2026-02-15', nextService: '2026-04-15', technician: 'Sarah Lim', priority: 'Medium' },
  { id: 3, name: 'Arduino Kit', lab: 'Lab C', status: 'Good', lastService: '2026-03-01', nextService: '2026-06-01', technician: 'David Ng', priority: 'Low' },
  { id: 4, name: 'CNC Machine', lab: 'Lab A', status: 'Faulty', lastService: '2026-01-05', nextService: 'Overdue', technician: 'James Tan', priority: 'High' },
  { id: 5, name: 'Laser Cutter', lab: 'Lab C', status: 'Good', lastService: '2026-02-20', nextService: '2026-05-20', technician: 'Sarah Lim', priority: 'Low' },
  { id: 6, name: 'Robotic Arm', lab: 'Lab B', status: 'Service Due', lastService: '2026-02-01', nextService: 'Overdue', technician: 'David Ng', priority: 'Medium' },
  { id: 7, name: 'Oscilloscope', lab: 'Lab A', status: 'Good', lastService: '2026-03-10', nextService: '2026-06-10', technician: 'James Tan', priority: 'Low' },
  { id: 8, name: 'Soldering Station', lab: 'Lab B', status: 'Good', lastService: '2026-03-05', nextService: '2026-06-05', technician: 'Sarah Lim', priority: 'Low' },
  { id: 9, name: 'Raspberry Pi Kit', lab: 'Lab C', status: 'Service Due', lastService: '2026-01-28', nextService: '2026-04-07', technician: 'David Ng', priority: 'Medium' },
];

export function Maintenance() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | Equipment['status']>('All');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [scheduledDates, setScheduledDates] = useState<Record<number, string>>({});
  const [scheduleDate, setScheduleDate] = useState('');

  // The existing page remains the source of truth for maintenance-specific
  // fields. We only add local UI state for scheduling until the backend/shared
  // equipment state is introduced in a later badge.
  const filteredEquipment = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return equipmentList.filter((equipment) => {
      const matchesSearch =
        equipment.name.toLowerCase().includes(query) ||
        equipment.technician.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'All' || equipment.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const stats = useMemo(() => ({
    faulty: equipmentList.filter((equipment) => equipment.status === 'Faulty').length,
    serviceDue: equipmentList.filter((equipment) => equipment.status === 'Service Due').length,
    good: equipmentList.filter((equipment) => equipment.status === 'Good').length,
    total: equipmentList.length,
  }), []);

  const getStatusIcon = (status: Equipment['status']) => {
    switch (status) {
      case 'Faulty':
        return <FiAlertCircle className="status-icon faulty" aria-hidden="true" />;
      case 'Service Due':
        return <FiClock className="status-icon service-due" aria-hidden="true" />;
      default:
        return <FiCheckCircle className="status-icon good" aria-hidden="true" />;
    }
  };

  const getPriorityClass = (priority: Equipment['priority']) => {
    switch (priority) {
      case 'High':
        return 'priority-high';
      case 'Medium':
        return 'priority-medium';
      default:
        return 'priority-low';
    }
  };

  const openSchedule = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setScheduleDate(scheduledDates[equipment.id] ?? '');
  };

  const closeSchedule = () => {
    setSelectedEquipment(null);
    setScheduleDate('');
  };

  const confirmSchedule = () => {
    if (!selectedEquipment || !scheduleDate) return;

    // This is deliberately local for Badge 5. A later shared-state badge can
    // persist the appointment and make Equipment/Notifications react to it.
    setScheduledDates((current) => ({
      ...current,
      [selectedEquipment.id]: scheduleDate,
    }));
    closeSchedule();
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-content">
        <div className="maintenance-header">
          <h1>Maintenance Tracking</h1>
          <p>Track equipment status and service schedules</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card faulty">
            <div className="stat-value">{stats.faulty}</div>
            <div className="stat-label">Faulty Equipment</div>
            <div className="stat-desc">Require immediate attention</div>
          </div>
          <div className="stat-card service-due">
            <div className="stat-value">{stats.serviceDue}</div>
            <div className="stat-label">Service Due</div>
            <div className="stat-desc">Scheduled maintenance</div>
          </div>
          <div className="stat-card good">
            <div className="stat-value">{stats.good}</div>
            <div className="stat-label">Good Condition</div>
            <div className="stat-desc">Operating normally</div>
          </div>
          <div className="stat-card total">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Tracked</div>
            <div className="stat-desc">Equipment in system</div>
          </div>
        </div>

        <div className="maintenance-filters">
          <div className="search-bar">
            <FiSearch aria-hidden="true" />
            <input
              type="text"
              placeholder="Search by equipment or technician..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              aria-label="Search maintenance records"
            />
          </div>
          <div className="status-filters" aria-label="Maintenance status filters">
            <FiFilter aria-hidden="true" />
            {(['All', 'Faulty', 'Service Due', 'Good'] as const).map((status) => (
              <button
                key={status}
                type="button"
                className={statusFilter === status ? 'active' : ''}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="equipment-table-container">
          <table className="equipment-table">
            <thead>
              <tr>
                <th>Equipment</th>
                <th>Lab</th>
                <th>Status</th>
                <th>Last Service</th>
                <th>Next Service</th>
                <th>Technician</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.map((equipment) => {
                const scheduledDate = scheduledDates[equipment.id];

                return (
                  <tr key={equipment.id}>
                    <td className="equipment-name">{equipment.name}</td>
                    <td>{equipment.lab}</td>
                    <td>
                      <span className={`status-badge ${equipment.status.toLowerCase().replace(' ', '-')}`}>
                        {getStatusIcon(equipment.status)}
                        {equipment.status}
                      </span>
                    </td>
                    <td>{equipment.lastService}</td>
                    <td className={equipment.nextService === 'Overdue' ? 'overdue' : ''}>
                      {scheduledDate ? (
                        <span className="scheduled-value">
                          {scheduledDate}
                          <small>Scheduled</small>
                        </span>
                      ) : (
                        equipment.nextService
                      )}
                    </td>
                    <td>{equipment.technician}</td>
                    <td>
                      <span className={`priority-badge ${getPriorityClass(equipment.priority)}`}>
                        {equipment.priority}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="action-btn"
                        onClick={() => openSchedule(equipment)}
                      >
                        <FiCalendar aria-hidden="true" />
                        {scheduledDate ? 'Reschedule' : 'Schedule'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredEquipment.length === 0 && (
            <div className="maintenance-empty-state">
              No maintenance records match your current search and filter.
            </div>
          )}
        </div>

        {selectedEquipment && (
          <div className="maintenance-modal-overlay" onClick={closeSchedule}>
            <div
              className="maintenance-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="maintenance-schedule-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="maintenance-modal-header">
                <div>
                  <span className="maintenance-modal-kicker">Maintenance</span>
                  <h2 id="maintenance-schedule-title">Schedule Service</h2>
                </div>
                <button
                  type="button"
                  className="maintenance-modal-close"
                  onClick={closeSchedule}
                  aria-label="Close scheduling dialog"
                >
                  <FiX />
                </button>
              </div>

              <div className="maintenance-modal-equipment">
                <strong>{selectedEquipment.name}</strong>
                <span>{selectedEquipment.lab} · {selectedEquipment.technician}</span>
              </div>

              <label className="maintenance-date-label" htmlFor="maintenance-date">
                Service date
              </label>
              <input
                id="maintenance-date"
                className="maintenance-date-input"
                type="date"
                value={scheduleDate}
                onChange={(event) => setScheduleDate(event.target.value)}
              />

              <div className="maintenance-modal-actions">
                <button type="button" className="modal-secondary-btn" onClick={closeSchedule}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="modal-primary-btn"
                  disabled={!scheduleDate}
                  onClick={confirmSchedule}
                >
                  Confirm Schedule
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
