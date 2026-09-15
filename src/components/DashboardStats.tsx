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

        {/* Card 3: Cash in Hand */}
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
