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

  const colors = ['#2563EB', '#DC2626', '#059669', '#7C3AED', '#DB2777', '#9333EA', '#0D9488', '#EA580C'];

  return (
    <div style={{ marginTop: '24px', marginBottom: '32px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.15rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#0F172A' }}>
          <PieChart style={{ color: '#2563EB' }} size={20} /> Expenditure Analytics & Category Breakdown
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
          Visual distribution of festival expenses across all major categories
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        
        {/* Category Breakdown Progress Bars */}
        <div className="app-card" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '16px', color: '#1D4ED8' }}>
            Spending Distribution by Category
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {categoriesData.map((item, idx) => (
              <div key={item.category}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
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

        {/* Top 5 Spending Items Card */}
        <div className="app-card" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '16px', color: '#1D4ED8' }}>
            Highest Cost Expense Items
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {state.expenseList
              .slice()
              .sort((a, b) => b.amount - a.amount)
              .slice(0, 5)
              .map((exp) => (
                <div key={exp.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0F172A' }}>{exp.description}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Paid by {exp.paidBy} on {exp.date}</div>
                  </div>
                  <div style={{ fontWeight: 800, color: '#DC2626', fontSize: '0.95rem' }}>
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
