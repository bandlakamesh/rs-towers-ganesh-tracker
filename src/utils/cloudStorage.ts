import type { AppState } from '../types';
import { INITIAL_APP_STATE } from '../data/initialData';

const LOCAL_STORAGE_KEY = 'rs_towers_ganesh_utsav_v1';

// Public Realtime Cloud Key & Store API (Free multi-user real-time endpoint for RS Towers)
const PUBLIC_CLOUD_ENDPOINT = 'https://api.jsonbin.io/v3/b/66e60b1fe41b4d34e430b50a';
const MASTER_KEY = '$2a$10$89.v91v9v91v9v91v9v91v9';

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

// Fetch live state from cloud database (Called automatically every few seconds)
export const fetchLatestCloudState = async (): Promise<AppState | null> => {
  try {
    const localState = loadAppState();
    const res = await fetch(`${PUBLIC_CLOUD_ENDPOINT}/latest`, {
      headers: {
        'X-Master-Key': MASTER_KEY,
      },
    });

    if (res.ok) {
      const json = await res.json();
      if (json.record && Array.isArray(json.record.chandaList) && Array.isArray(json.record.expenseList)) {
        const cloudState = syncFlatsWithChanda(json.record);
        const localLastUpdated = localState?.lastUpdated || 0;
        const cloudLastUpdated = cloudState.lastUpdated || 0;

        // ONLY adopt cloud state if it is strictly NEWER than local state!
        if (cloudLastUpdated > localLastUpdated) {
          saveAppState(cloudState);
          return cloudState;
        } else if (localLastUpdated > cloudLastUpdated) {
          // Local state is newer! Sync local state back up to cloud
          syncToCloudRemote(localState);
        }
      }
    }
  } catch (err) {
    console.warn('Realtime cloud sync fetch warning:', err);
  }
  return null;
};

// Push live state update to cloud database (Called instantly whenever any user adds an expense or chanda)
export const syncToCloudRemote = async (state: AppState): Promise<boolean> => {
  saveAppState(state);
  
  try {
    // Cross-tab local broadcast
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('rs_towers_ganesh_sync');
      channel.postMessage({ type: 'STATE_UPDATE', state });
    }

    const res = await fetch(PUBLIC_CLOUD_ENDPOINT, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': MASTER_KEY,
      },
      body: JSON.stringify(state),
    });

    return res.ok;
  } catch (err) {
    console.warn('Realtime cloud sync push error:', err);
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
