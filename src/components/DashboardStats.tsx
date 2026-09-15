import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Plus, Receipt } from 'lucide-react';
import type { AppState } from '../types';
import ganeshaBanner from '../assets/ganesha_banner.png';

interface DashboardStatsProps {
  state: AppState;
  onOpenAddChanda: () => void;
  onOpenAddExpense: () => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  state,
  onOpenAddChanda,
  onOpenAddExpense,
}) => {
  const totalCollected = state.chandaList
    .filter((c) => c.status === 'Received')
    .reduce((acc, c) => acc + c.amount, 0);

  const totalSpent = state.expenseList.reduce((acc, e) => acc + e.amount, 0);
  const netBalance = totalCollected - totalSpent;

  return (
    <div style={{ marginBottom: '24px' }}>
      
      {/* Sleek Modern Lord Ganesha Hero Banner */}
      <div
        className="app-card hero-banner-container no-print"
        style={{
          padding: '24px',
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #FFEDD5 100%)',
          border: '1px solid #FCD34D',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 25px -5px rgba(245, 158, 11, 0.2)',
        }}
      >
        <div className="hero-banner-text" style={{ flex: 1, zIndex: 2 }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: '#78350F', letterSpacing: '-0.4px' }}>
            Ganpati Bappa Morya! 🙏
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#92400E', margin: 0, maxWidth: '540px', lineHeight: 1.5, fontWeight: 500 }}>
            Welcome to the official live tracker for RS Towers. Track all 15 flat contributions, daily pandal expenses, and pooja schedules in real-time.
          </p>
        </div>

        {/* Hero Artwork Image */}
        <div className="hero-banner-artwork" style={{ position: 'relative', width: '180px', height: '110px', borderRadius: '14px', overflow: 'hidden', flexShrink: 0, boxShadow: '0 6px 16px rgba(180, 83, 9, 0.25)', border: '2px solid #FDE68A' }}>
          <img
            src={ganeshaBanner}
            alt="Ganapathi Utsav"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>
      
      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '16px' }}>
        
        {/* Card 1: Collected */}
        <div className="app-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Collected</span>
            <div style={{ padding: '6px', borderRadius: '8px', background: '#ECFDF5', color: '#059669' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669' }}>
            ₹{totalCollected.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {state.chandaList.length} receipts logged
          </div>
        </div>

        {/* Card 2: Spent */}
        <div className="app-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Spent</span>
            <div style={{ padding: '6px', borderRadius: '8px', background: '#FEF2F2', color: '#DC2626' }}>
              <TrendingDown size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#DC2626' }}>
            ₹{totalSpent.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {state.expenseList.length} expenses logged
          </div>
        </div>

        {/* Card 3: Cash in Hand */}
        <div className="app-card" style={{ padding: '18px', border: '1px solid #93C5FD', background: '#F8FAFC' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Cash in Hand</span>
            <div style={{ padding: '6px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB' }}>
              <Wallet size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1D4ED8' }}>
            ₹{netBalance.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Net remaining balance
          </div>
        </div>

      </div>

      {/* Quick Action Bar */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button className="app-btn app-btn-primary" onClick={onOpenAddChanda}>
          <Plus size={16} /> Record Chanda
        </button>
        <button className="app-btn app-btn-secondary" onClick={onOpenAddExpense}>
          <Receipt size={16} /> Record Expense
        </button>
      </div>

    </div>
  );
};
