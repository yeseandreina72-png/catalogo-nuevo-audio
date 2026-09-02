import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_SUPABASE_URL_KEY = 'nuevo_audio_supabase_url';
const STORAGE_SUPABASE_KEY_KEY = 'nuevo_audio_supabase_anon_key';

let cachedClient: SupabaseClient | null = null;
let lastUsedUrl = '';
let lastUsedKey = '';

/**
 * Cleans and normalizes Supabase URL
 */
export function cleanSupabaseUrl(rawUrl: string): string {
  let url = (rawUrl || '').trim();
  url = url.replace(/['";]/g, '');
  // Remove trailing slashes
  url = url.replace(/\/+$/, '');
  // Ensure https://
  if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  return url;
}

/**
 * Cleans and normalizes Supabase Anon / Public Key
 */
export function cleanSupabaseKey(rawKey: string): string {
  let key = (rawKey || '').trim();
  key = key.replace(/['"\s;]/g, '');
  return key;
}

/**
 * Extracts matching project URL from a JWT anon key if available
 */
export function extractProjectUrlFromKey(key: string): string | null {
  try {
    const cleanKey = cleanSupabaseKey(key);
    const parts = cleanKey.split('.');
    if (parts.length >= 2) {
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      if (payload && payload.ref) {
        return `https://${payload.ref}.supabase.co`;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Retrieves current Supabase credentials from environment or local storage.
 */
export function getSupabaseConfig(): { url: string; anonKey: string } {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  const localUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_SUPABASE_URL_KEY) || '' : '';
  const localKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_SUPABASE_KEY_KEY) || '' : '';

  let url = cleanSupabaseUrl(localUrl || envUrl);
  const anonKey = cleanSupabaseKey(localKey || envKey);

  // If key has project ref, auto-align URL
  const matchedUrl = extractProjectUrlFromKey(anonKey);
  if (matchedUrl && (!url || !url.includes(matchedUrl.replace('https://', '').replace('.supabase.co', '')))) {
    url = matchedUrl;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_SUPABASE_URL_KEY, url);
    }
  }

  return { url, anonKey };
}

/**
 * Syncs Supabase configuration with backend server so all devices share credentials automatically.
 */
export async function syncSupabaseConfigWithServer(): Promise<{ url: string; anonKey: string }> {
  try {
    const res = await fetch('/api/supabase-config');
    if (res.ok) {
      const data = await res.json();
      if (data?.config?.url && data?.config?.anonKey) {
        const { url, anonKey } = data.config;
        if (typeof window !== 'undefined') {
          const currentUrl = localStorage.getItem(STORAGE_SUPABASE_URL_KEY);
          const currentKey = localStorage.getItem(STORAGE_SUPABASE_KEY_KEY);
          if (currentUrl !== url || currentKey !== anonKey) {
            localStorage.setItem(STORAGE_SUPABASE_URL_KEY, url);
            localStorage.setItem(STORAGE_SUPABASE_KEY_KEY, anonKey);
            cachedClient = null;
            lastUsedUrl = '';
            lastUsedKey = '';
          }
        }
        return { url, anonKey };
      }
    }
  } catch {
    // ignore
  }
  return getSupabaseConfig();
}

/**
 * Saves custom Supabase credentials from the UI settings and syncs to server.
 */
export function saveSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window === 'undefined') return;
  let cleanUrl = cleanSupabaseUrl(url);
  const cleanKey = cleanSupabaseKey(anonKey);

  const matchedUrl = extractProjectUrlFromKey(cleanKey);
  if (matchedUrl && (!cleanUrl || !cleanUrl.includes(matchedUrl.replace('https://', '').replace('.supabase.co', '')))) {
    cleanUrl = matchedUrl;
  }

  if (cleanUrl) {
    localStorage.setItem(STORAGE_SUPABASE_URL_KEY, cleanUrl);
  } else {
    localStorage.removeItem(STORAGE_SUPABASE_URL_KEY);
  }

  if (cleanKey) {
    localStorage.setItem(STORAGE_SUPABASE_KEY_KEY, cleanKey);
  } else {
    localStorage.removeItem(STORAGE_SUPABASE_KEY_KEY);
  }

  // Sync to server so other devices (phones, computers) get connected automatically
  if (cleanUrl && cleanKey) {
    fetch('/api/supabase-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: cleanUrl, anonKey: cleanKey }),
    }).catch(() => {});
  }

  cachedClient = null;
  lastUsedUrl = '';
  lastUsedKey = '';
}

/**
 * Checks if Supabase credentials are configured.
 */
export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey && url.startsWith('https://') && anonKey.length > 20);
}

/**
 * Returns an active Supabase client instance (or null if unconfigured).
 */
export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) return null;

  if (cachedClient && lastUsedUrl === url && lastUsedKey === anonKey) {
    return cachedClient;
  }

  try {
    const headers: Record<string, string> = {
      apikey: anonKey,
    };
    // Include Bearer header if key is standard JWT
    if (anonKey.startsWith('eyJ')) {
      headers.Authorization = `Bearer ${anonKey}`;
    }

    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
    lastUsedUrl = url;
    lastUsedKey = anonKey;
    return cachedClient;
  } catch (err) {
    console.warn('Error inicializando cliente de Supabase:', err);
    return null;
  }
}

/**
 * Fetches all images from Supabase `equipment_images` table.
 */
