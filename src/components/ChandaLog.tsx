import React, { useState } from 'react';
import { Plus, Trash2, Pencil, Send, Wallet, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { ChandaRecord, PaymentMode } from '../types';
import { generateWhatsAppReminderText, openWhatsAppShareLink } from '../utils/whatsappFormatter';

interface ChandaLogProps {
  chandaList: ChandaRecord[];
  onAddChanda: (record: Omit<ChandaRecord, 'id' | 'createdAt'>) => void;
  onEditChanda: (record: ChandaRecord) => void;
  onDeleteChanda: (id: string) => void;
}

type SortField = 'receiptNo' | 'flatNo' | 'residentName' | 'amount' | 'paymentMode' | 'date' | 'notes';

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

  // Sorting state (default sort by Flat Number)
  const [sortField, setSortField] = useState<SortField>('flatNo');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Form State
  const [flatNo, setFlatNo] = useState('101');
  const [residentName, setResidentName] = useState('');
  const [residentType, setResidentType] = useState<'Owner' | 'Tenant'>('Owner');
  const [amount, setAmount] = useState<number>(3000);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI');
  const [receiptNo, setReceiptNo] = useState(`RSG-2026-${String(chandaList.length + 1).padStart(3, '0')}`);
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

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

  const sortedList = [...filteredList].sort((a, b) => {
    let valA: any = a[sortField] ?? '';
    let valB: any = b[sortField] ?? '';

    if (sortField === 'flatNo') {
      valA = parseInt(String(valA).replace(/\D/g, ''), 10) || 0;
      valB = parseInt(String(valB).replace(/\D/g, ''), 10) || 0;
    } else if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = String(valB).toLowerCase();
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown size={13} style={{ opacity: 0.4, marginLeft: '4px' }} />;
    return sortOrder === 'asc' ? (
      <ArrowUp size={13} style={{ color: '#2563EB', marginLeft: '4px' }} />
    ) : (
      <ArrowDown size={13} style={{ color: '#2563EB', marginLeft: '4px' }} />
    );
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wallet style={{ color: '#2563EB' }} /> Chanda Collection Log
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
            List of all resident contributions & digital receipts (Click table headers to sort)
          </p>
        </div>

        <div className="table-header-controls" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 180px', minWidth: '160px' }}>
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
            style={{ width: '130px', flex: '0 0 auto' }}
          >
            <option value="All">All Modes</option>
            <option value="UPI">UPI</option>
            <option value="Cash">Cash</option>
            <option value="NetBanking">NetBanking</option>
          </select>

          <button className="app-btn app-btn-primary" onClick={handleOpenAdd} style={{ flex: '0 0 auto' }}>
            <Plus size={18} /> Record Payment
          </button>
        </div>
      </div>

      {/* Chanda Table */}
      <div className="app-card" style={{ overflowX: 'auto', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem', minWidth: '820px' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#1D4ED8', fontFamily: 'var(--font-title)', userSelect: 'none' }}>
              <th onClick={() => handleSort('receiptNo')} style={{ padding: '14px 16px', cursor: 'pointer', whiteSpace: 'nowrap', minWidth: '135px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>Receipt # {renderSortIcon('receiptNo')}</span>
              </th>
              <th onClick={() => handleSort('flatNo')} style={{ padding: '14px 16px', cursor: 'pointer', whiteSpace: 'nowrap', minWidth: '105px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>Flat {renderSortIcon('flatNo')}</span>
              </th>
              <th onClick={() => handleSort('residentName')} style={{ padding: '14px 16px', cursor: 'pointer', whiteSpace: 'nowrap', minWidth: '200px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>Resident & Type {renderSortIcon('residentName')}</span>
              </th>
              <th onClick={() => handleSort('amount')} style={{ padding: '14px 16px', cursor: 'pointer', whiteSpace: 'nowrap', minWidth: '120px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>Amount {renderSortIcon('amount')}</span>
              </th>
              <th onClick={() => handleSort('paymentMode')} style={{ padding: '14px 16px', cursor: 'pointer', whiteSpace: 'nowrap', minWidth: '95px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>Mode {renderSortIcon('paymentMode')}</span>
              </th>
              <th onClick={() => handleSort('date')} style={{ padding: '14px 16px', cursor: 'pointer', whiteSpace: 'nowrap', minWidth: '110px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>Date {renderSortIcon('date')}</span>
              </th>
              <th onClick={() => handleSort('notes')} style={{ padding: '14px 16px', cursor: 'pointer', whiteSpace: 'nowrap', minWidth: '130px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>Notes {renderSortIcon('notes')}</span>
              </th>
              <th style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap', minWidth: '125px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedList.map((c) => {
              const isZeroPending = c.amount === 0 || c.status === 'Pending';
              const isTenant = c.residentType === 'Tenant';

              return (
                <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s ease' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1D4ED8', whiteSpace: 'nowrap', letterSpacing: '0.3px' }}>
                    {c.receiptNo}
                  </td>
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#1E40AF',
                      background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                      border: '1px solid #93C5FD',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      boxShadow: '0 1px 2px rgba(37, 99, 235, 0.08)'
                    }}>
                      Flat {c.flatNo}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                      <span style={{ fontWeight: 600, color: '#0F172A' }}>{c.residentName}</span>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        color: isTenant ? '#6D28D9' : '#4338CA',
                        background: isTenant ? 'linear-gradient(135deg, #F3E8FF 0%, #EDE9FE 100%)' : 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
                        border: isTenant ? '1px solid #DDD6FE' : '1px solid #C7D2FE',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                      }}>
                        {c.residentType || 'Owner'}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {isZeroPending ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', color: '#DC2626', background: '#FEF2F2', border: '1px solid #FECACA', padding: '3px 9px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        ₹0 (Pending)
                      </span>
                    ) : (
                      <span style={{ color: '#059669', fontSize: '0.92rem', whiteSpace: 'nowrap' }}>₹{c.amount.toLocaleString('en-IN')}</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '3px 8px',
                      borderRadius: '5px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      color: c.paymentMode === 'UPI' ? '#047857' : c.paymentMode === 'Cash' ? '#B45309' : '#1D4ED8',
                      background: c.paymentMode === 'UPI' ? '#ECFDF5' : c.paymentMode === 'Cash' ? '#FFFBEB' : '#EFF6FF',
                      border: c.paymentMode === 'UPI' ? '1px solid #A7F3D0' : c.paymentMode === 'Cash' ? '1px solid #FDE68A' : '1px solid #BFDBFE',
                    }}>
                      {c.paymentMode}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', fontSize: '0.84rem' }}>{c.date}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '0.82rem', whiteSpace: 'nowrap', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.notes || '-'}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                      {isZeroPending && (
                        <button
                          onClick={() => handleSendReminder(c)}
                          style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#059669', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' }}
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
                        onClick={() => onDeleteChanda(c.id)}
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

            {sortedList.length === 0 && (
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
                  placeholder=""
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
