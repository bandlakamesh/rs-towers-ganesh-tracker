import React from 'react';
import { PieChart, TrendingUp, Tag, Award } from 'lucide-react';
import type { AppState, ExpenseCategory } from '../types';

interface AnalyticsChartsProps {
  state: AppState;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ state }) => {
  const totalSpent = state.expenseList.reduce((acc, e) => acc + e.amount, 0);

  // Group by category
  const categoryMap: Record<string, number> = {};
  state.expenseList.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });

  const categoriesData = Object.entries(categoryMap)
    .map(([cat, amount]) => ({
      category: cat as ExpenseCategory,
      amount,
      percentage: totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const topCategory = categoriesData[0]?.category || 'N/A';
  const colors = ['#2563EB', '#DC2626', '#059669', '#7C3AED', '#DB2777', '#9333EA', '#0D9488', '#EA580C', '#D97706'];

  return (
    <div style={{ marginTop: '24px', marginBottom: '32px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.15rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#0F172A' }}>
          <PieChart style={{ color: '#2563EB' }} size={20} /> Expenditure Analytics & Category Distribution
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
          Visual breakdown of festival expenses across all operational categories
        </p>
      </div>

      <div className="app-card" style={{ padding: '24px' }}>
        {/* Quick Insights Sub-Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
            <Tag size={16} color="#2563EB" />
            <span>Active Categories: <strong>{categoriesData.length}</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
            <Award size={16} color="#DC2626" />
            <span>Highest Category: <strong>{topCategory}</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
            <TrendingUp size={16} color="#059669" />
            <span>Total Operational Expenses: <strong>₹{totalSpent.toLocaleString('en-IN')}</strong></span>
          </div>
        </div>

        {/* Category Progress Bars Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {categoriesData.map((item, idx) => (
            <div key={item.category} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '14px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}>
                <span style={{ color: '#0F172A' }}>{item.category}</span>
                <span style={{ color: colors[idx % colors.length] }}>
                  ₹{item.amount.toLocaleString('en-IN')} ({item.percentage}%)
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${item.percentage}%`,
                    background: colors[idx % colors.length],
                    borderRadius: '4px',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
          ))}

          {categoriesData.length === 0 && (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
              No expense data recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
