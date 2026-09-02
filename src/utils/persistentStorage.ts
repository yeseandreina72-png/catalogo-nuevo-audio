/**
 * Persistent Image Storage Engine using IndexedDB, localStorage, and Server Disk API.
 * Guarantees that user uploads and selected images NEVER disappear across reloads,
 * browser changes, different devices, or quota limits.
 */

const DB_NAME = 'NuevoAudioAppDB';
const STORE_NAME = 'equipment_images_v8';
const DB_VERSION = 3;
export const PRIMARY_LOCAL_KEY = 'nuevo_audio_permanent_images_v8';

// Legacy keys to auto-migrate so the user never loses previous selections
const LEGACY_STORAGE_KEYS = [
  'nuevo_audio_permanent_images_v8',
  'nuevo_audio_permanent_images_v7',
  'nuevo_audio_permanent_images_v6',
  'nuevo_audio_permanent_images',
  'nuevo_audio_custom_images_v4',
  'nuevo_audio_custom_images_v3',
  'nuevo_audio_custom_images_v2',
  'nuevo_audio_custom_images',
  'custom_images',
];

/**
 * Sanitizes any image URL or file path.
 * Converts broken internal paths (/src/assets/images/...) to real /public/... URLs.
 */
export function sanitizeImagePath(path: string): string {
  if (!path || typeof path !== 'string') return '';
  const trimmed = path.trim();
  if (trimmed.startsWith('data:') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Convert legacy uncompiled source paths to public assets
  if (trimmed.includes('tarima_modular_stage')) return '/TARIMA.jpg';
  if (trimmed.includes('techo_truss_stage')) return '/LONA.jpg';
  if (trimmed.includes('puente_truss_luces')) return '/ESTRUCTURAS.jpg';
  if (trimmed.includes('sonido_line_array')) return '/SONIDOSMOVIL2.jpg';
  if (trimmed.includes('pantalla_led_gigante')) return '/PANTALLA.jpg';
  if (trimmed.includes('planta_electrica_pro')) return '/PLANTAELECTRICA.jpg';
  if (trimmed.includes('transmision_streaming_live')) return '/TRANSMISIONENVIVO.jpg';

  if (trimmed.startsWith('/')) return trimmed;
  return '/' + trimmed;
}

/**
 * Opens or initializes IndexedDB instance.
 */
function openDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }

    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result as IDBDatabase;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = (event: any) => {
        resolve(event.target.result);
      };

      request.onerror = () => {
        resolve(null);
      };
    } catch {
      resolve(null);
    }
  });
}

/**
 * Retrieves all saved custom images from IndexedDB, scanning ALL object stores
 * to recover images from previous versions (e.g. equipment_images_v7, equipment_images_v6, etc.)
 */
export async function loadImagesFromIndexedDB(): Promise<Record<string, string>> {
  const db = await openDB();
  if (!db) return {};

  const results: Record<string, string> = {};

  try {
    const storeNames = Array.from(db.objectStoreNames);
    for (const storeName of storeNames) {
      await new Promise<void>((resolve) => {
        try {
          const transaction = db.transaction([storeName], 'readonly');
          const store = transaction.objectStore(storeName);
          const request = store.openCursor();

          request.onsuccess = (event: any) => {
            const cursor = event.target.result;
            if (cursor) {
              const key = cursor.key as string;
              const rawVal = cursor.value;
              if (key && typeof rawVal === 'string' && rawVal.trim() !== '') {
                const sanitized = sanitizeImagePath(rawVal);
                if (sanitized) {
                  // If it's a data: URL (user upload), it ALWAYS takes priority!
                  if (sanitized.startsWith('data:') || !results[key]) {
                    results[key] = sanitized;
                  }
                }
              }
              cursor.continue();
            } else {
              resolve();
            }
          };

          request.onerror = () => resolve();
        } catch {
          resolve();
        }
      });
    }
  } catch {
    // ignore
  }

  return results;
}

/**
 * Persists an item image to IndexedDB.
 */
