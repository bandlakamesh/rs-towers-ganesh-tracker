import React, { useRef } from 'react';
import { Share2, Download, Upload, Globe, Sparkles } from 'lucide-react';
import type { AppState } from '../types';
import { exportAppStateJSON, importAppStateJSON } from '../utils/cloudStorage';
import { GITHUB_PAGES_LIVE_URL } from '../utils/whatsappFormatter';

interface NavbarProps {
  state: AppState;
  onStateUpdate: (newState: AppState) => void;
  onOpenWhatsAppModal: () => void;
  onOpenDeployModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  state,
  onStateUpdate,
  onOpenWhatsAppModal,
  onOpenDeployModal,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportAppStateJSON(state);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imported = await importAppStateJSON(file);
        onStateUpdate(imported);
        alert('✅ Backup restored successfully!');
      } catch (err: any) {
        alert('❌ Error restoring backup: ' + err.message);
      }
    }
  };

  return (
    <header className="glass-card" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, marginBottom: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #F59E0B 0%, #FF6B00 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            boxShadow: '0 0 15px rgba(245, 158, 11, 0.5)',
          }}>
            🪔
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.35rem', letterSpacing: '-0.3px', margin: 0 }}>
                R.S Towers <span style={{ color: 'var(--primary-gold)' }}>Ganesh Utsav 2026</span>
              </h1>
              <span className="badge badge-received" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                <Sparkles size={10} /> Live 24/7
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              Transparent Expense & Chanda Tracker • 15 Flats
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn btn-whatsapp" onClick={onOpenWhatsAppModal}>
            <Share2 size={18} /> Share on WhatsApp
          </button>

          <button className="btn btn-primary" onClick={onOpenDeployModal} style={{ background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', color: '#FFF' }}>
            <Globe size={18} /> Deploy to GitHub
          </button>

          <button className="btn btn-secondary" onClick={handleExport} title="Download JSON Backup">
            <Download size={16} /> Export
          </button>

          <button className="btn btn-secondary" onClick={() => fileInputRef.current?.click()} title="Restore JSON Backup">
            <Upload size={16} /> Import
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            style={{ display: 'none' }}
          />
        </div>

      </div>

      {/* Live GitHub URL Bar */}
      <div style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '6px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.78rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        🌍 <strong>Live Public URL</strong>: <a href={GITHUB_PAGES_LIVE_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--text-gold)', textDecoration: 'underline' }}>{GITHUB_PAGES_LIVE_URL}</a> (Share in WhatsApp group)
      </div>
    </header>
  );
};
