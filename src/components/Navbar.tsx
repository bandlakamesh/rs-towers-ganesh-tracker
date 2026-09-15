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
        
        {/* Brand Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'var(--saffron-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            boxShadow: '0 0 12px rgba(245, 158, 11, 0.4)',
          }}>
            🪔
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.2rem', margin: 0, letterSpacing: '-0.3px' }}>
                RS Towers <span style={{ color: 'var(--gold-primary)' }}>Ganesh 2026</span>
              </h1>
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: 0 }}>
              Live Expense & Donation Tracker
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
