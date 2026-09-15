import React, { useState } from 'react';
import { Plus, Trash2, Pencil, Receipt, Search, Eye } from 'lucide-react';
import type { ExpenseRecord, ExpenseCategory, PaymentMode } from '../types';

interface ExpenseLogProps {
  expenseList: ExpenseRecord[];
  onAddExpense: (expense: Omit<ExpenseRecord, 'id' | 'createdAt'>) => void;
  onEditExpense: (expense: ExpenseRecord) => void;
  onDeleteExpense: (id: string) => void;
  openAddModalTrigger?: number;
}

const CATEGORIES: ExpenseCategory[] = [
  'Pandal & Decoration',
  'Murti & Flowers',
  'Prasadam & Food',
  'Sound & Lighting',
  'Daily Aarti & Pandit',
  'Visarjan Procession',
  'Printing & Banners',
  'Miscellaneous',
];

export const ExpenseLog: React.FC<ExpenseLogProps> = ({
  expenseList,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
  openAddModalTrigger,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ExpenseRecord | null>(null);
  const [selectedBillImage, setSelectedBillImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Form state
  const [category, setCategory] = useState<ExpenseCategory>('Pandal & Decoration');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(1000);
  const [paidBy, setPaidBy] = useState('Kamesh Bandla');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [billUrl, setBillUrl] = useState<string>('');

  React.useEffect(() => {
    if (openAddModalTrigger && openAddModalTrigger > 0) {
      handleOpenAdd();
    }
  }, [openAddModalTrigger]);

  const handleOpenAdd = () => {
    setEditingRecord(null);
    setCategory('Pandal & Decoration');
    setDescription('');
    setAmount(1000);
    setPaidBy('Kamesh Bandla');
    setPaymentMode('UPI');
    setDate(new Date().toISOString().split('T')[0]);
    setBillUrl('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (expense: ExpenseRecord) => {
    setEditingRecord(expense);
    setCategory(expense.category);
    setDescription(expense.description);
    setAmount(expense.amount);
    setPaidBy(expense.paidBy);
    setPaymentMode(expense.paymentMode);
    setDate(expense.date);
    setBillUrl(expense.billUrl || '');
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBillUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || amount <= 0 || !paidBy) {
      alert('Please fill out Description, Amount, and Paid By fields.');
      return;
    }

    if (editingRecord) {
      onEditExpense({
        ...editingRecord,
        category,
        description,
        amount: Number(amount),
        paidBy,
        date,
        paymentMode,
        billUrl,
      });
    } else {
      onAddExpense({
        category,
        description,
        amount: Number(amount),
        paidBy,
        date,
        paymentMode,
        billUrl,
      });
    }

    setIsModalOpen(false);
    setEditingRecord(null);
    setDescription('');
    setBillUrl('');
  };

  const filteredList = expenseList.filter((e) => {
    const matchesSearch =
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.paidBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'All' ? true : e.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ marginBottom: '32px' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Receipt style={{ color: '#DC2626' }} /> Ganesh Utsav Expense Register
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
            Categorized expenses paid by committee members with bill photo proofs
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '200px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '32px' }}
            />
          </div>

          <select
            className="form-control"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ width: '160px' }}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <button className="app-btn" onClick={handleOpenAdd} style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', color: '#FFF' }}>
            <Plus size={18} /> Record Expense
          </button>
        </div>
      </div>

      {/* Expense Cards / Table */}
      <div className="app-card" style={{ overflowX: 'auto', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#1D4ED8', fontFamily: 'var(--font-title)' }}>
              <th style={{ padding: '14px 16px' }}>Category</th>
              <th style={{ padding: '14px 16px' }}>Description</th>
              <th style={{ padding: '14px 16px' }}>Amount</th>
              <th style={{ padding: '14px 16px' }}>Paid By</th>
              <th style={{ padding: '14px 16px' }}>Mode</th>
              <th style={{ padding: '14px 16px' }}>Date</th>
              <th style={{ padding: '14px 16px' }}>Bill Proof</th>
              <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((e) => (
              <tr key={e.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', padding: '3px 8px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>
                    {e.category}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0F172A' }}>{e.description}</td>
                <td style={{ padding: '12px 16px', fontWeight: 700, color: '#DC2626' }}>
                  ₹{e.amount.toLocaleString('en-IN')}
                </td>
                <td style={{ padding: '12px 16px', color: '#1D4ED8', fontWeight: 600 }}>{e.paidBy}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: '#EFF6FF', color: '#1D4ED8', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                    {e.paymentMode}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{e.date}</td>
                <td style={{ padding: '12px 16px' }}>
                  {e.billUrl ? (
                    <button
                      className="app-btn app-btn-secondary"
                      onClick={() => setSelectedBillImage(e.billUrl!)}
                      style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                    >
                      <Eye size={12} /> View Bill
                    </button>
                  ) : (
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>No Bill</span>
                  )}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={() => handleOpenEdit(e)}
                      style={{ background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', padding: '4px' }}
                      title="Edit Expense"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete expense "${e.description}"?`)) {
                          onDeleteExpense(e.id);
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
            ))}

            {filteredList.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No expense records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Expense Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#DC2626' }}>
              {editingRecord ? '✏️ Edit Expense Record' : '💸 Record New Expense'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    className="form-control"
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    required
                    min={1}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description / Item Details</label>
                <input
                  type="text"
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="e.g. Laddu Prasad 20kg or Flowers for Murti"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Paid By (Committee Member)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={paidBy}
                    onChange={(e) => setPaidBy(e.target.value)}
                    required
                    placeholder="Member Name"
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
                  <label>Attach Bill / Receipt Photo (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="form-control"
                    style={{ padding: '6px' }}
                  />
                </div>
              </div>

              {billUrl && (
                <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                  <img src={billUrl} alt="Bill Preview" style={{ maxHeight: '120px', borderRadius: '8px', border: '1px solid #2563EB' }} />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="app-btn app-btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="app-btn" style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', color: '#FFF' }}>
                  {editingRecord ? 'Update Expense' : 'Save Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Bill Image Modal */}
      {selectedBillImage && (
        <div className="modal-overlay" onClick={() => setSelectedBillImage(null)}>
          <div className="modal-container" style={{ textAlign: 'center', maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', color: '#0F172A' }}>🧾 Bill Receipt Photo</h3>
            <img src={selectedBillImage} alt="Bill Receipt" style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: '12px' }} />
            <div style={{ marginTop: '16px' }}>
              <button className="app-btn app-btn-secondary" onClick={() => setSelectedBillImage(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
