import React, { useState } from 'react';
import { Globe, Check, Copy, ExternalLink, Terminal, X } from 'lucide-react';
import { GITHUB_PAGES_LIVE_URL } from '../utils/whatsappFormatter';

interface GitHubDeployModalProps {
  onClose: () => void;
}

export const GitHubDeployModal: React.FC<GitHubDeployModalProps> = ({ onClose }) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyCommand = (cmd: string, key: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(key);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const deployCmd = `npm run build && npx gh-pages -d dist`;
  const manualGitCmd = `npm run build
git add .
git commit -m "Deploy Ganesh Utsav Live Tracker App"
git push origin main`;

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '640px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
              <Globe size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem' }}>🚀 GitHub Pages Deployment Guide</h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Target: <a href={GITHUB_PAGES_LIVE_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--text-gold)' }}>{GITHUB_PAGES_LIVE_URL}</a>
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Method 1: Automatic 1-Command Deploy */}
        <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
          <h4 style={{ color: '#A5B4FC', margin: '0 0 8px 0', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Terminal size={16} /> Option 1: Automatic 1-Command Publish (Recommended)
          </h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
            Run this in your terminal at <code style={{ color: '#FFF' }}>C:\projects\rs-towers</code> to compile & publish directly to GitHub Pages:
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#090D16', padding: '10px 14px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.85rem' }}>
            <code>{deployCmd}</code>
            <button
              className="btn btn-secondary"
              onClick={() => copyCommand(deployCmd, 'cmd1')}
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            >
              {copiedCmd === 'cmd1' ? <Check size={14} color="#34D399" /> : <Copy size={14} />}
              {copiedCmd === 'cmd1' ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Method 2: Manual Git Commit */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
          <h4 style={{ color: 'var(--text-gold)', margin: '0 0 8px 0', fontSize: '0.95rem' }}>
            Option 2: Standard Git Commit & Push
          </h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
            Or push to your GitHub repository directly:
          </p>

          <div style={{ position: 'relative', background: '#090D16', padding: '12px 14px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.82rem', color: '#E2E8F0', whiteSpace: 'pre-wrap' }}>
            {manualGitCmd}
            <button
              className="btn btn-secondary"
              onClick={() => copyCommand(manualGitCmd, 'cmd2')}
              style={{ position: 'absolute', right: '10px', top: '10px', padding: '4px 10px', fontSize: '0.75rem' }}
            >
              {copiedCmd === 'cmd2' ? <Check size={14} color="#34D399" /> : <Copy size={14} />}
              {copiedCmd === 'cmd2' ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Live URL Link */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <a
            href={GITHUB_PAGES_LIVE_URL}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
            style={{ display: 'inline-flex', gap: '8px' }}
          >
            <ExternalLink size={16} /> Open Your Live GitHub Site
          </a>
        </div>

      </div>
    </div>
  );
};
