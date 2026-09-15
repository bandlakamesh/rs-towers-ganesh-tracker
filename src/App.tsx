import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Building2, Receipt, Calendar, PieChart, Radio, Plus, Share2 } from 'lucide-react';
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

    pullLiveCloudData();

    const interval = setInterval(() => {
      pullLiveCloudData();
    }, 10000);

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

      {/* Realtime Live Cloud Sync Indicator */}
      <div style={{ background: 'rgba(16, 185, 129, 0.1)', borderBottom: '1px solid rgba(16, 185, 129, 0.2)', padding: '6px 16px', textAlign: 'center', fontSize: '0.78rem', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
        <Radio size={13} style={{ animation: 'pulse 1.5s infinite' }} />
        <span>
          <strong>Live Multi-User Cloud Sync Active</strong>
          {isCloudSyncing && <span style={{ opacity: 0.7, marginLeft: '6px' }}>(Syncing...)</span>}
        </span>
      </div>

      {/* Main App Container */}
      <main style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '16px 16px 0 16px', flex: 1 }}>
        
        {/* Desktop Navigation Tabs */}
        <nav className="chip-group" style={{ marginBottom: '20px' }}>
          <button
            className={`chip ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Building2 size={15} /> Overview & 15 Flats
          </button>

          <button
            className={`chip ${activeTab === 'chanda' ? 'active' : ''}`}
            onClick={() => setActiveTab('chanda')}
          >
            <Receipt size={15} /> Donations ({appState.chandaList.length})
          </button>

          <button
            className={`chip ${activeTab === 'expenses' ? 'active' : ''}`}
            onClick={() => setActiveTab('expenses')}
          >
            <Receipt size={15} /> Expenses ({appState.expenseList.length})
          </button>

          <button
            className={`chip ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            <Calendar size={15} /> Pooja Schedule
          </button>

          <button
            className={`chip ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <PieChart size={15} /> Analytics
          </button>
        </nav>

        {/* Dashboard Tab */}
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

        {/* Chanda Tab */}
        {activeTab === 'chanda' && (
          <ChandaLog
            chandaList={appState.chandaList}
            onAddChanda={handleAddChanda}
            onDeleteChanda={handleDeleteChanda}
            prefillFlatNo={prefillFlatPayment?.flatNo}
            prefillResidentName={prefillFlatPayment?.residentName}
          />
        )}

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <ExpenseLog
            expenseList={appState.expenseList}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <EventTimeline events={appState.poojaEvents} />
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <AnalyticsCharts state={appState} />
        )}

      </main>

      {/* Floating Action Button (FAB) for Mobile */}
      <button
        className="fab-btn"
        onClick={() => setActiveTab(activeTab === 'expenses' ? 'expenses' : 'chanda')}
        title="Add Entry"
      >
        <Plus size={28} />
      </button>

      {/* Mobile Bottom Navigation Bar */}
      <div className="bottom-nav">
        <button
          className={`bottom-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <Building2 size={20} />
          <span>Overview</span>
        </button>

        <button
          className={`bottom-nav-item ${activeTab === 'chanda' ? 'active' : ''}`}
          onClick={() => setActiveTab('chanda')}
        >
          <Receipt size={20} />
          <span>Donations</span>
        </button>

        <button
          className={`bottom-nav-item ${activeTab === 'expenses' ? 'active' : ''}`}
          onClick={() => setActiveTab('expenses')}
        >
          <Receipt size={20} />
          <span>Expenses</span>
        </button>

        <button
          className={`bottom-nav-item ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          <Calendar size={20} />
          <span>Schedule</span>
        </button>

        <button
          className="bottom-nav-item"
          onClick={() => setIsWhatsAppModalOpen(true)}
          style={{ color: '#25D366' }}
        >
          <Share2 size={20} />
          <span>Share</span>
        </button>
      </div>

      {/* Footer */}
      <footer style={{ marginTop: '40px', padding: '24px 20px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            🪔 <strong>R.S Towers Ganesh Utsav 2026</strong> • <a href={GITHUB_PAGES_LIVE_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--text-gold)' }}>bandlakamesh.github.io/rs-towers-ganesh-tracker</a>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button
              onClick={handleResetData}
              style={{ background: 'none', border: 'none', color: '#F87171', cursor: 'pointer', fontSize: '0.78rem' }}
            >
              Reset Data
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
