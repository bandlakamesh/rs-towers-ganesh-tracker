import React, { useState } from 'react';
import { CheckCircle2, RefreshCw, X, Server } from 'lucide-react';
import { getFirebaseDbUrl, setFirebaseDbUrl, fetchLatestCloudState } from '../utils/cloudStorage';
import type { AppState } from '../types';

interface FirebaseConfigModalProps {
  onClose: () => void;
  onStateSynced: (state: AppState) => void;
}

export const FirebaseConfigModal: React.FC<FirebaseConfigModalProps> = ({ onClose, onStateSynced }) => {
  const [dbUrl, setDbUrl] = useState(() => getFirebaseDbUrl());
  const [statusMsg, setStatusMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    setStatusMsg('');
    try {
      setFirebaseDbUrl(dbUrl);
      const synced = await fetchLatestCloudState();
      if (synced) {
        onStateSynced(synced);
        setStatusMsg('✅ Successfully connected & synced live state from Firebase DB!');
      } else {
        setStatusMsg('✅ Firebase Realtime DB URL saved! Ready for live multi-user sync.');
      }
    } catch (err: any) {
      setStatusMsg(`❌ Connection warning: ${err.message || 'Check database URL'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetDefault = async () => {
    setIsLoading(true);
    setFirebaseDbUrl('');
    const defaultUrl = getFirebaseDbUrl();
    setDbUrl(defaultUrl);
    try {
      const synced = await fetchLatestCloudState();
      if (synced) {
        onStateSynced(synced);
      }
      setStatusMsg('Reset to default Firebase Realtime DB URL.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px', width: '90%' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Server size={22} style={{ color: 'var(--brand-primary)' }} />
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Firebase Realtime DB Sync</h2>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: 0, lineHeight: 1.5 }}>
          Firebase Realtime Database connects all mobile & desktop devices instantly. Whenever anyone adds or edits an expense on their phone, it syncs across all devices within 1 second.
        </p>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px' }}>
            Firebase Database REST Endpoint URL:
          </label>
          <input
            type="text"
            className="app-input"
            value={dbUrl}
            onChange={(e) => setDbUrl(e.target.value)}
            placeholder="https://your-project-id.firebaseio.com/state.json"
            style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.82rem' }}
          />
        </div>

        {statusMsg && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.84rem',
              marginBottom: '16px',
              background: statusMsg.includes('❌') ? '#FEF2F2' : '#F0FDF4',
              color: statusMsg.includes('❌') ? '#991B1B' : '#166534',
              border: `1px solid ${statusMsg.includes('❌') ? '#FCA5A5' : '#86EFAC'}`,
            }}
          >
            {statusMsg}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button
            className="app-btn app-btn-secondary"
            onClick={handleResetDefault}
            disabled={isLoading}
            style={{ fontSize: '0.84rem' }}
          >
            <RefreshCw size={15} /> Reset Default
          </button>

          <button
            className="app-btn app-btn-primary"
            onClick={handleSave}
            disabled={isLoading}
            style={{ fontSize: '0.84rem' }}
          >
            {isLoading ? <RefreshCw size={15} className="spin" /> : <CheckCircle2 size={15} />} Save & Sync Now
          </button>
        </div>
      </div>
    </div>
  );
};
