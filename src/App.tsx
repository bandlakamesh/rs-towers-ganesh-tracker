import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Building2, Receipt, Calendar, PieChart, Radio } from 'lucide-react';
import type { AppState, ChandaRecord, ExpenseRecord } from './types';
import {
  loadAppState,
  resetToInitialState,
  fetchLatestCloudState,
  syncToCloudRemote,
} from './utils/cloudStorage';

import { Navbar } from './components/Navbar';
import { DashboardStats } from './components/DashboardStats';
import { FlatDirectory } from './components/FlatDirectory';
import { ChandaLog } from './components/ChandaLog';
import { ExpenseLog } from './components/ExpenseLog';
import { WhatsAppShareModal } from './components/WhatsAppShareModal';
import { GitHubDeployModal } from './components/GitHubDeployModal';
import { EventTimeline } from './components/EventTimeline';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { GITHUB_PAGES_LIVE_URL } from './utils/whatsappFormatter';

export const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(() => loadAppState());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chanda' | 'expenses' | 'schedule' | 'analytics'>('dashboard');
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);

  // Modals state
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [prefillFlatPayment, setPrefillFlatPayment] = useState<{ flatNo: string; residentName: string } | null>(null);

  // Auto-fetch latest cloud data on mount & set up 10-second live polling sync
  useEffect(() => {
    let isMounted = true;

    const pullLiveCloudData = async () => {
      setIsCloudSyncing(true);
      const cloudData = await fetchLatestCloudState();
      if (isMounted && cloudData) {
        setAppState(cloudData);
      }
      setIsCloudSyncing(false);
    };

    // Initial pull
    pullLiveCloudData();

    // Poll cloud every 10 seconds for real-time multi-user updates
    const interval = setInterval(() => {
      pullLiveCloudData();
    }, 10000);

    // Cross-tab broadcast channel listener
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('rs_towers_ganesh_sync');
      channel.onmessage = (event) => {
        if (event.data?.type === 'STATE_UPDATE' && event.data.state) {
          setAppState(event.data.state);
        }
      };
    }

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleStateUpdate = (newState: AppState) => {
    setAppState(newState);
    syncToCloudRemote(newState);
  };

  const handleAddChanda = (newRecord: Omit<ChandaRecord, 'id' | 'createdAt'>) => {
    const record: ChandaRecord = {
      ...newRecord,
      id: `chanda-${Date.now()}`,
      createdAt: Date.now(),
    };

    const updatedList = [record, ...appState.chandaList];
    const newState: AppState = {
      ...appState,
      chandaList: updatedList,
      lastUpdated: Date.now(),
    };

    setAppState(newState);
    syncToCloudRemote(newState);

    // Trigger celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleDeleteChanda = (id: string) => {
    const updatedList = appState.chandaList.filter((c) => c.id !== id);
    const newState = {
      ...appState,
      chandaList: updatedList,
      lastUpdated: Date.now(),
    };
    setAppState(newState);
    syncToCloudRemote(newState);
  };

  const handleAddExpense = (newRecord: Omit<ExpenseRecord, 'id' | 'createdAt'>) => {
    const record: ExpenseRecord = {
      ...newRecord,
      id: `exp-${Date.now()}`,
      createdAt: Date.now(),
    };

    const updatedList = [record, ...appState.expenseList];
    const newState = {
      ...appState,
      expenseList: updatedList,
      lastUpdated: Date.now(),
    };

    setAppState(newState);
    syncToCloudRemote(newState);
  };

  const handleDeleteExpense = (id: string) => {
    const updatedList = appState.expenseList.filter((e) => e.id !== id);
    const newState = {
      ...appState,
      expenseList: updatedList,
      lastUpdated: Date.now(),
    };
    setAppState(newState);
    syncToCloudRemote(newState);
  };

  const handleSelectFlatPayment = (flatNo: string, residentName: string) => {
    setPrefillFlatPayment({ flatNo, residentName });
    setActiveTab('chanda');
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all data back to default sample records?')) {
      const reset = resetToInitialState();
      setAppState(reset);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navbar */}
      <Navbar
        state={appState}
        onStateUpdate={handleStateUpdate}
        onOpenWhatsAppModal={() => setIsWhatsAppModalOpen(true)}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
      />

      {/* Realtime Live Cloud Sync Pulse Indicator */}
      <div style={{ background: 'rgba(16, 185, 129, 0.12)', borderBottom: '1px solid rgba(16, 185, 129, 0.3)', padding: '6px 20px', textAlign: 'center', fontSize: '0.8rem', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <Radio size={14} style={{ animation: 'pulse 1.5s infinite' }} />
        <span>
          <strong>Live Multi-User Sync Active</strong> — Any expense or contribution entered on any phone updates live for everyone in real time!
          {isCloudSyncing && <span style={{ opacity: 0.7, marginLeft: '6px' }}>(Syncing...)</span>}
        </span>
      </div>

      {/* Main Container */}
      <main style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '20px 20px 0 20px', flex: 1 }}>
        
        {/* Navigation Tab Bar */}
        <nav className="tab-bar">
          <button
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Building2 size={18} /> Dashboard & 15 Flats
          </button>

          <button
            className={`tab-btn ${activeTab === 'chanda' ? 'active' : ''}`}
            onClick={() => setActiveTab('chanda')}
          >
            <Receipt size={18} /> Chanda Receipts ({appState.chandaList.length})
          </button>

          <button
            className={`tab-btn ${activeTab === 'expenses' ? 'active' : ''}`}
            onClick={() => setActiveTab('expenses')}
          >
            <Receipt size={18} /> Expenses Log ({appState.expenseList.length})
          </button>

          <button
            className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            <Calendar size={18} /> Pooja Schedule
          </button>

          <button
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <PieChart size={18} /> Analytics
          </button>
        </nav>

        {/* Hero KPI Summary (visible on dashboard tab) */}
        {activeTab === 'dashboard' && (
          <>
            <DashboardStats
              state={appState}
              onOpenAddChanda={() => setActiveTab('chanda')}
              onOpenAddExpense={() => setActiveTab('expenses')}
            />

            <FlatDirectory
              flats={appState.flatsList}
              onSelectFlatPayment={handleSelectFlatPayment}
            />
          </>
        )}

        {/* Chanda Log Tab */}
        {activeTab === 'chanda' && (
          <ChandaLog
            chandaList={appState.chandaList}
            onAddChanda={handleAddChanda}
            onDeleteChanda={handleDeleteChanda}
            prefillFlatNo={prefillFlatPayment?.flatNo}
            prefillResidentName={prefillFlatPayment?.residentName}
          />
        )}

        {/* Expense Log Tab */}
        {activeTab === 'expenses' && (
          <ExpenseLog
            expenseList={appState.expenseList}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        )}

        {/* Pooja Schedule Tab */}
        {activeTab === 'schedule' && (
          <EventTimeline events={appState.poojaEvents} />
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <AnalyticsCharts state={appState} />
        )}

      </main>

      {/* Footer */}
      <footer className="glass-card" style={{ borderRadius: 0, marginTop: '40px', padding: '24px 20px', borderBottom: 0, borderLeft: 0, borderRight: 0 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <div>
            🪔 <strong>R.S Towers Ganesh Utsav 2026</strong> • Live URL: <a href={GITHUB_PAGES_LIVE_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--text-gold)' }}>bandlakamesh.github.io/rs-towers-ganesh-tracker</a>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button
              onClick={handleResetData}
              style={{ background: 'none', border: 'none', color: '#F87171', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              Reset Sample Data
            </button>
            <span>Ganpati Bappa Morya! 🙏</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isWhatsAppModalOpen && (
        <WhatsAppShareModal
          state={appState}
          onClose={() => setIsWhatsAppModalOpen(false)}
        />
      )}

      {isDeployModalOpen && (
        <GitHubDeployModal
          onClose={() => setIsDeployModalOpen(false)}
        />
      )}

    </div>
  );
};

export default App;
