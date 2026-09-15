import React, { useRef } from 'react';
import { Share2, Download, Upload, Globe, Sparkles, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { AppState, ChandaRecord, ExpenseRecord } from '../types';
import { exportAppStateJSON, importAppStateJSON, syncToCloudRemote, syncFlatsWithChanda } from '../utils/cloudStorage';
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
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const excelInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportAppStateJSON(state);
  };

  const handleJSONFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        
        let newChandaList: ChandaRecord[] = [...state.chandaList];
        let newExpenseList: ExpenseRecord[] = [...state.expenseList];

        wb.SheetNames.forEach((sheetName) => {
          const sheet = wb.Sheets[sheetName];
          const rows: any[] = XLSX.utils.sheet_to_json(sheet);

          rows.forEach((row, idx) => {
            // Check if row is a Chanda / Contribution entry
            const flat = row['Flat'] || row['Flat No'] || row['FlatNo'] || row['Unit'];
            const resident = row['Resident'] || row['Resident Name'] || row['Name'] || row['Owner'];
            const chandaAmount = row['Amount'] || row['Chanda'] || row['Contribution'] || row['Paid'];
            
            if (flat && resident && chandaAmount) {
              newChandaList.push({
                id: `chanda-excel-${Date.now()}-${idx}`,
                flatNo: String(flat),
                residentName: String(resident),
                amount: Number(chandaAmount),
                date: row['Date'] || new Date().toISOString().split('T')[0],
                paymentMode: row['Mode'] || row['Payment Mode'] || 'UPI',
                status: 'Received',
                receiptNo: row['Receipt'] || `RSG-EXCEL-${idx + 1}`,
                notes: row['Notes'] || 'Imported from Excel',
                createdAt: Date.now() + idx,
              });
            }

            // Check if row is an Expense entry
            const expDesc = row['Description'] || row['Expense'] || row['Item'];
            const expAmount = row['Expense Amount'] || row['Cost'] || (row['Amount'] && !flat ? row['Amount'] : null);
            if (expDesc && expAmount) {
              newExpenseList.push({
                id: `exp-excel-${Date.now()}-${idx}`,
                category: row['Category'] || 'Miscellaneous',
                description: String(expDesc),
                amount: Number(expAmount),
                paidBy: row['Paid By'] || row['PaidBy'] || 'Committee',
                date: row['Date'] || new Date().toISOString().split('T')[0],
                paymentMode: row['Mode'] || 'UPI',
                createdAt: Date.now() + idx,
              });
            }
          });
        });

        const newState: AppState = syncFlatsWithChanda({
          ...state,
          chandaList: newChandaList,
          expenseList: newExpenseList,
          lastUpdated: Date.now(),
        });

        onStateUpdate(newState);
        syncToCloudRemote(newState);
        alert(`✅ Excel Imported Successfully! Processed records from ${wb.SheetNames.length} sheet(s).`);

      } catch (err: any) {
        alert('❌ Error reading Excel file: ' + err.message);
      }
    };
    reader.readAsBinaryString(file);
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

          <button className="btn btn-primary" onClick={() => excelInputRef.current?.click()} style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#FFF' }}>
            <FileSpreadsheet size={18} /> Import Excel / CSV
          </button>

          <button className="btn btn-secondary" onClick={onOpenDeployModal} style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
            <Globe size={16} /> Deploy
          </button>

          <button className="btn btn-secondary" onClick={handleExport} title="Download JSON Backup">
            <Download size={16} /> Export
          </button>

          <button className="btn btn-secondary" onClick={() => jsonInputRef.current?.click()} title="Restore JSON Backup">
            <Upload size={16} /> Import JSON
          </button>

          {/* Hidden File Inputs */}
          <input
            type="file"
            ref={jsonInputRef}
            onChange={handleJSONFileChange}
            accept=".json"
            style={{ display: 'none' }}
          />

          <input
            type="file"
            ref={excelInputRef}
            onChange={handleExcelImport}
            accept=".xlsx, .xls, .csv"
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
