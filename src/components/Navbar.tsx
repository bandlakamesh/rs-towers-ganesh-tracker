import React, { useRef } from 'react';
import { Share2, Download, Upload, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { AppState, ChandaRecord, ExpenseRecord } from '../types';
import { exportAppStateJSON, importAppStateJSON, syncToCloudRemote, syncFlatsWithChanda } from '../utils/cloudStorage';

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button className="app-btn app-btn-whatsapp" onClick={onOpenWhatsAppModal} style={{ padding: '8px 14px', fontSize: '0.84rem' }}>
            <Share2 size={16} /> Share WhatsApp
          </button>

          <button className="app-btn app-btn-primary" onClick={() => excelInputRef.current?.click()} style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#FFF', padding: '8px 14px', fontSize: '0.84rem' }}>
            <FileSpreadsheet size={16} /> Excel Import
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

          <input
            type="file"
            ref={excelInputRef}
            onChange={handleExcelImport}
            accept=".xlsx, .xls, .csv"
            style={{ display: 'none' }}
          />
        </div>

      </div>
    </header>
  );
};
