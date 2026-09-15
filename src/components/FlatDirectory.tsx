import React, { useState } from 'react';
import { Search, Send, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import type { FlatStatus } from '../types';
import { generateWhatsAppReminderText, openWhatsAppShareLink } from '../utils/whatsappFormatter';

interface FlatDirectoryProps {
  flats: FlatStatus[];
  onSelectFlatPayment: (flatNo: string, residentName: string) => void;
}

export const FlatDirectory: React.FC<FlatDirectoryProps> = ({
  flats,
  onSelectFlatPayment,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Received' | 'Pending'>('All');

  const filteredFlats = flats.filter((f) => {
    const matchesSearch =
      f.flatNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.residentName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' ? true : f.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const paidCount = flats.filter((f) => f.status === 'Received').length;
  const pendingCount = flats.filter((f) => f.status !== 'Received').length;

  const handleSendReminder = (flat: FlatStatus) => {
    const pendingAmount = flat.targetAmount - flat.paidAmount;
    const msg = generateWhatsAppReminderText(flat.flatNo, flat.residentName, pendingAmount);
    openWhatsAppShareLink(msg);
  };

  return (
    <div style={{ marginBottom: '28px' }}>
      
      {/* Header & Pill Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', margin: 0 }}>🏢 RS Towers Flats Directory</h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
            Tap any flat to record payment or send WhatsApp reminder
          </p>
        </div>

        {/* Pill Filter Chips */}
        <div className="chip-group">
          <button
            className={`chip ${statusFilter === 'All' ? 'active' : ''}`}
            onClick={() => setStatusFilter('All')}
          >
            All ({flats.length})
          </button>
          <button
            className={`chip ${statusFilter === 'Received' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Received')}
          >
            Paid ({paidCount})
          </button>
          <button
            className={`chip ${statusFilter === 'Pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Pending')}
          >
            Pending ({pendingCount})
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        <input
          type="text"
          className="form-control"
          placeholder="Search Flat # or Resident Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ paddingLeft: '40px', borderRadius: '12px' }}
        />
      </div>

      {/* Grid of 15 Flat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '12px' }}>
        {filteredFlats.map((flat) => {
          const isFullyPaid = flat.status === 'Received';
          const pendingAmt = flat.targetAmount - flat.paidAmount;

          return (
            <div
              key={flat.flatNo}
              className="app-card"
              style={{
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isFullyPaid ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              <div>
                {/* Flat Number & Status Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-gold)', background: 'rgba(245, 158, 11, 0.12)', padding: '3px 10px', borderRadius: '8px' }}>
                    Flat #{flat.flatNo}
                  </span>

                  {isFullyPaid ? (
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#34D399', background: 'rgba(16, 185, 129, 0.15)', padding: '3px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} /> Paid
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#F87171', background: 'rgba(239, 68, 68, 0.15)', padding: '3px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={12} /> Pending
                    </span>
                  )}
                </div>

                {/* Resident Name */}
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFF', marginBottom: '4px' }}>
                  {flat.residentName || 'Owner'}
                </div>

                {/* Contribution details */}
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  <div>Paid: <strong style={{ color: isFullyPaid ? '#34D399' : '#FFF' }}>₹{flat.paidAmount.toLocaleString('en-IN')}</strong> / ₹{flat.targetAmount.toLocaleString('en-IN')}</div>
                  {!isFullyPaid && (
                    <div style={{ color: '#F87171', fontSize: '0.76rem', fontWeight: 600, marginTop: '2px' }}>
                      Due: ₹{pendingAmt.toLocaleString('en-IN')}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '10px' }}>
                <button
                  className="app-btn app-btn-secondary"
                  onClick={() => onSelectFlatPayment(flat.flatNo, flat.residentName)}
                  style={{ flex: 1, padding: '6px 10px', fontSize: '0.78rem' }}
                >
                  <Plus size={14} /> Record
                </button>

                {!isFullyPaid && (
                  <button
                    className="app-btn app-btn-whatsapp"
                    onClick={() => handleSendReminder(flat)}
                    style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                  >
                    <Send size={13} /> Reminder
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
