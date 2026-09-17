import { useEffect, useMemo, useState } from 'react';
import { Sidebar } from '../Components/Dashboardc/Sidebar';
import { equipmentList } from '../data/equipmentData';
import { FiAlertCircle, FiCalendar, FiCheckCircle, FiClock, FiTool, FiX } from 'react-icons/fi';
import '../Styles/Pagecss/Equipment.css';

type BookingForm = {
  date: string;
  startTime: string;
  duration: string;
};

// The equipment page owns the temporary UI state for this badge.
// A later badge can move confirmed bookings into a shared context/backend.
const defaultBookingForm: BookingForm = {
  date: '',
  startTime: '09:00',
  duration: '1 hour',
};

const categories = [
  'All',
  'Measurement',
  'Fabrication',
  'Microcontroller',
  'Robotics',
  'Electronics',
];

const statusFilters = ['All', 'available', 'unavailable', 'maintenance'];

export function Equipment() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [bookingForm, setBookingForm] = useState<BookingForm>(defaultBookingForm);
  const [bookings, setBookings] = useState<Record<string, BookingForm>>({});
  const [bookingMessage, setBookingMessage] = useState('');

  // Keep the selected item easy to locate without duplicating equipment data.
  const selectedEquipment = useMemo(
    () => equipmentList.find((item) => item.id === selectedEquipmentId) ?? null,
    [selectedEquipmentId],
  );

  const filtered = useMemo(() => {
    return equipmentList.filter((item) => {
      const matchCategory = selectedCategory === 'All' || item.tag === selectedCategory;
      const matchStatus = selectedStatus === 'All' || item.status === selectedStatus;
      return matchCategory && matchStatus;
    });
  }, [selectedCategory, selectedStatus]);

  // Allow Esc to close the booking dialog, matching the expected modal interaction.
  useEffect(() => {
    if (!selectedEquipment) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeBookingModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEquipment]);

  const openBookingModal = (equipmentId: string) => {
    setBookingMessage('');
    setBookingForm({
      ...defaultBookingForm,
      // Prevent selecting a date in the past.
      date: new Date().toISOString().split('T')[0],
    });
    setSelectedEquipmentId(equipmentId);
  };

  const closeBookingModal = () => {
    setSelectedEquipmentId(null);
    setBookingMessage('');
  };

  const handleBookingChange = (field: keyof BookingForm, value: string) => {
    setBookingForm((current) => ({ ...current, [field]: value }));
  };

  const handleConfirmBooking = (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedEquipment) return;

    // The confirmation is stored locally so the user can immediately test the flow.
    setBookings((current) => ({
      ...current,
      [selectedEquipment.id]: bookingForm,
    }));
    setBookingMessage(
      `${selectedEquipment.name} has been booked for ${bookingForm.date} at ${bookingForm.startTime}.`,
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <FiCheckCircle aria-hidden="true" />;
      case 'unavailable':
        return <FiAlertCircle aria-hidden="true" />;
      default:
        return <FiTool aria-hidden="true" />;
    }
  };

  return (
    <div className="equipment-page">
      <Sidebar />

      <main className="equipment-main">
        <div className="equipment-header">
          <div>
            <p className="page-eyebrow">Lab inventory</p>
            <h1>Equipment</h1>
            <p>Browse equipment, check availability, and request a booking.</p>
          </div>
          <div className="equipment-count">
            {filtered.length} {filtered.length === 1 ? 'item' : 'items'} shown
          </div>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label htmlFor="equipment-category">Category:</label>
            <div className="filter-buttons" id="equipment-category">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={selectedCategory === category ? 'active' : ''}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">Status:</span>
            <div className="filter-buttons" aria-label="Equipment status filters">
              {statusFilters.map((status) => (
                <button
                  key={status}
                  type="button"
                  className={selectedStatus === status ? 'active' : ''}
                  onClick={() => setSelectedStatus(status)}
                >
                  {status === 'available'
                    ? 'Available'
                    : status === 'unavailable'
                      ? 'Unavailable'
                      : status === 'maintenance'
                        ? 'Under Maintenance'
                        : 'All'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="equipment-grid">
          {filtered.map((item) => {
            const booking = bookings[item.id];
            const bookingComplete = Boolean(booking);

            return (
              <article key={item.id} className="equipment-card">
                <div className="card-image-placeholder">
                  {item.image ? <img src={item.image} alt={item.name} loading="lazy" /> : <span aria-hidden="true">{item.imagePlaceholder}</span>}
                </div>

                <div className="card-content">
                  <div className="card-heading-row">
                    <h2>{item.name}</h2>
                    <span className="location-chip">{item.location}</span>
                  </div>

                  <p className="description">{item.description}</p>

                  <div className="meta">
                    <span className="tag">{item.tag}</span>
                    <span className={`status-badge ${item.status}`}>
                      {getStatusIcon(item.status)}
                      {item.status === 'available'
                        ? 'Available'
                        : item.status === 'unavailable'
                          ? 'Unavailable'
                          : 'Under Maintenance'}
                    </span>
                  </div>

                  {bookingComplete && booking && (
                    <div className="booking-confirmed">
                      <FiCalendar aria-hidden="true" />
                      <div>
                        <strong>Booking requested</strong>
                        <span>
                          {booking.date} · {booking.startTime} · {booking.duration}
                        </span>
                      </div>
                    </div>
                  )}

                  {item.status === 'available' ? (
                    <button
                      type="button"
                      onClick={() => openBookingModal(item.id)}
                      className={`book-btn ${bookingComplete ? 'booked' : ''}`}
                    >
                      {bookingComplete ? 'Book Again' : 'Book Now'}
                    </button>
                  ) : (
                    <button type="button" disabled className="book-btn disabled">
                      {item.status === 'unavailable' ? 'Unavailable' : 'Under Maintenance'}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="empty-equipment-state">
            <FiAlertCircle aria-hidden="true" />
            <h2>No equipment matches these filters</h2>
            <p>Try another category or status filter.</p>
          </div>
        )}
      </main>

      {selectedEquipment && (
        <div className="booking-modal-overlay" onMouseDown={closeBookingModal}>
          <div
            className="booking-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="booking-modal-close"
              onClick={closeBookingModal}
              aria-label="Close booking dialog"
            >
              <FiX />
            </button>

            <div className="booking-modal-header">
              <span className="modal-icon"><FiCalendar /></span>
              <div>
                <p className="page-eyebrow">Equipment booking</p>
                <h2 id="booking-modal-title">{selectedEquipment.name}</h2>
                <p>{selectedEquipment.location} · {selectedEquipment.tag}</p>
              </div>
            </div>

            {bookingMessage ? (
              <div className="booking-success" role="status">
                <FiCheckCircle />
                <div>
                  <strong>Booking confirmed</strong>
                  <p>{bookingMessage}</p>
                </div>
                <button type="button" onClick={closeBookingModal}>Done</button>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="booking-form">
                <div className="booking-form-grid">
                  <label>
                    Date
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingForm.date}
                      onChange={(event) => handleBookingChange('date', event.target.value)}
                      required
                    />
                  </label>

                  <label>
                    Start time
                    <select
                      value={bookingForm.startTime}
                      onChange={(event) => handleBookingChange('startTime', event.target.value)}
                    >
                      <option value="09:00">09:00</option>
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="13:00">13:00</option>
                      <option value="14:00">14:00</option>
                      <option value="15:00">15:00</option>
                    </select>
                  </label>

                  <label>
                    Duration
                    <select
                      value={bookingForm.duration}
                      onChange={(event) => handleBookingChange('duration', event.target.value)}
                    >
                      <option value="1 hour">1 hour</option>
                      <option value="2 hours">2 hours</option>
                      <option value="3 hours">3 hours</option>
                    </select>
                  </label>
                </div>

                <div className="booking-note">
                  <FiClock />
                  <span>Booking requests are recorded locally for this badge so you can test the complete interaction.</span>
                </div>

                <div className="booking-modal-actions">
                  <button type="button" className="secondary-btn" onClick={closeBookingModal}>
                    Cancel
                  </button>
                  <button type="submit" className="primary-btn">
                    Confirm Booking
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
