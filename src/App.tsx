import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Building2, Wallet, CreditCard, Calendar, PieChart, Plus, Share2 } from 'lucide-react';
import type { AppState, ChandaRecord, ExpenseRecord, PoojaEvent } from './types';
import {
  loadAppState,
  fetchLatestCloudState,
  syncToCloudRemote,
} from './utils/cloudStorage';

import { Navbar } from './components/Navbar';
import { DashboardStats } from './components/DashboardStats';
import { ChandaLog } from './components/ChandaLog';
import { ExpenseLog } from './components/ExpenseLog';
import { WhatsAppShareModal } from './components/WhatsAppShareModal';
import { EventTimeline } from './components/EventTimeline';
import { AnalyticsCharts } from './components/AnalyticsCharts';

export const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(() => loadAppState());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chanda' | 'expenses' | 'schedule'>('dashboard');

  // Modals state
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [expenseModalTrigger, setExpenseModalTrigger] = useState(0);

  // Auto-fetch latest cloud data on mount & set up 10-second live polling sync
  useEffect(() => {
    let isMounted = true;

    const pullLiveCloudData = async () => {
      const cloudData = await fetchLatestCloudState();
      if (isMounted && cloudData) {
        setAppState(cloudData);
      }
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

  const handleEditChanda = (updatedRecord: ChandaRecord) => {
    const updatedList = appState.chandaList.map((c) => (c.id === updatedRecord.id ? updatedRecord : c));
    const newState: AppState = {
      ...appState,
      chandaList: updatedList,
      lastUpdated: Date.now(),
    };
    setAppState(newState);
    syncToCloudRemote(newState);
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

  const handleEditExpense = (updatedRecord: ExpenseRecord) => {
    const updatedList = appState.expenseList.map((e) => (e.id === updatedRecord.id ? updatedRecord : e));
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

  const handleAddEvent = (newEvent: Omit<PoojaEvent, 'id'>) => {
    const record: PoojaEvent = {
      ...newEvent,
      id: `evt-${Date.now()}`,
    };
    const updatedList = [...appState.poojaEvents, record];
    const newState = {
      ...appState,
      poojaEvents: updatedList,
      lastUpdated: Date.now(),
    };
    setAppState(newState);
    syncToCloudRemote(newState);
  };

  const handleEditEvent = (updatedRecord: PoojaEvent) => {
    const updatedList = appState.poojaEvents.map((evt) => (evt.id === updatedRecord.id ? updatedRecord : evt));
    const newState = {
      ...appState,
      poojaEvents: updatedList,
      lastUpdated: Date.now(),
    };
    setAppState(newState);
    syncToCloudRemote(newState);
  };

  const handleDeleteEvent = (id: string) => {
    const updatedList = appState.poojaEvents.filter((evt) => evt.id !== id);
    const newState = {
      ...appState,
      poojaEvents: updatedList,
      lastUpdated: Date.now(),
    };
    setAppState(newState);
    syncToCloudRemote(newState);
  };

  const handleFABClick = () => {
    setActiveTab('expenses');
    setExpenseModalTrigger((prev) => prev + 1);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navbar */}
      <Navbar
        state={appState}
        onStateUpdate={handleStateUpdate}
        onOpenWhatsAppModal={() => setIsWhatsAppModalOpen(true)}
        onGoHome={() => setActiveTab('dashboard')}
      />

      {/* Main App Container */}
      <main style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '16px 16px 0 16px', flex: 1 }}>
        
        {/* Desktop Navigation Tabs */}
        <nav className="chip-group" style={{ marginBottom: '20px' }}>
          <button
            className={`chip ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <PieChart size={15} /> Dashboard
          </button>

          <button
            className={`chip ${activeTab === 'chanda' ? 'active' : ''}`}
            onClick={() => setActiveTab('chanda')}
          >
            <Wallet size={15} /> Donations ({appState.chandaList.length})
          </button>

          <button
            className={`chip ${activeTab === 'expenses' ? 'active' : ''}`}
            onClick={() => setActiveTab('expenses')}
          >
            <CreditCard size={15} /> Expenses ({appState.expenseList.length})
          </button>

          <button
            className={`chip ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            <Calendar size={15} /> Pooja Schedule
          </button>
        </nav>

        {/* Dashboard Tab (KPI Cards + Analytics Breakdown) */}
        {activeTab === 'dashboard' && (
          <>
            <DashboardStats
              state={appState}
              onOpenAddChanda={() => setActiveTab('chanda')}
              onOpenAddExpense={() => {
                setActiveTab('expenses');
                setExpenseModalTrigger((prev) => prev + 1);
              }}
            />

            <AnalyticsCharts state={appState} />
          </>
        )}

        {/* Chanda Tab */}
        {activeTab === 'chanda' && (
          <ChandaLog
            chandaList={appState.chandaList}
            onAddChanda={handleAddChanda}
            onEditChanda={handleEditChanda}
            onDeleteChanda={handleDeleteChanda}
          />
        )}

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <ExpenseLog
            expenseList={appState.expenseList}
            flatsList={appState.flatsList}
            onAddExpense={handleAddExpense}
            onEditExpense={handleEditExpense}
            onDeleteExpense={handleDeleteExpense}
            openAddModalTrigger={expenseModalTrigger}
          />
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <EventTimeline
            events={appState.poojaEvents}
            onAddEvent={handleAddEvent}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        )}

      </main>

      {/* Floating Action Button (FAB) for Mobile - Opens Add Expense Modal */}
      <button
        className="fab-btn"
        onClick={handleFABClick}
        title="Add Expense Entry"
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
          <Wallet size={20} />
          <span>Donations</span>
        </button>

        <button
          className={`bottom-nav-item ${activeTab === 'expenses' ? 'active' : ''}`}
          onClick={() => setActiveTab('expenses')}
        >
          <CreditCard size={20} />
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
      <footer style={{ marginTop: '40px', padding: '22px 20px', textAlign: 'center', fontSize: '0.88rem', color: '#E0F2FE', borderTop: '2px solid #48CAE4', background: 'linear-gradient(135deg, #0E5A73 0%, #137A9A 100%)', boxShadow: '0 -4px 20px rgba(14, 90, 115, 0.25)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <span>🪔</span>
          <strong style={{ color: '#FFFFFF', fontWeight: 800 }}>R.S Towers <span style={{ color: '#FFD166' }}>Ganesh Utsav 2026</span></strong>
        </div>
      </footer>

      {/* Modals */}
      {isWhatsAppModalOpen && (
        <WhatsAppShareModal
          state={appState}
          onClose={() => setIsWhatsAppModalOpen(false)}
        />
      )}

    </div>
  );
};

export default App;
