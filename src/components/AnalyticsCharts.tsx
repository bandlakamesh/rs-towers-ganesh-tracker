import React from 'react';
import { PieChart } from 'lucide-react';
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

  const colors = ['#F59E0B', '#EF4444', '#10B981', '#6366F1', '#EC4899', '#8B5CF6', '#14B8A6', '#F97316'];

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PieChart style={{ color: 'var(--primary-gold)' }} /> Expenditure Analytics & Breakdown
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
          Visual distribution of festival expenses across all major categories
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Category Breakdown Progress Bars */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '16px', color: 'var(--text-gold)' }}>
            Spending Distribution by Category
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {categoriesData.map((item, idx) => (
              <div key={item.category}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                  <span>{item.category}</span>
                  <span style={{ color: colors[idx % colors.length] }}>
                    ₹{item.amount.toLocaleString('en-IN')} ({item.percentage}%)
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
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
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
                No expense data recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Top 5 Spending Items Card */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '16px', color: 'var(--text-gold)' }}>
            Highest Cost Expense Items
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {state.expenseList
              .slice()
              .sort((a, b) => b.amount - a.amount)
              .slice(0, 5)
              .map((exp) => (
                <div key={exp.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{exp.description}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Paid by {exp.paidBy} on {exp.date}</div>
                  </div>
                  <div style={{ fontWeight: 800, color: '#F87171', fontSize: '0.95rem' }}>
                    ₹{exp.amount.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
};
