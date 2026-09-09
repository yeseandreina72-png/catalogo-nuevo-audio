import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  CloudUpload,
  ExternalLink,
  Key,
  Globe,
  Radio,
  Sparkles,
  Eye,
  EyeOff,
  ClipboardPaste,
  QrCode,
  Smartphone,
  Share2,
  Trash2,
  X,
} from 'lucide-react';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  testSupabaseConnection,
  saveBatchImagesToSupabase,
  isSupabaseConfigured,
  cleanSupabaseUrl,
  cleanSupabaseKey,
  extractProjectUrlFromKey,
  generateDeviceSyncUrl,
  DEFAULT_SUPABASE_URL,
  DEFAULT_SUPABASE_ANON_KEY,
} from '../lib/supabase';
import { EquipmentItem } from '../types';

interface SupabaseSyncTabProps {
  items: EquipmentItem[];
  onImagesRefreshed?: () => void;
}

const SQL_SCHEMA = `-- 1. Crear tabla para guardar las fotos de los equipos
CREATE TABLE IF NOT EXISTS public.equipment_images (
  id TEXT PRIMARY KEY,
  image_url TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Permitir lectura y escritura inmediata desde cualquier dispositivo
ALTER TABLE public.equipment_images DISABLE ROW LEVEL SECURITY;

-- 3. Habilitar sincronización en tiempo real (Realtime)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'equipment_images'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.equipment_images;
  END IF;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;`;

