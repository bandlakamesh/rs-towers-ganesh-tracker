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
      <div className="modal-container" style={{ maxWidth: '620px' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
              <Share2 size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem' }}>📢 WhatsApp Group Live Update</h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Share real-time financial stats in your RS Towers WhatsApp group
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Live WhatsApp Markdown Message Preview Box */}
        <div className="form-group">
          <label>Message Preview (Auto-generated with live numbers & GitHub Pages URL):</label>
          <textarea
            className="form-control"
            value={messageText}
            readOnly
            rows={12}
            style={{
              fontFamily: 'monospace',
              fontSize: '0.88rem',
              background: '#0B141A',
              borderColor: '#25D366',
              color: '#E9EDEF',
              lineHeight: 1.5,
              resize: 'none',
              padding: '14px',
              borderRadius: '10px',
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button className="btn btn-secondary" onClick={handleCopy}>
            {copied ? <Check size={16} color="#34D399" /> : <Copy size={16} />}
            {copied ? 'Copied to Clipboard!' : 'Copy Text'}
          </button>

          <button className="btn btn-whatsapp" onClick={handleShare}>
            <Share2 size={18} /> Open WhatsApp App
          </button>
        </div>

      </div>
    </div>
  );
};
