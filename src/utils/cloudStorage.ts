import type { AppState } from '../types';
import { INITIAL_APP_STATE } from '../data/initialData';

const LOCAL_STORAGE_KEY = 'rs_towers_ganesh_utsav_v1';
const FIREBASE_URL_KEY = 'rs_towers_firebase_url';

// Default Firebase Realtime Database REST Endpoint
const DEFAULT_FIREBASE_DB_URL = 'https://rs-towers-ganesh-utsav-2026-default-rtdb.firebaseio.com/state.json';

export const getFirebaseDbUrl = (): string => {
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem(FIREBASE_URL_KEY);
    if (customUrl && customUrl.trim()) {
      let url = customUrl.trim();
      if (!url.endsWith('/state.json')) {
        url = url.replace(/\/+$/, '') + '/state.json';
      }
      return url;
    }
  }
  return DEFAULT_FIREBASE_DB_URL;
};

export const setFirebaseDbUrl = (url: string): void => {
  if (typeof window !== 'undefined') {
    if (url && url.trim()) {
      let formatted = url.trim();
      if (!formatted.endsWith('/state.json')) {
        formatted = formatted.replace(/\/+$/, '') + '/state.json';
      }
      localStorage.setItem(FIREBASE_URL_KEY, formatted);
    } else {
      localStorage.removeItem(FIREBASE_URL_KEY);
    }
  }
};

export const loadAppState = (): AppState => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return syncFlatsWithChanda(parsed);
    }
  } catch (err) {
    console.error('Failed to load local state:', err);
  }
  return syncFlatsWithChanda(INITIAL_APP_STATE);
};

export const saveAppState = (state: AppState): void => {
  try {
    const stateToSave = {
      ...state,
      lastUpdated: Date.now(),
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    createEditAutoBackup(stateToSave);
  } catch (err) {
    console.error('Failed to save local state:', err);
  }
};

// Fetch live state from Firebase Realtime Cloud database
export const fetchLatestCloudState = async (): Promise<AppState | null> => {
  try {
    const localState = loadAppState();
    const endpoint = getFirebaseDbUrl();
    const res = await fetch(endpoint);

    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.chandaList) && Array.isArray(json.expenseList)) {
        const cloudState = syncFlatsWithChanda(json);
        const localLastUpdated = localState?.lastUpdated || 0;
        const cloudLastUpdated = cloudState.lastUpdated || 0;

        // Adopt cloud state if cloud timestamp is newer OR local has fewer expenses than cloud
        const localExpensesCount = localState?.expenseList?.length || 0;
        const cloudExpensesCount = cloudState?.expenseList?.length || 0;

        if (cloudLastUpdated > localLastUpdated || cloudExpensesCount > localExpensesCount) {
          saveAppState(cloudState);
          return cloudState;
        } else if (localLastUpdated > cloudLastUpdated && localExpensesCount >= cloudExpensesCount) {
          // Local state is newer! Sync local state back up to cloud database
          syncToCloudRemote(localState);
        }
      }
    }
  } catch (err) {
    console.warn('Realtime Firebase cloud sync fetch warning:', err);
  }
  return null;
};

// Push live state update to Firebase Realtime Cloud database
export const syncToCloudRemote = async (state: AppState): Promise<boolean> => {
  saveAppState(state);
  
  try {
    // Cross-tab local broadcast
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('rs_towers_ganesh_sync');
      channel.postMessage({ type: 'STATE_UPDATE', state });
    }

    const endpoint = getFirebaseDbUrl();
    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(state),
    });

    return res.ok;
  } catch (err) {
    console.warn('Realtime Firebase cloud sync push error:', err);
    return false;
  }
};

export const syncFlatsWithChanda = (state: AppState): AppState => {
  const updatedFlats = state.flatsList.map((flat) => {
    const flatChandas = state.chandaList.filter((c) => c.flatNo === flat.flatNo && c.status === 'Received');
    const totalPaid = flatChandas.reduce((acc, c) => acc + c.amount, 0);
    
    let status: 'Received' | 'Partial' | 'Pending' = 'Pending';
    if (totalPaid >= flat.targetAmount) {
      status = 'Received';
    } else if (totalPaid > 0) {
      status = 'Partial';
    }

    const lastPayment = flatChandas.length > 0 ? flatChandas[flatChandas.length - 1].date : flat.lastPaymentDate;

    return {
      ...flat,
      paidAmount: totalPaid,
      status,
      lastPaymentDate: lastPayment,
    };
  });

  return {
    ...state,
    flatsList: updatedFlats,
  };
};

export const exportAppStateJSON = (state: AppState): void => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  const dateTag = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute("download", `RS_Towers_Ganesh_Tracker_Backup_${dateTag}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

export const importAppStateJSON = (file: File): Promise<AppState> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.chandaList && parsed.expenseList && parsed.flatsList) {
          const synced = syncFlatsWithChanda(parsed);
          saveAppState(synced);
          syncToCloudRemote(synced);
          resolve(synced);
        } else {
          reject(new Error('Invalid backup file structure. Mandatory lists missing.'));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read backup file'));
    reader.readAsText(file);
  });
};

export const resetToInitialState = (): AppState => {
  const fresh = syncFlatsWithChanda(INITIAL_APP_STATE);
  saveAppState(fresh);
  syncToCloudRemote(fresh);
  return fresh;
};

const AUTO_BACKUP_KEY = 'rs_towers_auto_backup';

export const createEditAutoBackup = (state: AppState): void => {
  try {
    const now = Date.now();
    const dateTag = new Date(now).toISOString().split('T')[0];
    
    // Save immediate latest post-edit snapshot
    localStorage.setItem(`${AUTO_BACKUP_KEY}_latest`, JSON.stringify(state));
    localStorage.setItem(`${AUTO_BACKUP_KEY}_${dateTag}`, JSON.stringify(state));
    localStorage.setItem('rs_towers_last_edit_backup_time', now.toString());
    
    console.log('✅ Post-edit auto-backup snapshot saved at:', new Date(now).toLocaleString());
  } catch (err) {
    console.error('Failed to create post-edit auto-backup:', err);
  }
};