export const SupabaseSyncTab: React.FC<SupabaseSyncTabProps> = ({ items }) => {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedSyncLink, setCopiedSyncLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    tableExists?: boolean;
  } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    // Purge any stale keys from localStorage
    if (typeof window !== 'undefined') {
      try {
        const storedKey = localStorage.getItem('nuevo_audio_supabase_anon_key');
        if (storedKey && storedKey !== DEFAULT_SUPABASE_ANON_KEY) {
          localStorage.removeItem('nuevo_audio_supabase_anon_key');
          localStorage.removeItem('nuevo_audio_supabase_url');
        }
      } catch {
        // ignore
      }
    }

    setSupabaseUrl(DEFAULT_SUPABASE_URL);
    setSupabaseKey(DEFAULT_SUPABASE_ANON_KEY);

    handleTestConnection(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY);
  }, []);

  const handleOpenQrModal = async () => {
    const syncUrl = generateDeviceSyncUrl();
    if (!syncUrl) {
      setStatusMsg('Primero debes ingresar y guardar las credenciales en esta computadora.');
      setTimeout(() => setStatusMsg(''), 4000);
      return;
    }
    try {
      const dataUrl = await QRCode.toDataURL(syncUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#020617',
          light: '#ffffff',
        },
      });
      setQrCodeDataUrl(dataUrl);
      setShowQrModal(true);
    } catch (err) {
      console.error('Error generando QR code:', err);
      setStatusMsg('No se pudo generar el código QR.');
      setTimeout(() => setStatusMsg(''), 3000);
    }
  };

  const handleSaveCredentials = () => {
    let cleanUrl = cleanSupabaseUrl(supabaseUrl);
    const cleanKey = cleanSupabaseKey(supabaseKey);

    const autoUrl = extractProjectUrlFromKey(cleanKey);
    if (autoUrl && (!cleanUrl || !cleanUrl.includes(autoUrl.replace('https://', '').replace('.supabase.co', '')))) {
      cleanUrl = autoUrl;
    }

    setSupabaseUrl(cleanUrl);
    setSupabaseKey(cleanKey);

    saveSupabaseConfig(cleanUrl, cleanKey);
    setStatusMsg('¡Credenciales guardadas y verificadas!');
    handleTestConnection(cleanUrl, cleanKey);
    setTimeout(() => setStatusMsg(''), 4000);
  };

  const handlePasteKey = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        const cleanedKey = cleanSupabaseKey(text);
        setSupabaseKey(cleanedKey);

        const autoUrl = extractProjectUrlFromKey(cleanedKey);
        if (autoUrl) {
          setSupabaseUrl(autoUrl);
          saveSupabaseConfig(autoUrl, cleanedKey);
          setStatusMsg('¡Clave y URL de proyecto vinculadas automáticamente!');
        } else {
          setStatusMsg('¡Clave pegada del portapapeles!');
        }
        setTimeout(() => setStatusMsg(''), 3000);
      }
    } catch {
      // ignore
    }
  };

  const handleTestConnection = async (urlToTest?: string, keyToTest?: string) => {
    setIsTesting(true);
    setTestResult(null);

    if (urlToTest !== undefined && keyToTest !== undefined) {
      saveSupabaseConfig(urlToTest, keyToTest);
    }

    try {
      const res = await testSupabaseConnection();
      setTestResult(res);

      // Refresh URL/key state in case auto-alignment corrected the URL
      const latest = getSupabaseConfig();
      if (latest.url) setSupabaseUrl(latest.url);
      if (latest.anonKey) setSupabaseKey(latest.anonKey);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Error de conexión',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSyncAllToCloud = async () => {
    if (!isSupabaseConfigured()) {
      setStatusMsg('Primero configura tu URL y Anon Key de Supabase.');
      setTimeout(() => setStatusMsg(''), 4000);
      return;
    }

    setIsSyncing(true);
    setStatusMsg('');

    try {
      const map: Record<string, string> = {};
      items.forEach((item) => {
        if (item.image) {
          map[item.id] = item.image;
        }
      });

      const res = await saveBatchImagesToSupabase(map);
      if (res.success && res.savedCount && res.savedCount > 0) {
        setStatusMsg(`¡Éxito! Se sincronizaron ${res.savedCount} fotos a Supabase. Todos los usuarios las verán de inmediato.`);
        handleTestConnection(supabaseUrl, supabaseKey);
      } else if (res.tableMissing) {
        setStatusMsg('⚠️ La tabla "equipment_images" aún no existe en tu Supabase. Presiona "1. Abrir SQL Editor", pega el código y presiona el botón verde RUN.');
      } else {
        setStatusMsg(`Error al sincronizar: ${res.error || 'Verifica que la tabla esté creada.'}`);
      }
    } catch (err: any) {
      setStatusMsg(`Error: ${err?.message || 'Fallo de sincronización'}`);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setStatusMsg(''), 6000);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleCopySyncLink = () => {
    const syncUrl = generateDeviceSyncUrl();
    if (syncUrl) {
      navigator.clipboard.writeText(syncUrl);
      setCopiedSyncLink(true);
      setStatusMsg('📲 ¡Enlace para celular copiado! Pégalo en WhatsApp o envíalo a tu teléfono para vincularlo sin tener que escribir contraseñas.');
      setTimeout(() => setCopiedSyncLink(false), 3500);
      setTimeout(() => setStatusMsg(''), 7000);
    } else {
      setStatusMsg('Primero ingresa y guarda las credenciales de Supabase para generar el enlace.');
      setTimeout(() => setStatusMsg(''), 4000);
    }
  };

  const projectRef =
    extractProjectUrlFromKey(supabaseKey)?.replace('https://', '').replace('.supabase.co', '') ||
    supabaseUrl.replace('https://', '').replace('.supabase.co', '').split('/')[0] ||
    'bwztzqzybhtumawqrbjb';

  const sqlEditorUrl = `https://supabase.com/dashboard/project/${projectRef}/sql/new`;
  const tableEditorUrl = `https://supabase.com/dashboard/project/${projectRef}/editor`;

  return (
    <div className="space-y-4 text-left text-slate-200 py-1">
      {/* Live Status Header */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-slate-900 to-cyan-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-white text-sm">Base de Datos en la Nube (Supabase)</h4>
              {testResult?.success && testResult?.tableExists ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  Conectado & Realtime Activo
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-bold">
                  Acción Requerida en Supabase
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Al conectar Supabase, cualquier foto que cambies o subas se reflejará automáticamente en todos los celulares y computadoras en tiempo real.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleOpenQrModal}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            title="Escanear código QR con el celular para vincularlo al instante"
          >
            <QrCode className="w-4 h-4" />
            <span>📱 Vincular Celular (Código QR)</span>
          </button>
          <button
            type="button"
            onClick={handleCopySyncLink}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 border border-cyan-500/40 transition-colors cursor-pointer"
            title="Copiar enlace para abrir en el celular ya configurado"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedSyncLink ? '✓ Enlace Copiado' : 'Copiar Enlace'}</span>
          </button>
          <a
            href={tableEditorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <span>Ver Tablas</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href={sqlEditorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 border border-emerald-500/40 transition-colors"
          >
            <span>SQL Editor</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Prominent Banner when Table is Missing */}
      {testResult && testResult.success && !testResult.tableExists && (
        <div className="p-4 rounded-2xl bg-amber-950/50 border border-amber-500/50 text-amber-200 text-xs space-y-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-extrabold text-white text-sm">
                Falta crear la tabla "equipment_images" en Supabase
              </h5>
              <p className="text-xs text-amber-200/90 mt-1">
                La conexión a tu proyecto está funcionando, pero tu base de datos todavía no tiene la tabla para guardar las fotos. Solo necesitas hacer estos 3 pasos (tarda menos de 30 segundos):
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopySql}
              className="p-3 rounded-xl bg-slate-900 border border-amber-500/30 hover:border-amber-400 text-left transition-all"
            >
              <div className="flex items-center justify-between text-cyan-400 font-bold mb-1">
                <span>Paso 1</span>
                {copiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </div>
              <p className="text-xs font-semibold text-white">
                {copiedSql ? '¡Código SQL Copiado!' : 'Copiar Código SQL'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Haz clic aquí para copiar el script al portapapeles</p>
            </button>

            <a
              href={sqlEditorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 hover:border-emerald-400 text-left transition-all"
            >
              <div className="flex items-center justify-between text-emerald-400 font-bold mb-1">
                <span>Paso 2</span>
                <ExternalLink className="w-4 h-4" />
              </div>
              <p className="text-xs font-semibold text-white">Abrir SQL Editor</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Se abrirá la consola SQL de tu proyecto en Supabase</p>
            </a>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-left">
              <span className="text-amber-400 font-bold block mb-1">Paso 3</span>
              <p className="text-xs font-semibold text-white">Pegar y presionar RUN</p>
              <p className="text-[10px] text-slate-400 mt-0.5">En Supabase pega el código y presiona el botón verde RUN</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">
              ¿Ya presionaste RUN en Supabase?
            </span>
            <button
              type="button"
              disabled={isTesting}
              onClick={() => handleTestConnection(supabaseUrl, supabaseKey)}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>Verificar si ya se creó la tabla</span>
            </button>
          </div>
        </div>
      )}

      {/* Notifications */}
      {statusMsg && (
        <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <Sparkles className="w-4 h-4 shrink-0 text-cyan-400" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Grid: Credentials & Test Connection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column: Form */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              1. Credenciales de Supabase
            </span>
            <span className="text-[10px] text-slate-400">Settings &gt; API</span>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1 flex items-center gap-1">
              <Globe className="w-3 h-3 text-cyan-400" />
              Project URL:
            </label>
            <input
              type="text"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://xyzabcdefg.supabase.co"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Key className="w-3 h-3 text-cyan-400" />
                Anon / Public Key (eyJ...):
              </span>
              <button
                type="button"
                onClick={handlePasteKey}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/60"
                title="Pegar del portapapeles"
              >
                <ClipboardPaste className="w-3 h-3" />
                <span>Pegar</span>
              </button>
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(cleanSupabaseKey(e.target.value))}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-9 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                title={showKey ? 'Ocultar clave' : 'Mostrar clave'}
              >
                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleSaveCredentials}
              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition-all shadow-md"
            >
              Guardar Credenciales
            </button>
            <button
              type="button"
              disabled={isTesting || !supabaseUrl || !supabaseKey}
              onClick={() => handleTestConnection(supabaseUrl, supabaseKey)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>Probar</span>
            </button>
          </div>

          {/* Test Feedback */}
          {testResult && (
            <div
              className={`p-3 rounded-xl text-xs font-medium border flex items-start gap-2 ${
                testResult.success && testResult.tableExists
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : testResult.success && !testResult.tableExists
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                  : 'bg-red-950/40 border-red-500/40 text-red-300'
              }`}
            >
              {testResult.success && testResult.tableExists ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold">{testResult.message}</p>
                {testResult.success && !testResult.tableExists && (
                  <p className="mt-1 text-[11px] text-slate-300">
                    Copia y ejecuta el código SQL del paso 2 en el <strong>SQL Editor</strong> de Supabase para crear la tabla en 1 segundo.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: SQL Script */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                2. Crear Tabla en Supabase
              </span>
              <button
                type="button"
                onClick={handleCopySql}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-[11px] font-bold border border-cyan-500/30 flex items-center gap-1 transition-colors"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? '¡Copiado!' : 'Copiar Código SQL'}</span>
              </button>
            </div>

            <a
              href={sqlEditorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md mb-2 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Abrir SQL Editor de tu Proyecto ({projectRef})</span>
            </a>

            <p className="text-[11px] text-slate-400 mb-1.5">
              Haz clic en el botón verde de arriba, pega este script y presiona <strong>RUN</strong>:
            </p>
            <pre className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[10px] font-mono text-cyan-300/90 overflow-x-auto max-h-32 leading-relaxed select-all">
              {SQL_SCHEMA}
            </pre>

            <div className="mt-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Atención:</strong> En Supabase, después de pegar el código, <strong>DEBES presionar el botón verde RUN</strong> (o la tecla Ctrl+Enter). Si recargas la página sin darle a RUN, el editor se vacía y la tabla no se crea.
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <button
              type="button"
              disabled={isSyncing || !isSupabaseConfigured()}
              onClick={handleSyncAllToCloud}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
            >
              <CloudUpload className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
              <span>{isSyncing ? 'Sincronizando fotos...' : 'Sincronizar Todas las Fotos Locales a la Nube'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step by Step Guide */}
      <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 text-xs space-y-2.5">
        <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Pasos rápidos en Supabase (Solo se hace una vez):
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-slate-300">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="font-bold text-cyan-400 block mb-1">Paso 1: Crear Proyecto</span>
            Entra a Supabase.com, inicia sesión con GitHub o correo y crea un nuevo proyecto gratuito (ej: <code>nuevo-audio-db</code>).
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="font-bold text-cyan-400 block mb-1">Paso 2: Ejecutar el SQL</span>
            Ve a la pestaña <strong>SQL Editor</strong> en Supabase, pega el código de arriba y presiona <strong>RUN</strong>.
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="font-bold text-cyan-400 block mb-1">Paso 3: Copiar API Keys</span>
            Ve a <strong>Project Settings &gt; API</strong>, copia la <strong>URL</strong> y la <strong>anon public key</strong> y pégalas aquí arriba (o en Vercel).
          </div>
        </div>
      </div>

      {/* QR Code Modal for Mobile / Secondary Device Pairing */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative text-center space-y-4">
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 mx-auto">
              <Smartphone className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Vincular Celular con Supabase</h3>
              <p className="text-xs text-slate-400 mt-1">
                Escanea este código con la cámara de tu celular para que quede conectado en verde automáticamente.
              </p>
            </div>

            {qrCodeDataUrl ? (
              <div className="bg-white p-3 rounded-2xl inline-block mx-auto shadow-xl">
                <img
                  src={qrCodeDataUrl}
                  alt="Código QR de Conexión a Supabase"
                  className="w-56 h-56 rounded-lg mx-auto block"
                />
              </div>
            ) : (
              <div className="w-56 h-56 flex items-center justify-center mx-auto bg-slate-950 rounded-2xl border border-slate-800">
                <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
              </div>
            )}

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 text-left space-y-1.5">
              <p className="font-bold text-cyan-300">Pasos en tu celular:</p>
              <p className="text-slate-400 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                <span>Abre la app de <strong>Cámara</strong> de tu teléfono.</span>
              </p>
              <p className="text-slate-400 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                <span>Apunta a este código en tu pantalla.</span>
              </p>
              <p className="text-slate-400 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                <span>Toca la notificación: ¡Se conectará en verde sin tener que escribir nada!</span>
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopySyncLink}
                className="flex-1 py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedSyncLink ? '¡Enlace Copiado!' : 'Copiar para WhatsApp'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
