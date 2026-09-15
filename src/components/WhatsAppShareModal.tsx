import React, { useState } from 'react';
import { Share2, Copy, Check, X } from 'lucide-react';
import type { AppState } from '../types';
import { generateWhatsAppBroadcastText, openWhatsAppShareLink } from '../utils/whatsappFormatter';

interface WhatsAppShareModalProps {
  state: AppState;
  onClose: () => void;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  state,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const messageText = generateWhatsAppBroadcastText(state);

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = () => {
    openWhatsAppShareLink(messageText);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '620px', padding: '24px' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)',
              flexShrink: 0
            }}>
              <Share2 size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>
                📢 WhatsApp Group Live Update
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Share real-time financial stats in your RS Towers WhatsApp group
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748B',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Live WhatsApp Markdown Message Preview Box */}
        <div className="form-group">
          <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#334155', marginBottom: '8px', display: 'block' }}>
            Message Preview (Auto-generated with live numbers & GitHub Pages URL):
          </label>
          <textarea
            className="form-control"
            value={messageText}
            readOnly
            rows={11}
            style={{
              fontFamily: 'Consolas, SFMono-Regular, Monaco, monospace',
              fontSize: '0.86rem',
              background: '#0B141A',
              border: '1px solid #1F2C34',
              color: '#E9EDEF',
              lineHeight: 1.55,
              resize: 'none',
              padding: '16px',
              borderRadius: '12px',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.3)'
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '22px', flexWrap: 'wrap' }}>
          <button className="app-btn app-btn-secondary" onClick={handleCopy} style={{ padding: '12px 20px' }}>
            {copied ? <Check size={18} color="#059669" /> : <Copy size={18} />}
            {copied ? 'Copied to Clipboard!' : 'Copy Text'}
          </button>

          <button className="app-btn app-btn-whatsapp" onClick={handleShare} style={{ padding: '12px 22px' }}>
            <Share2 size={18} /> Open WhatsApp App
          </button>
        </div>

      </div>
    </div>
  );
};
