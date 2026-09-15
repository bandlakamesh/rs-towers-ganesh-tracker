import React, { useState } from 'react';
import { Calendar, Clock, MapPin, PhoneCall, Sparkles, Send, Plus, Pencil, Trash2, Printer } from 'lucide-react';
import type { PoojaEvent } from '../types';
import { generateWhatsAppEventReminderText, openWhatsAppShareLink } from '../utils/whatsappFormatter';

interface EventTimelineProps {
  events: PoojaEvent[];
  onAddEvent?: (event: Omit<PoojaEvent, 'id'>) => void;
  onEditEvent?: (event: PoojaEvent) => void;
  onDeleteEvent?: (id: string) => void;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<PoojaEvent | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('07:00 PM');
  const [location, setLocation] = useState('RS Towers Main Pandal Ground');
  const [coordinator, setCoordinator] = useState('Kamesh');
  const [phone, setPhone] = useState('Flat 302');
  const [description, setDescription] = useState('');
  const [isImportant, setIsImportant] = useState(true);

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setTitle('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('07:00 PM');
    setLocation('RS Towers Main Pandal Ground');
    setCoordinator('Kamesh');
    setPhone('Flat 302');
    setDescription('');
    setIsImportant(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt: PoojaEvent) => {
    setEditingEvent(evt);
    setTitle(evt.title);
    setDate(evt.date);
    setTime(evt.time);
    setLocation(evt.location);
    setCoordinator(evt.coordinator);
    setPhone(evt.phone);
    setDescription(evt.description);
    setIsImportant(evt.isImportant ?? false);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !location || !coordinator) {
      return;
    }

    if (editingEvent) {
      if (onEditEvent) {
        onEditEvent({
          ...editingEvent,
          title,
          date,
          time,
          location,
          coordinator,
          phone,
          description,
          isImportant,
        });
      }
    } else {
      if (onAddEvent) {
        onAddEvent({
          title,
          date,
          time,
          location,
          coordinator,
          phone,
          description,
          isImportant,
        });
      }
    }

    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleSendEventReminder = (evt: PoojaEvent) => {
    const text = generateWhatsAppEventReminderText(evt);
    openWhatsAppShareLink(text);
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar style={{ color: '#2563EB' }} /> Pooja Schedule & Event Highlights
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
            Daily Aarti timings, Annadanam feast, cultural programs & Visarjan details
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="app-btn app-btn-secondary no-print" onClick={() => window.print()}>
            <Printer size={16} /> Print / PDF
          </button>

          <button className="app-btn app-btn-primary no-print" onClick={handleOpenAdd}>
            <Plus size={18} /> Add Event
          </button>
        </div>
      </div>

      {/* Grid of Event Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {events.map((evt) => (
          <div
            key={evt.id}
            className="app-card"
            style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: evt.isImportant ? '1px solid #FDE68A' : '1px solid #E2E8F0',
              background: evt.isImportant ? '#FEF3C7' : '#FFFFFF',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                {evt.isImportant ? (
                  <span style={{ color: '#B45309', background: '#FEF3C7', border: '1px solid #FDE68A', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={12} /> Key Event
                  </span>
                ) : (
                  <span style={{ color: '#475569', background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                    Schedule
                  </span>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => handleSendEventReminder(evt)}
                    style={{
                      background: '#25D366',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                    title="Send Event Reminder on WhatsApp"
                  >
                    <Send size={12} /> WhatsApp
                  </button>

                  <button
                    onClick={() => handleOpenEdit(evt)}
                    style={{ background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', padding: '4px' }}
                    title="Edit Event"
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    onClick={() => onDeleteEvent?.(evt.id)}
                    style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '4px' }}
                    title="Delete Event"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: evt.isImportant ? '#92400E' : '#0F172A' }}>
                {evt.title}
              </h3>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.4 }}>
                {evt.description}
              </p>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#0F172A', display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid #E2E8F0', paddingTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} color="#D97706" />
                <strong>Date & Time:</strong> {evt.date} • {evt.time}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} color="#DC2626" />
                <strong>Venue:</strong> {evt.location}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <PhoneCall size={14} color="#059669" />
                <strong>Coordinator:</strong> {evt.coordinator} ({evt.phone})
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Event Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#1D4ED8' }}>
              {editingEvent ? '✏️ Edit Pooja Event' : '📅 Add New Pooja Event'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Event Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Maha Prasadam Food Distribution"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="text"
                    className="form-control"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    placeholder="e.g. 07:00 PM or 01:00 PM"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Venue / Location</label>
                <input
                  type="text"
                  className="form-control"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  placeholder="e.g. RS Towers Main Pandal Ground"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Coordinator Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={coordinator}
                    onChange={(e) => setCoordinator(e.target.value)}
                    required
                    placeholder="e.g. Kamesh / Yugandhar"
                  />
                </div>

                <div className="form-group">
                  <label>Contact / Flat #</label>
                  <input
                    type="text"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="e.g. Flat 302 or 9876543210"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Event Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Event details, feast information, or Visarjan route"
                />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  id="isImportant"
                  checked={isImportant}
                  onChange={(e) => setIsImportant(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="isImportant" style={{ cursor: 'pointer', margin: 0, fontWeight: 600, color: '#B45309' }}>
                  ⭐ Highlight as Key Event
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="app-btn app-btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="app-btn app-btn-primary">
                  {editingEvent ? 'Update Event' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
