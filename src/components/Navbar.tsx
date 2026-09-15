import React, { useRef } from 'react';
import { Share2, Download, Upload, Printer } from 'lucide-react';
import type { AppState } from '../types';
import { exportAppStateJSON, importAppStateJSON } from '../utils/cloudStorage';

interface NavbarProps {
  state: AppState;
  onStateUpdate: (newState: AppState) => void;
  onOpenWhatsAppModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  state,
  onStateUpdate,
  onOpenWhatsAppModal,
}) => {
  const jsonInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportAppStateJSON(state);
  };

  const handleJSONFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imported = await importAppStateJSON(file);
        onStateUpdate(imported);
      } catch (err: any) {
        console.error('Error restoring backup:', err);
      }
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <header className="app-card" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, marginBottom: 0, padding: '14px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        
        {/* Brand Title with Ganapathi Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            position: 'relative',
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
            border: '2px solid #FDBA74',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
            overflow: 'hidden',
          }}>
            <img
              src="./ganesha_badge.png"
              alt="Lord Ganesha"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                // Fallback emoji if image loading issue occurs
                e.currentTarget.style.display = 'none';
              }}
            />
            <span style={{ fontSize: '24px', display: 'none' }}>🪔</span>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.25rem', margin: 0, letterSpacing: '-0.3px', fontWeight: 800 }}>
                RS Towers <span style={{ color: 'var(--gold-primary)', background: 'linear-gradient(135deg, #D97706 0%, #EA580C 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ganesh 2026</span>
              </h1>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '12px',
                background: '#ECFDF5',
                color: '#047857',
                border: '1px solid #A7F3D0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span> Live 24/7
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, fontWeight: 500 }}>
              Live Expense & Donation Tracker • RS Towers Apartment
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button className="app-btn app-btn-whatsapp" onClick={onOpenWhatsAppModal} style={{ padding: '8px 14px', fontSize: '0.84rem' }}>
            <Share2 size={16} /> Share WhatsApp
          </button>

          <button className="app-btn app-btn-primary" onClick={handlePrintPDF} style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#FFF', padding: '8px 14px', fontSize: '0.84rem' }}>
            <Printer size={16} /> Print / Download PDF
          </button>

          <button className="app-btn app-btn-secondary" onClick={handleExport} style={{ padding: '8px 12px', fontSize: '0.84rem' }} title="Download JSON Backup">
            <Download size={16} />
          </button>

          <button className="app-btn app-btn-secondary" onClick={() => jsonInputRef.current?.click()} style={{ padding: '8px 12px', fontSize: '0.84rem' }} title="Restore JSON Backup">
            <Upload size={16} />
          </button>

          {/* Hidden File Inputs */}
          <input
            type="file"
            ref={jsonInputRef}
            onChange={handleJSONFileChange}
            accept=".json"
            style={{ display: 'none' }}
          />
        </div>

      </div>
    </header>
  );
};
