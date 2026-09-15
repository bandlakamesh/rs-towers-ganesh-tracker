import React, { useState } from 'react';
import { Search, Send, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import type { FlatStatus } from '../types';
import { generateWhatsAppReminderText, openWhatsAppShareLink } from '../utils/whatsappFormatter';

interface FlatDirectoryProps {
  flats: FlatStatus[];
  onSelectFlatPayment: (flatNo: string, residentName: string) => void;
  isAdmin?: boolean;
}

export const FlatDirectory: React.FC<FlatDirectoryProps> = ({
  flats,
  onSelectFlatPayment,
  isAdmin = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Received' | 'Pending'>('All');

  const filteredFlats = flats
    .filter((f) => {
      const matchesSearch =
        f.flatNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.residentName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' ? true : f.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const numA = parseInt(a.flatNo.replace(/\D/g, ''), 10) || 0;
      const numB = parseInt(b.flatNo.replace(/\D/g, ''), 10) || 0;
      return numA - numB;
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
      <div className="table-header-bar">
        <div className="section-header-title">
          <h2>🏢 RS Towers Flats Directory</h2>
          <p>
            Flat-wise donation collection status and WhatsApp reminders
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
      <div className="search-box-wrapper" style={{ marginBottom: '16px', width: '100%' }}>
        <Search size={16} className="search-icon" />
        <input
          type="text"
          className="form-control"
          placeholder="Search Flat # or Resident Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
                border: isFullyPaid ? '1px solid #A7F3D0' : '1px solid #FECACA',
                background: isFullyPaid ? '#F0FDF4' : '#FFFFFF',
              }}
            >
              <div>
                {/* Flat Number & Status Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1D4ED8', background: '#EFF6FF', padding: '3px 10px', borderRadius: '8px' }}>
                    Flat #{flat.flatNo}
                  </span>

                  {isFullyPaid ? (
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '3px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} /> Paid
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#DC2626', background: '#FEF2F2', padding: '3px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={12} /> Pending
                    </span>
                  )}
                </div>

                {/* Resident Name */}
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '2px' }}>
                  {flat.residentName || 'Owner'}
                </div>

                {/* Contribution details: Shown ONLY if Pending */}
                {!isFullyPaid && (
                  <div style={{ fontSize: '0.82rem', color: '#DC2626', fontWeight: 700, marginTop: '4px' }}>
                    Due: ₹{pendingAmt.toLocaleString('en-IN')}
                  </div>
                )}
              </div>

              {/* Action Buttons: Shown ONLY for Pending / Partial flats when Admin */}
              {!isFullyPaid && isAdmin && (
                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #F1F5F9', paddingTop: '10px', marginTop: '12px' }}>
                  <button
                    className="app-btn app-btn-secondary"
                    onClick={() => onSelectFlatPayment(flat.flatNo, flat.residentName)}
                    style={{ flex: 1, padding: '6px 10px', fontSize: '0.78rem' }}
                  >
                    <Plus size={14} /> Record
                  </button>

                  <button
                    className="app-btn app-btn-whatsapp"
                    onClick={() => handleSendReminder(flat)}
                    style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                  >
                    <Send size={13} /> Reminder
                  </button>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
