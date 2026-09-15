import React, { useState } from 'react';
import { Plus, Trash2, Pencil, Send, Receipt, Search } from 'lucide-react';
import type { ChandaRecord, PaymentMode } from '../types';
import { generateWhatsAppReminderText, openWhatsAppShareLink } from '../utils/whatsappFormatter';

interface ChandaLogProps {
  chandaList: ChandaRecord[];
  onAddChanda: (record: Omit<ChandaRecord, 'id' | 'createdAt'>) => void;
  onEditChanda: (record: ChandaRecord) => void;
  onDeleteChanda: (id: string) => void;
}

export const ChandaLog: React.FC<ChandaLogProps> = ({
  chandaList,
  onAddChanda,
  onEditChanda,
  onDeleteChanda,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ChandaRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modeFilter, setModeFilter] = useState<string>('All');

  // Form State
  const [flatNo, setFlatNo] = useState('101');
  const [residentName, setResidentName] = useState('');
  const [residentType, setResidentType] = useState<'Owner' | 'Tenant'>('Owner');
  const [amount, setAmount] = useState<number>(3000);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI');
  const [receiptNo, setReceiptNo] = useState(`RSG-2026-${String(chandaList.length + 1).padStart(3, '0')}`);
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleOpenAdd = () => {
    setEditingRecord(null);
    setFlatNo('101');
    setResidentName('');
    setResidentType('Owner');
    setAmount(3000);
    setPaymentMode('UPI');
    setReceiptNo(`RSG-2026-${String(chandaList.length + 1).padStart(3, '0')}`);
    setNotes('');
    setDate(new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record: ChandaRecord) => {
    setEditingRecord(record);
    setFlatNo(record.flatNo);
    setResidentName(record.residentName);
    setResidentType(record.residentType || 'Owner');
    setAmount(record.amount);
    setPaymentMode(record.paymentMode);
    setReceiptNo(record.receiptNo);
    setNotes(record.notes || '');
    setDate(record.date);
    setIsModalOpen(true);
  };

  const handleSendReminder = (record: ChandaRecord) => {
    const dueAmount = 3000 - record.amount;
    const msg = generateWhatsAppReminderText(record.flatNo, record.residentName, dueAmount > 0 ? dueAmount : 3000);
    openWhatsAppShareLink(msg);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flatNo || !residentName || amount < 0) {
      alert('Please fill out Flat No, Resident Name, and a valid Amount.');
      return;
    }

    const isPending = Number(amount) === 0;

    if (editingRecord) {
      onEditChanda({
        ...editingRecord,
        flatNo,
        residentName,
        residentType,
        amount: Number(amount),
        date,
        paymentMode,
        status: isPending ? 'Pending' : 'Received',
        receiptNo: receiptNo || editingRecord.receiptNo,
        notes,
      });
    } else {
      onAddChanda({
        flatNo,
        residentName,
        residentType,
        amount: Number(amount),
        date,
        paymentMode,
        status: isPending ? 'Pending' : 'Received',
        receiptNo: receiptNo || `RSG-${Date.now().toString().slice(-6)}`,
        notes,
      });
    }

    setIsModalOpen(false);
    setEditingRecord(null);
    setNotes('');
  };

  const filteredList = chandaList.filter((c) => {
    const matchesSearch =
      c.flatNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.receiptNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMode = modeFilter === 'All' ? true : c.paymentMode === modeFilter;
    return matchesSearch && matchesMode;
  });

  return (
    <div style={{ marginBottom: '32px' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Receipt style={{ color: '#2563EB' }} /> Chanda Collection Log
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
            List of all resident contributions & digital receipts
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '200px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search receipts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '32px' }}
            />
          </div>

          <select
            className="form-control"
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            style={{ width: '130px' }}
          >
            <option value="All">All Modes</option>
            <option value="UPI">UPI</option>
            <option value="Cash">Cash</option>
            <option value="NetBanking">NetBanking</option>
          </select>

          <button className="app-btn app-btn-primary" onClick={handleOpenAdd}>
            <Plus size={18} /> Record Payment
          </button>
        </div>
      </div>

      {/* Chanda Table */}
      <div className="app-card" style={{ overflowX: 'auto', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#1D4ED8', fontFamily: 'var(--font-title)' }}>
              <th style={{ padding: '14px 16px' }}>Receipt #</th>
              <th style={{ padding: '14px 16px' }}>Flat</th>
              <th style={{ padding: '14px 16px' }}>Resident & Type</th>
              <th style={{ padding: '14px 16px' }}>Amount</th>
              <th style={{ padding: '14px 16px' }}>Mode</th>
              <th style={{ padding: '14px 16px' }}>Date</th>
              <th style={{ padding: '14px 16px' }}>Notes</th>
              <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((c) => {
              const isZeroPending = c.amount === 0 || c.status === 'Pending';

              return (
                <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1D4ED8' }}>{c.receiptNo}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ color: '#0F172A', background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '3px 8px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>Flat {c.flatNo}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {c.residentName}
                      <span style={{ fontSize: '0.7rem', color: c.residentType === 'Tenant' ? '#7C3AED' : '#2563EB', background: c.residentType === 'Tenant' ? '#F3E8FF' : '#EFF6FF', border: '1px solid #CBD5E1', padding: '1px 6px', borderRadius: '4px' }}>
                        {c.residentType || 'Owner'}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 700 }}>
                    {isZeroPending ? (
                      <span style={{ color: '#DC2626', background: '#FEF2F2', border: '1px solid #FECACA', padding: '3px 8px', borderRadius: '6px', fontSize: '0.78rem' }}>
                        ₹0 (Pending)
                      </span>
                    ) : (
                      <span style={{ color: '#059669' }}>₹{c.amount.toLocaleString('en-IN')}</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: '#EFF6FF', color: '#1D4ED8', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                      {c.paymentMode}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{c.date}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{c.notes || '-'}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                      {/* WhatsApp Reminder Button shown for 0 amount / pending records */}
                      {isZeroPending && (
                        <button
                          onClick={() => handleSendReminder(c)}
                          style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#059669', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700 }}
                          title="Send WhatsApp Reminder"
                        >
                          <Send size={13} /> Reminder
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenEdit(c)}
                        style={{ background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', padding: '4px' }}
                        title="Edit Donation"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete receipt ${c.receiptNo} for Flat ${c.flatNo}?`)) {
                            onDeleteChanda(c.id);
                          }
                        }}
                        style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '4px' }}
                        title="Delete Record"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredList.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No Chanda records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Chanda Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#1D4ED8' }}>
              {editingRecord ? '✏️ Edit Chanda Payment' : '➕ Record Chanda Payment'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Flat Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={flatNo}
                    onChange={(e) => setFlatNo(e.target.value)}
                    required
                    placeholder="e.g. 101, 102, 202"
                  />
                </div>

                <div className="form-group">
                  <label>Resident Type</label>
                  <select
                    className="form-control"
                    value={residentType}
                    onChange={(e: any) => setResidentType(e.target.value)}
                  >
                    <option value="Owner">Owner</option>
                    <option value="Tenant">Tenant</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Resident Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={residentName}
                  onChange={(e) => setResidentName(e.target.value)}
                  required
                  placeholder="Full Name"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Amount (₹) - Enter 0 for Pending</label>
                  <input
                    type="number"
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    required
                    min={0}
                  />
                </div>

                <div className="form-group">
                  <label>Payment Mode</label>
                  <select
                    className="form-control"
                    value={paymentMode}
                    onChange={(e: any) => setPaymentMode(e.target.value)}
                  >
                    <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                    <option value="Cash">Cash</option>
                    <option value="NetBanking">NetBanking / NEFT</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
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
                  <label>Receipt Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={receiptNo}
                    onChange={(e) => setReceiptNo(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notes / Transaction Reference (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Pending payment or UPI Ref #987123"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="app-btn app-btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="app-btn app-btn-primary">
                  {editingRecord ? 'Update Receipt' : 'Save Receipt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
