import React, { useState } from 'react';
import { Search, Send, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
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
  const [statusFilter, setStatusFilter] = useState<'All' | 'Received' | 'Partial' | 'Pending'>('All');

  const filteredFlats = flats.filter((f) => {
    const matchesSearch =
      f.flatNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.residentName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' ? true : f.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Received':
        return <span className="badge badge-received"><CheckCircle size={12} /> Paid</span>;
      case 'Partial':
        return <span className="badge badge-partial"><Clock size={12} /> Partial</span>;
      default:
        return <span className="badge badge-pending"><AlertCircle size={12} /> Pending</span>;
    }
  };

  const handleSendReminder = (flat: FlatStatus) => {
    const pendingAmount = flat.targetAmount - flat.paidAmount;
    const msg = generateWhatsAppReminderText(flat.flatNo, flat.residentName, pendingAmount);
    openWhatsAppShareLink(msg);
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      
      {/* Header & Filter Row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>🏢 RS Towers Resident Directory (15 Flats)</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            Flat-wise donation collection status and WhatsApp reminder trigger
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', width: '100%', maxWidth: '520px' }}>
          
          <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search Flat No or Resident..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
          </div>

          <select
            className="form-control"
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            style={{ width: '130px' }}
          >
            <option value="All">All Status</option>
            <option value="Received">Paid</option>
            <option value="Partial">Partial</option>
            <option value="Pending">Pending</option>
          </select>

        </div>
      </div>

      {/* Grid of 15 Flat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
        {filteredFlats.map((flat) => {
          const isFullyPaid = flat.status === 'Received';
          const pendingAmt = flat.targetAmount - flat.paidAmount;

          return (
            <div key={flat.flatNo} className="glass-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              
              <div>
                {/* Flat Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-gold)', background: 'rgba(245, 158, 11, 0.1)', padding: '2px 10px', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                    Flat #{flat.flatNo}
                  </span>
                  {getStatusBadge(flat.status)}
                </div>

                {/* Resident Name */}
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
                  {flat.residentName}
                </h3>

                {/* Payment Breakdown */}
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  <div>Paid: <strong style={{ color: isFullyPaid ? '#34D399' : '#FFF' }}>₹{flat.paidAmount.toLocaleString('en-IN')}</strong> / ₹{flat.targetAmount.toLocaleString('en-IN')}</div>
                  {!isFullyPaid && (
                    <div style={{ color: '#F87171', fontSize: '0.78rem', marginTop: '2px' }}>
                      Pending: ₹{pendingAmt.toLocaleString('en-IN')}
                    </div>
                  )}
                  {flat.lastPaymentDate && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Last paid: {flat.lastPaymentDate}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => onSelectFlatPayment(flat.flatNo, flat.residentName)}
                  style={{ flex: 1, padding: '6px 10px', fontSize: '0.8rem' }}
                >
                  <Plus size={14} /> Record
                </button>

                {!isFullyPaid && (
                  <button
                    className="btn btn-whatsapp"
                    onClick={() => handleSendReminder(flat)}
                    style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                    title="Send WhatsApp Reminder"
                  >
                    <Send size={14} /> Reminder
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {filteredFlats.length === 0 && (
        <div className="glass-card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No flats match your filter criteria.
        </div>
      )}

    </div>
  );
};
