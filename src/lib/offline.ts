const DB_NAME = "maisfortes-offline";
const STORE_NAME = "pending-checkins";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export interface PendingCheckin {
  id?: number;
  goalId: string;
  score: number;
  mood: string;
  note?: string;
  date: string;
  createdAt: string;
}

export async function savePendingCheckin(checkin: Omit<PendingCheckin, "id">) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).add(checkin);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getPendingCheckins(): Promise<PendingCheckin[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function clearPendingCheckins() {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function syncPendingCheckins(
  syncFn: (checkin: PendingCheckin) => Promise<void>
) {
  const pending = await getPendingCheckins();
  if (pending.length === 0) return 0;

  let synced = 0;
  for (const checkin of pending) {
    try {
      await syncFn(checkin);
      synced++;
    } catch {
      // Will retry next time
      break;
    }
  }

  if (synced === pending.length) {
    await clearPendingCheckins();
  }

  return synced;
}
