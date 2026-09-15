import React from 'react';
import { Calendar, Clock, MapPin, PhoneCall, Sparkles } from 'lucide-react';
import type { PoojaEvent } from '../types';

interface EventTimelineProps {
  events: PoojaEvent[];
}

export const EventTimeline: React.FC<EventTimelineProps> = ({ events }) => {
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
              border: evt.isImportant ? '1px solid #FDE68A' : '1px solid #E2E8F0',
              background: evt.isImportant ? '#FEF3C7' : '#FFFFFF',
            }}
          >
            {evt.isImportant && (
              <span style={{ marginBottom: '8px', color: '#B45309', background: '#FEF3C7', border: '1px solid #FDE68A', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={12} /> Key Event
              </span>
            )}

            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: evt.isImportant ? '#92400E' : '#0F172A' }}>
              {evt.title}
            </h3>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.4 }}>
              {evt.description}
            </p>

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
