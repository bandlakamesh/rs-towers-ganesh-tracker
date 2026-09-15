import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Building2, PlusCircle, Receipt } from 'lucide-react';
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
  const targetBudget = state.totalTarget || 37500;
  const progressPercent = Math.min(Math.round((totalCollected / targetBudget) * 100), 100);

  return (
    <div style={{ marginBottom: '28px' }}>
      
      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        
        {/* Card 1: Total Collected */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Collected (Chanda)</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34D399' }}>
            ₹{totalCollected.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            From {state.chandaList.length} total receipts
          </div>
        </div>

        {/* Card 2: Total Spent */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Expenses Paid</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', color: '#F87171' }}>
              <TrendingDown size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F87171' }}>
            ₹{totalSpent.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Across {state.expenseList.length} expense items
          </div>
        </div>

        {/* Card 3: Net Balance */}
        <div className="glass-card" style={{ padding: '20px', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Net Cash in Hand</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#FCD34D' }}>
              <Wallet size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-gold)' }}>
            ₹{netBalance.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Available balance for upcoming events
          </div>
        </div>

        {/* Card 4: Contributing Flats */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Contributing Flats</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', color: '#A5B4FC' }}>
              <Building2 size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#A5B4FC' }}>
            {paidFlatsCount} / {totalFlats} <span style={{ fontSize: '1rem', fontWeight: 600 }}>Flats</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {Math.round((paidFlatsCount / totalFlats) * 100)}% flat participation rate
          </div>
        </div>

      </div>

      {/* Budget Target & Quick Actions Banner */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
        
        {/* Progress Bar Section */}
        <div style={{ flex: '1 1 300px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
            <span>Collection Target Progress</span>
            <span style={{ color: 'var(--text-gold)' }}>₹{totalCollected.toLocaleString('en-IN')} / ₹{targetBudget.toLocaleString('en-IN')} ({progressPercent}%)</span>
          </div>
          <div style={{ width: '100%', height: '10px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #F59E0B 0%, #10B981 100%)',
              borderRadius: '6px',
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>

        {/* Quick Add Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary" onClick={onOpenAddChanda}>
            <PlusCircle size={18} /> Record Chanda
          </button>
          <button className="btn btn-secondary" onClick={onOpenAddExpense}>
            <Receipt size={18} /> Record Expense
          </button>
        </div>

      </div>

    </div>
  );
};
