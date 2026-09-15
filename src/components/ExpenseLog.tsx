import React, { useState } from 'react';
import { Plus, Trash2, Pencil, CreditCard, Search, Eye, ArrowUpDown, ArrowUp, ArrowDown, User } from 'lucide-react';
import type { ExpenseRecord, ExpenseCategory, PaymentMode, FlatStatus } from '../types';

interface ExpenseLogProps {
  expenseList: ExpenseRecord[];
  flatsList?: FlatStatus[];
  onAddExpense: (expense: Omit<ExpenseRecord, 'id' | 'createdAt'>) => void;
  onEditExpense: (expense: ExpenseRecord) => void;
  onDeleteExpense: (id: string) => void;
  openAddModalTrigger?: number;
  isAdmin?: boolean;
}

type SortField = 'category' | 'description' | 'amount' | 'paidBy' | 'paymentMode' | 'date';

const CATEGORIES: ExpenseCategory[] = [
  'Pandal & Decoration',
  'Murti & Flowers',
  'Prasadam & Food',
  'Sound & Lighting',
  'Daily Aarti & Pandit',
  'Visarjan Procession',
  'Printing & Banners',
  'Gifts',
  'Miscellaneous',
];

const DEFAULT_PAID_BY_OPTIONS = [
  'Flat 302 - Kamesh',
  'Flat 301 - Yugandhar',
  'Flat 101 - Bobby',
  'Flat 102 - Tenant',
  'Flat 103 - Balaji',
  'Flat 201 - Naveen Varma',
  'Flat 202 - Satya Nimmakayala',
  'Flat 203 - Harshavardhan',
  'Flat 303 - Sharath Babu',
  'Flat 401 - Arun',
  'Flat 402 - Ujwala',
  'Flat 403 - Ravi Shankar',
  'Flat 501 - Srikanth',
  'Flat 502 - Prasanna',
  'Flat 503 - Owner',
  'Vendor',
  'Committee Treasurer',
];

