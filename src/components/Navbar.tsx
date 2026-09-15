import React, { useRef } from 'react';
import { Share2, Download, Upload, Printer } from 'lucide-react';
import type { AppState } from '../types';
import { exportAppStateJSON, importAppStateJSON } from '../utils/cloudStorage';
import ganeshaBadge from '../assets/ganesha_badge.png';

interface NavbarProps {
  state: AppState;
  onStateUpdate: (newState: AppState) => void;
  onOpenWhatsAppModal: () => void;
  onGoHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  state,
  onStateUpdate,
  onOpenWhatsAppModal,
  onGoHome,
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
    <header className="navbar-container" style={{
      background: 'linear-gradient(135deg, #0E5A73 0%, #137A9A 50%, #189AB4 100%)',
      borderBottom: '2px solid #48CAE4',
      boxShadow: '0 4px 20px rgba(14, 90, 115, 0.25)',
      marginBottom: 0,
      padding: '12px 20px',
      position: 'sticky',
      top: 0,
      zIndex: 900,
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        
        {/* Brand Title with Ganapathi Badge (Clickable to Go Home) */}
        <div
          onClick={onGoHome}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: onGoHome ? 'pointer' : 'default', userSelect: 'none' }}
          title="Go to Dashboard Home"
        >
          <div className="brand-logo-badge" style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
            border: '2px solid #FDBA74',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)',
            overflow: 'hidden',
            flexShrink: 0,
            transition: 'transform 0.2s ease',
          }}>
            <img
              src={ganeshaBadge}
              alt="Lord Ganesha"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h1 className="brand-title-text" style={{ fontSize: '1.25rem', margin: 0, letterSpacing: '-0.3px', fontWeight: 800, color: '#FFFFFF' }}>
                RS Towers <span style={{ color: '#FFD166', background: 'linear-gradient(135deg, #FFE399 0%, #FFD166 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 2px 8px rgba(255, 209, 102, 0.4))' }}>Ganesh 2026</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="no-print header-actions-row" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="app-btn app-btn-whatsapp nav-btn-compact" onClick={onOpenWhatsAppModal} style={{ padding: '8px 14px', fontSize: '0.84rem' }}>
            <Share2 size={16} /> <span className="btn-label-desktop">Share WhatsApp</span>
          </button>

          <button className="app-btn nav-btn-compact" onClick={handlePrintPDF} style={{ background: 'linear-gradient(135deg, #00B4D8 0%, #0096C7 100%)', color: '#FFF', padding: '8px 14px', fontSize: '0.84rem', boxShadow: '0 4px 14px rgba(0, 180, 216, 0.3)' }}>
            <Printer size={16} /> <span className="btn-label-desktop">Print / Download PDF</span>
          </button>

          <button className="app-btn nav-btn-compact" onClick={handleExport} style={{ padding: '8px 12px', fontSize: '0.84rem', background: 'rgba(255, 255, 255, 0.12)', border: '1px solid rgba(255, 255, 255, 0.25)', color: '#E0F2FE' }} title="Download JSON Backup">
            <Download size={16} />
          </button>

          <button className="app-btn nav-btn-compact" onClick={() => jsonInputRef.current?.click()} style={{ padding: '8px 12px', fontSize: '0.84rem', background: 'rgba(255, 255, 255, 0.12)', border: '1px solid rgba(255, 255, 255, 0.25)', color: '#E0F2FE' }} title="Restore JSON Backup">
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
