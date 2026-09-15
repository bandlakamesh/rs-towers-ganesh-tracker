import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Plus, Receipt } from 'lucide-react';
import type { AppState } from '../types';

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

  const totalFlats = state.flatsList.length;
  const paidFlatsCount = state.flatsList.filter((f) => f.status === 'Received').length;
  const targetBudget = state.totalTarget || 45000;
  const progressPercent = Math.min(Math.round((totalCollected / targetBudget) * 100), 100);

  return (
    <div style={{ marginBottom: '24px' }}>
      
      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '16px' }}>
        
        {/* Card 1: Collected */}
        <div className="app-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Collected</span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#34D399' }}>
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
            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', color: '#F87171' }}>
              <TrendingDown size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F87171' }}>
            ₹{totalSpent.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {state.expenseList.length} expenses logged
          </div>
        </div>

        {/* Card 3: Balance */}
        <div className="app-card" style={{ padding: '18px', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Cash in Hand</span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', color: '#FCD34D' }}>
              <Wallet size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-gold)' }}>
            ₹{netBalance.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Net remaining balance
          </div>
        </div>

      </div>

      {/* Progress & Quick Add Bar */}
      <div className="app-card" style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        
        <div style={{ flex: '1 1 260px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
            <span>Flats Participation ({paidFlatsCount}/{totalFlats} Paid)</span>
            <span style={{ color: 'var(--text-gold)' }}>{progressPercent}% Target</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #F59E0B 0%, #10B981 100%)',
              borderRadius: '6px',
            }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="app-btn app-btn-primary" onClick={onOpenAddChanda}>
            <Plus size={16} /> Add Payment
          </button>
          <button className="app-btn app-btn-secondary" onClick={onOpenAddExpense}>
            <Receipt size={16} /> Add Expense
          </button>
        </div>

      </div>

    </div>
  );
};