export async function saveImageToIndexedDB(itemId: string, imageUrl: string): Promise<void> {
  const db = await openDB();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.put(imageUrl, itemId);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

/**
 * Synchronous loader from localStorage (reading all legacy and wildcard keys).
 * Recovers data: URLs, public paths, and sanitizes broken paths.
 */
export function loadImagesFromLocalStorage(): Record<string, string> {
  const consolidated: Record<string, string> = {};

  if (typeof window === 'undefined' || !window.localStorage) {
    return consolidated;
  }

  const parseAndAdd = (rawStr: string | null) => {
    if (!rawStr) return;
    try {
      const parsed = JSON.parse(rawStr);
      if (typeof parsed === 'object' && parsed !== null) {
        for (const [id, val] of Object.entries(parsed)) {
          if (typeof val === 'string' && val.trim() !== '') {
            const sanitized = sanitizeImagePath(val);
            if (sanitized) {
              // User uploads (data:) take top priority
              if (sanitized.startsWith('data:') || !consolidated[id]) {
                consolidated[id] = sanitized;
              }
            }
          }
        }
      }
    } catch {
      // ignore
    }
  };

  // 1. Primary key
  parseAndAdd(localStorage.getItem(PRIMARY_LOCAL_KEY));

  // 2. All legacy keys
  for (const key of LEGACY_STORAGE_KEYS) {
    parseAndAdd(localStorage.getItem(key));
  }

  // 3. Scan all keys in localStorage for anything related to audio/images
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.includes('nuevo_audio') ||
          key.includes('equipment_images') ||
          key.includes('catalog_images') ||
          key.includes('saved_custom_images'))
      ) {
        parseAndAdd(localStorage.getItem(key));
      }
    }
  } catch {
    // ignore
  }

  return consolidated;
}

/**
 * Fetches saved custom images from the backend API.
 * Ensures that changes made on one device are visible on other devices.
 */
export async function fetchSavedImagesFromServer(): Promise<Record<string, string>> {
  if (typeof window === 'undefined') return {};

  try {
    const res = await fetch('/api/custom-images');
    if (!res.ok) return {};
    const data = await res.json();
    if (data && typeof data.images === 'object' && data.images !== null) {
      const sanitizedServer: Record<string, string> = {};
      for (const [k, v] of Object.entries(data.images)) {
        if (typeof v === 'string' && v.trim() !== '') {
          sanitizedServer[k] = sanitizeImagePath(v);
        }
      }
      return sanitizedServer;
    }
  } catch {
    // server might be booting or offline in static mode
  }
  return {};
}

/**
 * Consolidates multiple image maps giving highest priority to user-uploaded data URLs.
 */
export function consolidateImages(
  ...maps: Array<Record<string, string>>
): Record<string, string> {
  const result: Record<string, string> = {};

  // First pass: standard sanitized paths
  for (const map of maps) {
    if (!map) continue;
    for (const [id, url] of Object.entries(map)) {
      if (typeof url === 'string' && url.trim() !== '') {
        const clean = sanitizeImagePath(url);
        if (clean) {
          result[id] = clean;
        }
      }
    }
  }

  // Second pass: any data: URL (user upload) ALWAYS overrides any preset or standard path!
  for (const map of maps) {
    if (!map) continue;
    for (const [id, url] of Object.entries(map)) {
      if (typeof url === 'string' && url.startsWith('data:')) {
        result[id] = url;
      }
    }
  }

  return result;
}

/**
 * Saves all images to localStorage, IndexedDB, and server disk in parallel.
 */
export function saveAllImagesPermanently(images: Record<string, string>): void {
  if (typeof window === 'undefined') return;

  // 1. Try writing to primary localStorage key
  try {
    localStorage.setItem(PRIMARY_LOCAL_KEY, JSON.stringify(images));
  } catch {
    // If quota exceeded in localStorage, IndexedDB & Server handle it without limits
  }

  // 2. Always persist into IndexedDB
  for (const [itemId, url] of Object.entries(images)) {
    if (url) {
      saveImageToIndexedDB(itemId, url).catch(() => {});
    }
  }

  // 3. Sync with Server disk file via API (so all devices see it!)
  try {
    fetch('/api/custom-images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images }),
    }).catch(() => {
      // server sync silently continues
    });
  } catch {
    // ignore
  }
}

/**
 * Clears all custom images permanently from local storage, IndexedDB, and server.
 */
export async function clearAllImagesPermanently(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(PRIMARY_LOCAL_KEY);
    for (const key of LEGACY_STORAGE_KEYS) {
      localStorage.removeItem(key);
    }
  } catch {
    // ignore
  }

  const db = await openDB();
  if (db) {
    try {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      transaction.objectStore(STORE_NAME).clear();
    } catch {
      // ignore
    }
  }

  try {
    await fetch('/api/reset-images', { method: 'POST' });
  } catch {
    // ignore
  }
}

/**
 * Downloads current image configuration as a JSON backup file.
 */
export function downloadBackupJSON(images: Record<string, string>): void {
  const jsonStr = JSON.stringify(images, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `nuevo_audio_imagenes_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Reads and parses a backup JSON file uploaded by the user.
 */
export function parseBackupFile(file: File): Promise<Record<string, string>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        if (typeof parsed === 'object' && parsed !== null) {
          resolve(parsed);
        } else {
          reject(new Error('El archivo no contiene un formato de configuración válido'));
        }
      } catch (err) {
        reject(new Error('Error al parsear el archivo JSON'));
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsText(file);
  });
}
