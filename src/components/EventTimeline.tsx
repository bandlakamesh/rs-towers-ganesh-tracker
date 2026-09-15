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
          <Calendar style={{ color: 'var(--primary-gold)' }} /> Pooja Schedule & Event Highlights
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
          Daily Aarti timings, Annadanam feast, cultural programs & Visarjan details
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {events.map((evt) => (
          <div
            key={evt.id}
            className="glass-card"
            style={{
              padding: '20px',
              border: evt.isImportant ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid var(--bg-card-border)',
              background: evt.isImportant ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(18, 26, 43, 0.8) 100%)' : 'var(--bg-card)',
            }}
          >
            {evt.isImportant && (
              <span className="badge badge-partial" style={{ marginBottom: '8px', color: '#FCD34D' }}>
                <Sparkles size={12} /> Key Event
              </span>
            )}

            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: evt.isImportant ? 'var(--text-gold)' : 'var(--text-main)' }}>
              {evt.title}
            </h3>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.4 }}>
              {evt.description}
            </p>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} color="var(--primary-gold)" />
                <strong>Date & Time:</strong> {evt.date} • {evt.time}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} color="#F87171" />
                <strong>Venue:</strong> {evt.location}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <PhoneCall size={14} color="#34D399" />
                <strong>Coordinator:</strong> {evt.coordinator} ({evt.phone})
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