export const ExpenseLog: React.FC<ExpenseLogProps> = ({
  expenseList,
  flatsList,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
  openAddModalTrigger,
  isAdmin = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ExpenseRecord | null>(null);
  const [selectedBillImage, setSelectedBillImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string>('All');

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Form state
  const [category, setCategory] = useState<ExpenseCategory>('Pandal & Decoration');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(1000);

  // Dynamic Paid By Dropdown Options
  const paidByOptions = flatsList && flatsList.length > 0
    ? [
        ...flatsList.map((f) => `Flat ${f.flatNo} - ${f.residentName || 'Resident'}`),
        'Vendor',
        'Committee Treasurer',
      ]
    : DEFAULT_PAID_BY_OPTIONS;

  const [paidBy, setPaidBy] = useState<string>('Flat 302 - Kamesh');
  const [isCustomPaidBy, setIsCustomPaidBy] = useState<boolean>(false);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [billUrl, setBillUrl] = useState<string>('');

  React.useEffect(() => {
    if (openAddModalTrigger && openAddModalTrigger > 0) {
      handleOpenAdd();
    }
  }, [openAddModalTrigger]);

  // Aggregate total expenses paid per member/person
  const memberTotalsMap: Record<string, { totalAmount: number; count: number }> = {};
  expenseList.forEach((e) => {
    const person = e.paidBy.trim() || 'Unknown';
    if (!memberTotalsMap[person]) {
      memberTotalsMap[person] = { totalAmount: 0, count: 0 };
    }
    memberTotalsMap[person].totalAmount += e.amount;
    memberTotalsMap[person].count += 1;
  });

  const memberTotalsList = Object.entries(memberTotalsMap)
    .map(([person, data]) => ({
      person,
      totalAmount: data.totalAmount,
      count: data.count,
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount);

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
    setCategory('Pandal & Decoration');
    setDescription('');
    setAmount(1000);
    setPaidBy(paidByOptions[0] || 'Flat 302 - Kamesh');
    setIsCustomPaidBy(false);
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
    setIsCustomPaidBy(!paidByOptions.includes(expense.paidBy));
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
    const matchesMember = selectedMemberFilter === 'All' ? true : e.paidBy === selectedMemberFilter;

    return matchesSearch && matchesCategory && matchesMember;
  });

  const sortedList = [...filteredList].sort((a, b) => {
    let valA: any = a[sortField] ?? '';
    let valB: any = b[sortField] ?? '';

    if (typeof valA === 'string') {
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
      <div className="table-header-bar">
        <div className="section-header-title">
          <h2>
            <CreditCard style={{ color: '#DC2626', flexShrink: 0 }} /> Ganesh Utsav Expense Register
          </h2>
          <p>
            Categorized expenses paid by committee members with bill photo proofs (Click table headers to sort)
          </p>
        </div>

        <div className="table-header-controls">
          <div className="search-box-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="form-control"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="form-control filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {isAdmin && (
            <button className="app-btn action-btn" onClick={handleOpenAdd} style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', color: '#FFF' }}>
              <Plus size={18} /> Record Expense
            </button>
          )}
        </div>
      </div>

      {/* Member-wise Total Expense Paid Summary Cards */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '1rem', margin: 0, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={16} style={{ color: '#2563EB' }} /> Member-wise Total Expense Paid Summary
          </h3>
          {selectedMemberFilter !== 'All' && (
            <button
              onClick={() => setSelectedMemberFilter('All')}
              style={{ background: '#EFF6FF', border: '1px solid #93C5FD', color: '#1D4ED8', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
            >
              Clear Member Filter (Show All)
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
          {memberTotalsList.map((m) => {
            const isSelected = selectedMemberFilter === m.person;

            return (
              <div
                key={m.person}
                onClick={() => setSelectedMemberFilter(isSelected ? 'All' : m.person)}
                className="app-card"
                style={{
                  padding: '14px',
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #2563EB' : '1px solid #E2E8F0',
                  background: isSelected ? '#EFF6FF' : '#FFFFFF',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={13} color="#2563EB" /> {m.person}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', background: '#F1F5F9', padding: '1px 6px', borderRadius: '4px' }}>
                    {m.count} item{m.count > 1 ? 's' : ''}
                  </span>
                </div>

                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#DC2626', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  ₹{m.totalAmount.toLocaleString('en-IN')}
                </div>

                <div style={{ fontSize: '0.72rem', color: isSelected ? '#1D4ED8' : '#64748B', marginTop: '2px' }}>
                  {isSelected ? '✓ Showing expenses for this member' : 'Click to filter expenses table'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expense Cards / Table */}
      <div className="app-card" style={{ overflowX: 'auto', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem', minWidth: '820px' }}>
          <thead>
            <tr style={{ background: '#F0F9FF', borderBottom: '1px solid #D4F1F7', color: '#0077B6', fontFamily: 'var(--font-title)', userSelect: 'none' }}>
              <th onClick={() => handleSort('category')} style={{ padding: '14px 16px', cursor: 'pointer', whiteSpace: 'nowrap', minWidth: '160px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>Category {renderSortIcon('category')}</span>
              </th>
              <th onClick={() => handleSort('description')} style={{ padding: '14px 16px', cursor: 'pointer', whiteSpace: 'nowrap', minWidth: '180px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>Description {renderSortIcon('description')}</span>
              </th>
              <th onClick={() => handleSort('amount')} style={{ padding: '14px 16px', cursor: 'pointer', whiteSpace: 'nowrap', minWidth: '115px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>Amount {renderSortIcon('amount')}</span>
              </th>
              <th onClick={() => handleSort('paidBy')} style={{ padding: '14px 16px', cursor: 'pointer', whiteSpace: 'nowrap', minWidth: '160px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>Paid By {renderSortIcon('paidBy')}</span>
              </th>
              <th onClick={() => handleSort('paymentMode')} style={{ padding: '14px 16px', cursor: 'pointer', whiteSpace: 'nowrap', minWidth: '95px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>Mode {renderSortIcon('paymentMode')}</span>
              </th>
              <th onClick={() => handleSort('date')} style={{ padding: '14px 16px', cursor: 'pointer', whiteSpace: 'nowrap', minWidth: '105px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>Date {renderSortIcon('date')}</span>
              </th>
              <th style={{ padding: '14px 16px', whiteSpace: 'nowrap', minWidth: '110px' }}>Bill Proof</th>
              {isAdmin && <th style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap', minWidth: '95px' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {sortedList.map((e) => (
              <tr key={e.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s ease' }}>
                <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', padding: '3px 9px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {e.category}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap' }}>{e.description}</td>
                <td style={{ padding: '12px 16px', fontWeight: 700, color: '#DC2626', whiteSpace: 'nowrap', fontSize: '0.92rem' }}>
                  ₹{e.amount.toLocaleString('en-IN')}
                </td>
                <td style={{ padding: '12px 16px', color: '#1D4ED8', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  <span
                    onClick={() => setSelectedMemberFilter(selectedMemberFilter === e.paidBy ? 'All' : e.paidBy)}
                    style={{ cursor: 'pointer', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}
                    title="Click to filter by this member"
                  >
                    {e.paidBy}
                  </span>
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
                    color: e.paymentMode === 'UPI' ? '#047857' : e.paymentMode === 'Cash' ? '#B45309' : '#1D4ED8',
                    background: e.paymentMode === 'UPI' ? '#ECFDF5' : e.paymentMode === 'Cash' ? '#FFFBEB' : '#EFF6FF',
                    border: e.paymentMode === 'UPI' ? '1px solid #A7F3D0' : e.paymentMode === 'Cash' ? '1px solid #FDE68A' : '1px solid #BFDBFE',
                  }}>
                    {e.paymentMode}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', fontSize: '0.84rem' }}>{e.date}</td>
                <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                  {e.billUrl ? (
                    <button
                      className="app-btn app-btn-secondary"
                      onClick={() => setSelectedBillImage(e.billUrl!)}
                      style={{ padding: '4px 8px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                    >
                      <Eye size={12} /> View Bill
                    </button>
                  ) : (
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>No Bill</span>
                  )}
                </td>
                {isAdmin && (
                  <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        onClick={() => handleOpenEdit(e)}
                        style={{ background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', padding: '4px' }}
                        title="Edit Expense"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => onDeleteExpense(e.id)}
                        style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '4px' }}
                        title="Delete Record"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}

            {sortedList.length === 0 && (
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
                  <label>Paid By (Flat / Member / Vendor)</label>
                  <select
                    className="form-control"
                    value={isCustomPaidBy || (!paidByOptions.includes(paidBy) && paidBy !== '') ? 'CUSTOM' : paidBy}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'CUSTOM') {
                        setIsCustomPaidBy(true);
                        setPaidBy('');
                      } else {
                        setIsCustomPaidBy(false);
                        setPaidBy(val);
                      }
                    }}
                  >
                    {paidByOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                    <option value="CUSTOM">✏️ Type Custom Name...</option>
                  </select>

                  {(isCustomPaidBy || (!paidByOptions.includes(paidBy) && paidBy !== '')) && (
                    <input
                      type="text"
                      className="form-control"
                      style={{ marginTop: '8px' }}
                      value={paidBy}
                      onChange={(e) => setPaidBy(e.target.value)}
                      required
                      placeholder="Type Member or Vendor Name"
                    />
                  )}
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