export async function fetchImagesFromSupabase(): Promise<Record<string, string>> {
  const client = getSupabaseClient();
  if (!client) return {};

  try {
    const { data, error } = await client
      .from('equipment_images')
      .select('id, image_url');

    if (error) {
      console.warn('Error al consultar tabla equipment_images en Supabase:', error.message);
      return {};
    }

    if (Array.isArray(data)) {
      const result: Record<string, string> = {};
      for (const row of data) {
        if (row && row.id && row.image_url) {
          result[row.id] = row.image_url;
        }
      }
      return result;
    }
  } catch (err) {
    console.warn('Fallo de conexión con Supabase:', err);
  }

  return {};
}

/**
 * Saves a single image to Supabase `equipment_images` table.
 */
export async function saveImageToSupabase(itemId: string, imageUrl: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('equipment_images')
      .upsert(
        {
          id: itemId,
          image_url: imageUrl,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (error) {
      console.warn(`Error al guardar ${itemId} en Supabase:`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Excepción al enviar imagen a Supabase:', err);
    return false;
  }
}

/**
 * Saves a batch of images to Supabase in parallel individual calls to avoid payload size errors.
 */
export async function saveBatchImagesToSupabase(imagesMap: Record<string, string>): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  const entries = Object.entries(imagesMap);
  if (entries.length === 0) return true;

  let allSuccess = true;

  // Save each image individually so base64 strings never exceed HTTP request limits
  for (const [id, image_url] of entries) {
    if (!id || !image_url) continue;
    try {
      const { error } = await client
        .from('equipment_images')
        .upsert(
          {
            id,
            image_url,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );

      if (error) {
        console.warn(`Error al guardar imagen "${id}" en Supabase:`, error.message);
        allSuccess = false;
      }
    } catch (err) {
      console.warn(`Excepción al guardar imagen "${id}" en Supabase:`, err);
      allSuccess = false;
    }
  }

  return allSuccess;
}

/**
 * Subscribes to real-time changes in Supabase so every device updates automatically!
 */
export function subscribeToSupabaseImages(
  onImageChange: (itemId: string, newUrl: string) => void
): (() => void) | null {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const channel = client
      .channel('equipment_images_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'equipment_images' },
        (payload) => {
          if (payload.new && (payload.new as any).id && (payload.new as any).image_url) {
            const item = payload.new as { id: string; image_url: string };
            onImageChange(item.id, item.image_url);
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  } catch (err) {
    console.warn('No se pudo establecer suscripción Realtime con Supabase:', err);
    return null;
  }
}

/**
 * Tests connection with Supabase and verifies table readiness.
 */
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
  tableExists?: boolean;
}> {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) {
    return {
      success: false,
      message: 'Falta configurar la URL y la Anon Key de Supabase.',
    };
  }

  const cleanUrl = cleanSupabaseUrl(url);
  const cleanKey = cleanSupabaseKey(anonKey);

  // 1. Direct REST probe
  try {
    const headers: Record<string, string> = {
      'apikey': cleanKey,
      'Content-Type': 'application/json',
    };

    if (cleanKey.startsWith('eyJ')) {
      headers['Authorization'] = `Bearer ${cleanKey}`;
    }

    const restUrl = `${cleanUrl}/rest/v1/equipment_images?select=id&limit=1`;
    const response = await fetch(restUrl, { method: 'GET', headers });

    if (response.ok) {
      return {
        success: true,
        tableExists: true,
        message: '¡Conexión exitosa y tabla "equipment_images" detectada correctamente en Supabase!',
      };
    }

    const errorBody = await response.json().catch(() => ({}));

    if (
      response.status === 404 ||
      response.status === 400 ||
      errorBody.code === '42P01' ||
      (errorBody.message && errorBody.message.includes('does not exist'))
    ) {
      return {
        success: true,
        tableExists: false,
        message: '¡Conexión exitosa a Supabase! Solo falta ejecutar el código SQL para crear la tabla.',
      };
    }

    if (response.status === 401 || response.status === 403) {
      if (cleanKey.startsWith('sb_publishable_')) {
        return {
          success: false,
          message: 'Estás usando la clave "Publishable key" (sb_publishable_...). Por favor ve a Supabase > Settings > API Keys > pestaña "Legacy anon, service_role API keys" y copia la clave "anon public" (empieza con eyJ...).',
        };
      }

      const parts = cleanKey.split('.');
      if (cleanKey.startsWith('eyJ') && (parts.length < 3 || cleanKey.length < 130)) {
        return {
          success: false,
          message: 'La clave "anon" está INCOMPLETA (se cortó al copiar). En Supabase, NO selecciones el texto con el ratón; haz clic directamente en el botón "Copy" al lado derecho de la clave.',
        };
      }

      return {
        success: false,
        message: 'Clave API no válida para este proyecto. Ve a Supabase > Settings > API Keys > pestaña "Legacy anon, service_role API keys" y haz clic en "Copy" en la clave "anon public".',
      };
    }
  } catch (err: any) {
    console.warn('Probe REST fallo:', err);
  }

  // Fallback using Supabase client
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: 'Falta configurar las credenciales de Supabase.',
    };
  }

  try {
    const { data, error } = await client
      .from('equipment_images')
      .select('id')
      .limit(1);

    if (!error) {
      return {
        success: true,
        tableExists: true,
        message: '¡Conexión exitosa con Supabase! Base de datos sincronizada.',
      };
    }

    if (error.code === '42P01' || error.message.includes('does not exist')) {
      return {
        success: true,
        tableExists: false,
        message: 'Conexión exitosa, pero la tabla "equipment_images" aún no existe en tu base de datos.',
      };
    }

    return {
      success: false,
      message: `Error de Supabase: ${error.message || 'Verifica la clave API.'}`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Error de red al conectar: ${err?.message || 'Verifica tu conexión'}`,
    };
  }
}
