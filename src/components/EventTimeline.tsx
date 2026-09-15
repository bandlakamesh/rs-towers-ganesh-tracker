import React from 'react';
import { Calendar, Clock, MapPin, PhoneCall, Sparkles, Send } from 'lucide-react';
import type { PoojaEvent } from '../types';
import { generateWhatsAppEventReminderText, openWhatsAppShareLink } from '../utils/whatsappFormatter';

interface EventTimelineProps {
  events: PoojaEvent[];
}

export const EventTimeline: React.FC<EventTimelineProps> = ({ events }) => {
  const handleSendEventReminder = (evt: PoojaEvent) => {
    const text = generateWhatsAppEventReminderText(evt);
    openWhatsAppShareLink(text);
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar style={{ color: '#2563EB' }} /> Pooja Schedule & Event Highlights
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
          Daily Aarti timings, Annadanam feast, cultural programs & Visarjan details
        </p>
      </div>

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
    </div>
  );
};
