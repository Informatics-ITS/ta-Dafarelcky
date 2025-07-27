export const CACHE_NAME = 'traceability-cache';
export const CACHE_DB = 'traceability-db';
export const CACHE_VERSION = 1; 
export const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7; 

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(CACHE_DB, CACHE_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(CACHE_NAME)) {
        db.createObjectStore(CACHE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getFromCache(id) {
  try {
    console.log("Attempting to read from cache for id:", id);
    const db = await openDB();
    console.log("Opened DB successfully.");
    return new Promise((resolve, reject) => {
      const tx = db.transaction(CACHE_NAME, 'readonly');
      const store = tx.objectStore(CACHE_NAME);
      const request = store.get(id);
      request.onsuccess = () => {
        const record = request.result;
        if (!record) return resolve(null);
        const { data, timestamp } = record;
        const age = Date.now() - timestamp;
        if (age > CACHE_TTL_MS) {
          resolve(null);
        } else {
          resolve(data);
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("CRITICAL: IndexedDB failed to open. Caching is disabled.", err);
    alert("Warning: Caching is disabled because the database could not be opened. Check browser settings or private mode."); 
    return null;
  }
}


export async function saveToCache(id, data) {
    console.log("Saving to cache id:", id);
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CACHE_NAME, 'readwrite');
    const store = tx.objectStore(CACHE_NAME);
    const request = store.put({ id, data, timestamp: Date.now() });
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function clearCache() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CACHE_NAME, 'readwrite');
    const store = tx.objectStore(CACHE_NAME);
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
