import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  testSupabaseConnection,
  saveBatchImagesToSupabase,
  isSupabaseConfigured,
  cleanSupabaseUrl,
  cleanSupabaseKey,
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

-- 2. Habilitar seguridad RLS
ALTER TABLE public.equipment_images ENABLE ROW LEVEL SECURITY;

-- 3. Eliminar políticas existentes si ya fueron creadas (para evitar errores 42710)
DROP POLICY IF EXISTS "Lectura publica de fotos" ON public.equipment_images;
DROP POLICY IF EXISTS "Guardar o actualizar fotos" ON public.equipment_images;

-- 4. Crear permisos de lectura publica y escritura (SELECT, INSERT, UPDATE)
CREATE POLICY "Lectura publica de fotos" 
ON public.equipment_images FOR SELECT 
USING (true);

CREATE POLICY "Guardar o actualizar fotos" 
ON public.equipment_images FOR ALL 
USING (true) 
WITH CHECK (true);

-- 5. Habilitar Realtime para reflejo instantáneo en todos los dispositivos
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
END $$;`;

export const SupabaseSyncTab: React.FC<SupabaseSyncTabProps> = ({ items }) => {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    tableExists?: boolean;
  } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    const { url, anonKey } = getSupabaseConfig();
    setSupabaseUrl(url);
    setSupabaseKey(anonKey);

    if (url && anonKey) {
      handleTestConnection(url, anonKey);
    }
  }, []);

  const handleSaveCredentials = () => {
    const cleanUrl = cleanSupabaseUrl(supabaseUrl);
    const cleanKey = cleanSupabaseKey(supabaseKey);
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
        const cleaned = cleanSupabaseKey(text);
        setSupabaseKey(cleaned);
        setStatusMsg('¡Clave pegada del portapapeles!');
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

      const ok = await saveBatchImagesToSupabase(map);
      if (ok) {
        setStatusMsg(`¡Éxito! Se sincronizaron ${Object.keys(map).length} fotos a Supabase. Todos los usuarios las verán de inmediato.`);
      } else {
        setStatusMsg('Error al sincronizar con Supabase. Verifica que la tabla "equipment_images" esté creada.');
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

  return (
    <div className="space-y-5 text-left text-slate-200 py-1">
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
                  Configuración Pendiente
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Al conectar Supabase, cualquier foto que cambies o subas se reflejará automáticamente en todos los celulares y computadoras en tiempo real.
            </p>
          </div>
        </div>

        <a
          href="https://supabase.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 shrink-0 transition-colors"
        >
          <span>Ir a Supabase</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

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
                2. Crear Tabla en Supabase (SQL Editor)
              </span>
              <button
                type="button"
                onClick={handleCopySql}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-[11px] font-bold border border-cyan-500/30 flex items-center gap-1 transition-colors"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? '¡Copiado!' : 'Copiar SQL'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              En tu panel de Supabase ve a <strong>SQL Editor &gt; New query</strong>, pega este script y dale clic a <strong>Run</strong>:
            </p>
            <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[10px] font-mono text-cyan-300/90 overflow-x-auto max-h-36 leading-relaxed select-all">
              {SQL_SCHEMA}
            </pre>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <button
              type="button"
              disabled={isSyncing || !isSupabaseConfigured()}
              onClick={handleSyncAllToCloud}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950/40"
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
    </div>
  );
};
