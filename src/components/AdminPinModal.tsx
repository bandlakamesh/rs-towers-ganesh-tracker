import React, { useState } from 'react';
import { ShieldCheck, Lock, Unlock, X, KeyRound, Check, Crown, UserCheck, UserX } from 'lucide-react';
import type { FlatStatus } from '../types';

interface AdminPinModalProps {
  onClose: () => void;
  isAdmin: boolean;
  onAdminLoginSuccess: () => void;
  onAdminLogout: () => void;
  flatsList?: FlatStatus[];
  adminFlats?: string[];
  rootFlat?: string;
  onToggleFlatAdmin?: (flatNo: string) => void;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  onClose,
  isAdmin,
  onAdminLoginSuccess,
  onAdminLogout,
  flatsList = [],
  adminFlats = ['302'],
  rootFlat = '302',
  onToggleFlatAdmin,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [selectedFlat, setSelectedFlat] = useState<string>('302');
  const [loginMethod, setLoginMethod] = useState<'pin' | 'flat'>('flat');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Tab inside unlocked Admin Panel: 'overview' | 'manage_rights' | 'change_pin'
  const [adminTab, setAdminTab] = useState<'overview' | 'manage_rights' | 'change_pin'>('overview');
  
  // Change PIN state
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');

  const getStoredPin = (): string => {
    return localStorage.getItem('rs_towers_admin_pin') || '2026';
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (loginMethod === 'flat') {
      // Check if selected flat has admin access granted by Root
      if (adminFlats.includes(selectedFlat) || selectedFlat === rootFlat) {
        onAdminLoginSuccess();
        onClose();
        return;
      } else {
        setErrorMsg(`❌ Flat #${selectedFlat} does not have Admin rights. Please enter the Admin PIN or ask Root User (Flat 302 - Kamesh) to grant access.`);
        return;
      }
    }

    const storedPin = getStoredPin();
    if (pinInput.trim() === storedPin) {
      onAdminLoginSuccess();
      setPinInput('');
      onClose();
    } else {
      setErrorMsg('❌ Incorrect Admin PIN. Default PIN is 2026.');
    }
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const storedPin = getStoredPin();

    if (currentPinInput.trim() !== storedPin) {
      setErrorMsg('❌ Current PIN is incorrect.');
      return;
    }

    if (!newPinInput || newPinInput.trim().length < 4) {
      setErrorMsg('❌ New PIN must be at least 4 digits/characters.');
      return;
    }

    localStorage.setItem('rs_towers_admin_pin', newPinInput.trim());
    setSuccessMsg('✅ Admin PIN updated successfully!');
    setCurrentPinInput('');
    setNewPinInput('');
    setAdminTab('overview');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '580px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: isAdmin ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'linear-gradient(135deg, #0096C7 0%, #0077B6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(0, 150, 199, 0.3)',
              flexShrink: 0
            }}>
              {isAdmin ? <Unlock size={22} /> : <Lock size={22} />}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {isAdmin ? '🔓 Admin Mode Active' : '🔑 Admin Security & Role Unlock'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {isAdmin ? 'Manage flat permissions, change PIN, or lock session' : 'Root User: Flat 302 - Kamesh • Admin PIN default: 2026'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748B',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Status Alert */}
        {errorMsg && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', fontSize: '0.84rem', fontWeight: 600, marginBottom: '16px' }}>
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', fontSize: '0.84rem', fontWeight: 600, marginBottom: '16px' }}>
            {successMsg}
          </div>
        )}

        {/* State 1: Locked (Prompt PIN or Flat Selection) */}
        {!isAdmin && (
          <form onSubmit={handleLoginSubmit}>
            
            {/* Toggle Login Method */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', background: '#F1F5F9', padding: '4px', borderRadius: '10px' }}>
              <button
                type="button"
                onClick={() => setLoginMethod('flat')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  background: loginMethod === 'flat' ? '#FFFFFF' : 'transparent',
                  color: loginMethod === 'flat' ? '#1D4ED8' : '#64748B',
                  fontWeight: loginMethod === 'flat' ? 700 : 500,
                  boxShadow: loginMethod === 'flat' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                }}
              >
                🏢 Unlock by Flat Number
              </button>

              <button
                type="button"
                onClick={() => setLoginMethod('pin')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  background: loginMethod === 'pin' ? '#FFFFFF' : 'transparent',
                  color: loginMethod === 'pin' ? '#1D4ED8' : '#64748B',
                  fontWeight: loginMethod === 'pin' ? 700 : 500,
                  boxShadow: loginMethod === 'pin' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                }}
              >
                🔢 Unlock by Admin PIN
              </button>
            </div>

            {loginMethod === 'flat' ? (
              <div className="form-group">
                <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#334155', marginBottom: '8px', display: 'block' }}>
                  Select Your Flat #:
                </label>
                <select
                  className="form-control"
                  value={selectedFlat}
                  onChange={(e) => setSelectedFlat(e.target.value)}
                  style={{ fontSize: '1rem', padding: '10px' }}
                >
                  {flatsList.map((f) => {
                    const isRoot = f.flatNo === rootFlat;
                    const hasAdmin = adminFlats.includes(f.flatNo) || isRoot;

                    return (
                      <option key={f.flatNo} value={f.flatNo}>
                        Flat #{f.flatNo} - {f.residentName} {isRoot ? '👑 (Root User)' : hasAdmin ? '⭐ (Admin)' : '👤 (Resident/Tenant)'}
                      </option>
                    );
                  })}
                </select>
                <p style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '8px' }}>
                  👑 <strong>Flat #302 (Kamesh)</strong> is Root User. Root User can grant Admin access to other flat owners or revoke it.
                </p>
              </div>
            ) : (
              <div className="form-group">
                <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#334155', marginBottom: '8px', display: 'block' }}>
                  Enter Admin PIN:
                </label>
                <input
                  type="password"
                  className="form-control"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter PIN (Default: 2026)"
                  autoFocus
                  required
                  style={{ fontSize: '1.1rem', letterSpacing: '4px', textAlign: 'center', padding: '12px' }}
                />
                <p style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '6px' }}>
                  💡 Default Admin PIN: <strong>2026</strong>.
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button type="button" className="app-btn app-btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="app-btn app-btn-primary">
                <ShieldCheck size={18} /> Unlock Admin Mode
              </button>
            </div>
          </form>
        )}

        {/* State 2: Unlocked (Active Admin Session) */}
        {isAdmin && (
          <div>
            
            {/* Sub-navigation Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
              <button
                type="button"
                className={`chip ${adminTab === 'overview' ? 'active' : ''}`}
                onClick={() => setAdminTab('overview')}
                style={{ fontSize: '0.8rem' }}
              >
                <ShieldCheck size={14} /> Admin Overview
              </button>

              <button
                type="button"
                className={`chip ${adminTab === 'manage_rights' ? 'active' : ''}`}
                onClick={() => setAdminTab('manage_rights')}
                style={{ fontSize: '0.8rem', background: adminTab === 'manage_rights' ? '#FEF3C7' : undefined, color: adminTab === 'manage_rights' ? '#B45309' : undefined, borderColor: adminTab === 'manage_rights' ? '#FDE68A' : undefined }}
              >
                <Crown size={14} color="#D97706" /> Manage Flat Access
              </button>

              <button
                type="button"
                className={`chip ${adminTab === 'change_pin' ? 'active' : ''}`}
                onClick={() => setAdminTab('change_pin')}
                style={{ fontSize: '0.8rem' }}
              >
                <KeyRound size={14} /> Change PIN
              </button>
            </div>

            {/* Sub-Tab 1: Overview */}
            {adminTab === 'overview' && (
              <div>
                <div style={{ padding: '14px', borderRadius: '12px', background: '#F0F9FF', border: '1px solid #B2D8E5', marginBottom: '20px', fontSize: '0.86rem', color: '#0077B6' }}>
                  ✓ <strong>Admin Privileges Unlocked:</strong> You can record donations, log expenses with bill photos, edit schedule events, and send WhatsApp reminders.
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    type="button"
                    className="app-btn app-btn-secondary"
                    onClick={() => setAdminTab('manage_rights')}
                    style={{ width: '100%', justifyContent: 'center', background: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A' }}
                  >
                    <Crown size={16} /> 👑 Manage Admin Access for Flats (Root Control)
                  </button>

                  <button
                    type="button"
                    className="app-btn"
                    onClick={() => {
                      onAdminLogout();
                      onClose();
                    }}
                    style={{ width: '100%', justifyContent: 'center', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
                  >
                    <Lock size={16} /> Lock / Admin Logout
                  </button>
                </div>
              </div>
            )}

            {/* Sub-Tab 2: Manage Flat Permissions (Root User Controls) */}
            {adminTab === 'manage_rights' && (
              <div>
                <div style={{ padding: '12px', borderRadius: '10px', background: '#FFFBEB', border: '1px solid #FDE68A', marginBottom: '14px', fontSize: '0.82rem', color: '#92400E' }}>
                  👑 <strong>Root User Controls (Flat 302 - Kamesh):</strong> Grant or revoke Admin editing rights for each flat. Flat owners with Admin access can log payments & expenses. Tenants / normal flats receive read-only access.
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '340px', overflowY: 'auto', paddingRight: '4px' }}>
                  {flatsList.map((flat) => {
                    const isRoot = flat.flatNo === rootFlat;
                    const hasAdmin = adminFlats.includes(flat.flatNo) || isRoot;

                    return (
                      <div
                        key={flat.flatNo}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: isRoot ? '1px solid #FCD34D' : hasAdmin ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                          background: isRoot ? '#FEF3C7' : hasAdmin ? '#F0FDF4' : '#FFFFFF',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1D4ED8', background: '#EFF6FF', padding: '2px 8px', borderRadius: '6px' }}>
                            Flat #{flat.flatNo}
                          </span>
                          <div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>
                              {flat.residentName}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                              {isRoot ? '👑 Root Super Admin' : hasAdmin ? '⭐ Co-Admin (Full Edits)' : '👤 Normal Resident (Read-only)'}
                            </div>
                          </div>
                        </div>

                        <div>
                          {isRoot ? (
                            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#B45309', background: '#FDE68A', padding: '4px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Crown size={12} /> Root Owner
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onToggleFlatAdmin?.(flat.flatNo)}
                              style={{
                                padding: '5px 10px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                border: hasAdmin ? '1px solid #FECACA' : '1px solid #A7F3D0',
                                background: hasAdmin ? '#FEF2F2' : '#ECFDF5',
                                color: hasAdmin ? '#DC2626' : '#059669',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              {hasAdmin ? (
                                <>
                                  <UserX size={13} /> Revoke Admin
                                </>
                              ) : (
                                <>
                                  <UserCheck size={13} /> Grant Admin
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sub-Tab 3: Change PIN */}
            {adminTab === 'change_pin' && (
              <form onSubmit={handleChangePinSubmit}>
                <div className="form-group">
                  <label style={{ fontSize: '0.84rem', fontWeight: 600 }}>Current PIN:</label>
                  <input
                    type="password"
                    className="form-control"
                    value={currentPinInput}
                    onChange={(e) => setCurrentPinInput(e.target.value)}
                    required
                    placeholder="Enter Current PIN (Default: 2026)"
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.84rem', fontWeight: 600 }}>New Admin PIN:</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newPinInput}
                    onChange={(e) => setNewPinInput(e.target.value)}
                    required
                    placeholder="Enter New PIN (min 4 chars)"
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <button type="button" className="app-btn app-btn-secondary" onClick={() => setAdminTab('overview')}>
                    Cancel
                  </button>
                  <button type="submit" className="app-btn app-btn-primary">
                    <Check size={16} /> Save New PIN
                  </button>
                </div>
              </form>
            )}

          </div>
        )}
      </div>
    </div>
  );
};
