import { StoredKeyPair } from '@/types/crypto';

const DB_NAME = 'openchat_e2ee';
const DB_VERSION = 1;
const STORE_USER_KEYS = 'user_keys';
const STORE_GROUP_KEYS = 'group_keys';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_USER_KEYS)) {
        db.createObjectStore(STORE_USER_KEYS, { keyPath: 'userId' });
      }
      if (!db.objectStoreNames.contains(STORE_GROUP_KEYS)) {
        db.createObjectStore(STORE_GROUP_KEYS, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveUserKeyPair(userId: string, data: StoredKeyPair): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_USER_KEYS, 'readwrite');
    const store = tx.objectStore(STORE_USER_KEYS);
    const item = { userId, ...data };
    const req = store.put(item);

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function loadUserKeyPair(userId: string): Promise<StoredKeyPair | null> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_USER_KEYS, 'readonly');
    const store = tx.objectStore(STORE_USER_KEYS);
    const req = store.get(userId);

    req.onsuccess = () => {
      if (req.result) {
        resolve({
          publicKeyJwk: req.result.publicKeyJwk,
          privateKeyJwk: req.result.privateKeyJwk,
          fingerprint: req.result.fingerprint,
          createdAt: req.result.createdAt,
        });
      } else {
        resolve(null);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

export async function deleteUserKeyPair(userId: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_USER_KEYS, 'readwrite');
    const store = tx.objectStore(STORE_USER_KEYS);
    const req = store.delete(userId);

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function saveCachedGroupKey(groupId: string, version: number, rawKey: ArrayBuffer): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_GROUP_KEYS, 'readwrite');
    const store = tx.objectStore(STORE_GROUP_KEYS);
    const item = {
      id: `${groupId}_v${version}`,
      groupId,
      version,
      rawKey,
      savedAt: Date.now(),
    };
    const req = store.put(item);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function loadCachedGroupKey(groupId: string, version: number): Promise<ArrayBuffer | null> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_GROUP_KEYS, 'readonly');
    const store = tx.objectStore(STORE_GROUP_KEYS);
    const req = store.get(`${groupId}_v${version}`);

    req.onsuccess = () => {
      if (req.result && req.result.rawKey) {
        resolve(req.result.rawKey);
      } else {
        resolve(null);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

export async function clearAllCryptoStorage(): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORE_USER_KEYS, STORE_GROUP_KEYS], 'readwrite');
    tx.objectStore(STORE_USER_KEYS).clear();
    tx.objectStore(STORE_GROUP_KEYS).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
