import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Images,
  RotateCcw,
  Check,
  Image as ImageIcon,
  FolderHeart,
  Layers,
  ArrowUpCircle,
  Loader2,
  HelpCircle,
  CheckCircle2,
  Camera,
  Grid,
  Download,
  FileCode,
  Smartphone,
  Laptop,
  CheckCheck,
} from 'lucide-react';
import { EquipmentItem, ServiceCategory } from '../types';
import { AVAILABLE_PUBLIC_IMAGES, CATEGORIES } from '../data/catalogData';
import { SafeImage } from './SafeImage';
import { compressImage, matchFilenameToEquipmentId } from '../utils/imageUtils';
import { downloadBackupJSON, parseBackupFile } from '../utils/persistentStorage';

interface ImageCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: EquipmentItem[];
  onUpdateItemImage: (id: string, newUrl: string) => void;
  onBatchUpdateImages?: (map: Record<string, string>) => void;
  onResetAllImages: () => void;
}

export const ImageCustomizerModal: React.FC<ImageCustomizerModalProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateItemImage,
  onBatchUpdateImages,
  onResetAllImages,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string>(items[0]?.id || '');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('all');
  const [customUrl, setCustomUrl] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeUploadItem, setActiveUploadItem] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'list' | 'editor'>('list');

  const singleFileInputRef = useRef<HTMLInputElement>(null);
  const itemSpecificInputRef = useRef<HTMLInputElement>(null);
  const batchInputRef = useRef<HTMLInputElement>(null);
  const backupFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const activeItem = items.find((i) => i.id === selectedItemId) || items[0];

  const filteredItems = items.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

  const handleSingleFileUpload = async (file: File, targetItemId: string) => {
    setIsProcessing(true);
    try {
      const compressed = await compressImage(file);
      onUpdateItemImage(targetItemId, compressed);
      const targetItem = items.find((it) => it.id === targetItemId);
      setSuccessMsg(`¡Foto optimizada y guardada para "${targetItem?.name || targetItemId}"! Se sincronizó con el servidor y tu navegador.`);
      setTimeout(() => setSuccessMsg(''), 5500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBatchFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    let matchCount = 0;
    const fileList = Array.from(files);

    for (const file of fileList) {
      const matchedItemId = matchFilenameToEquipmentId(file.name);
      const targetId = matchedItemId || (activeItem ? activeItem.id : undefined);

      if (targetId) {
        try {
          const compressed = await compressImage(file);
          onUpdateItemImage(targetId, compressed);
          matchCount++;
        } catch (err) {
          console.error(`Error procesando ${file.name}`, err);
        }
      }
    }

    setIsProcessing(false);
    setSuccessMsg(`¡${matchCount} imagen(es) procesadas y guardadas permanentemente para todos los dispositivos!`);
    setTimeout(() => setSuccessMsg(''), 6000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleBatchFileUpload(e.dataTransfer.files);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim() && activeItem) {
      onUpdateItemImage(activeItem.id, customUrl.trim());
      setCustomUrl('');
      setSuccessMsg(`¡Foto asignada y guardada para "${activeItem.name}"!`);
      setTimeout(() => setSuccessMsg(''), 4500);
    }
  };

  const handleSelectPresetPublicImage = (path: string) => {
    if (activeItem) {
      onUpdateItemImage(activeItem.id, path);
      setSuccessMsg(`¡Imagen ${path} asignada y guardada permanentemente para "${activeItem.name}"!`);
      setTimeout(() => setSuccessMsg(''), 4500);
    }
  };

  const triggerDirectUpload = (itemId: string) => {
    setActiveUploadItem(itemId);
    itemSpecificInputRef.current?.click();
  };

  const handleDownloadBackup = () => {
    const map: Record<string, string> = {};
    items.forEach((it) => {
      map[it.id] = it.image;
    });
    downloadBackupJSON(map);
    setSuccessMsg('¡Copia de respaldo descargada con éxito!');
    setTimeout(() => setSuccessMsg(''), 4500);
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsProcessing(true);
        const parsed = await parseBackupFile(file);
        if (onBatchUpdateImages) {
          onBatchUpdateImages(parsed);
        } else {
          for (const [id, url] of Object.entries(parsed)) {
            onUpdateItemImage(id, url);
          }
        }
        setSuccessMsg('¡Copia de respaldo importada y guardada con éxito en todos los equipos!');
        setTimeout(() => setSuccessMsg(''), 5500);
      } catch (err: any) {
        alert(err.message || 'Error al importar archivo');
      } finally {
        setIsProcessing(false);
      }
    }
    if (e.target) e.target.value = '';
  };

  return (
    <div
      id="image-manager-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="image-manager-content"
        className="relative w-full max-w-5xl rounded-3xl bg-[#0b0f19] border border-cyan-500/30 shadow-2xl p-4 sm:p-6 my-auto shadow-cyan-950/50 max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hidden inputs */}
        <input
          ref={itemSpecificInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && activeUploadItem) {
              handleSingleFileUpload(file, activeUploadItem);
            }
            if (e.target) e.target.value = '';
          }}
          className="hidden"
        />
        <input
          ref={singleFileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && activeItem) {
              handleSingleFileUpload(file, activeItem.id);
            }
            if (e.target) e.target.value = '';
          }}
          className="hidden"
        />
        <input
          ref={backupFileInputRef}
          type="file"
          accept=".json"
          onChange={handleImportBackup}
          className="hidden"
        />

        {/* Modal Top Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-3 shrink-0">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <Images className="w-3.5 h-3.5" />
                Gestor & Guardado Permanente
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                <CheckCheck className="w-3.5 h-3.5" />
                Sincronizado Servidor & Dispositivos
              </span>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-white font-['Syne']">
              Personalizador de Fotos de Equipos
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Tus fotos quedan guardadas de forma permanente en el servidor y tu navegador, adaptándose automáticamente a teléfonos, tablets y computadoras.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile View Switcher (Visible only on screens < md) */}
        <div className="flex md:hidden items-center gap-2 mb-3 shrink-0">
          <button
            type="button"
            onClick={() => setMobileTab('list')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              mobileTab === 'list'
                ? 'bg-cyan-400 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-300 border border-slate-800'
            }`}
          >
            1. Ver Lista ({filteredItems.length})
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('editor')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              mobileTab === 'editor'
                ? 'bg-cyan-400 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-300 border border-slate-800'
            }`}
          >
            2. Editar Foto ({activeItem?.name?.slice(0, 14)}...)
          </button>
        </div>

        {/* Quick Drag / Batch Upload Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`mb-3 p-3 rounded-2xl border-2 border-dashed transition-all flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left shrink-0 ${
            isDragging
              ? 'bg-cyan-500/20 border-cyan-400 text-white'
              : 'bg-slate-900/60 border-slate-700/80 hover:border-cyan-500/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400">
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpCircle className="w-4 h-4" />}
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-200">
                Arrastra aquí tus fotos o selecciona un lote
              </p>
              <p className="text-[11px] text-slate-400">
                Se optimizan automáticamente para no ralentizar la web en ningún dispositivo móvil.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => batchInputRef.current?.click()}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-bold shrink-0 transition-all shadow-sm flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Subir Lote de Fotos</span>
            </button>
            <input
              ref={batchInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleBatchFileUpload(e.target.files)}
              className="hidden"
            />
          </div>
        </div>

        {/* Feedback Alert */}
        {successMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-2 shadow-sm shrink-0">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Category Filters Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-thin no-scrollbar shrink-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id as ServiceCategory)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Main Work Area */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 min-h-0 overflow-y-auto">
          {/* Equipment List (Left / Mobile Tab 'list') */}
          <div
            className={`md:col-span-6 space-y-2 overflow-y-auto pr-1 ${
              mobileTab === 'list' ? 'block' : 'hidden md:block'
            }`}
          >
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Selecciona el equipo a personalizar ({filteredItems.length}):
            </span>
            {filteredItems.map((item) => {
              const isCurrent = selectedItemId === item.id;
              const hasCustom = item.image.startsWith('data:');
              return (
                <div
                  key={item.id}
                  className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between gap-2.5 ${
                    isCurrent
                      ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-md shadow-cyan-950/40'
                      : 'bg-slate-900/80 border-slate-800/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedItemId(item.id);
                      setMobileTab('editor'); // Switch to editor on mobile when user taps item
                    }}
                    className="flex items-center gap-2.5 text-left flex-1 min-w-0"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-950 border border-slate-800">
                      <SafeImage
                        src={item.image}
                        fallbackSrc={item.fallbackImage}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="truncate flex-1">
                      <span className="block truncate text-xs font-bold text-slate-100">{item.name}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-cyan-400 uppercase font-semibold">
                          {item.category}
                        </span>
                        {hasCustom ? (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                            Foto propia
                          </span>
                        ) : (
                          <span className="text-[9px] text-slate-500 font-mono truncate max-w-[120px]">
                            {item.image}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Direct upload button on card */}
                  <button
                    type="button"
                    onClick={() => triggerDirectUpload(item.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-400 hover:text-slate-950 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold shrink-0 transition-all flex items-center gap-1 shadow-sm"
                    title={`Subir foto para ${item.name}`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Subir</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Active Item Detail Panel (Right / Mobile Tab 'editor') */}
          <div
            className={`md:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between space-y-3 overflow-y-auto ${
              mobileTab === 'editor' ? 'block' : 'hidden md:flex'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm sm:text-base font-bold text-white font-['Syne'] truncate">
                  {activeItem.name}
                </h4>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 text-[10px] font-bold uppercase shrink-0">
                  {activeItem.category}
                </span>
              </div>

              {/* Big Preview */}
              <div className="relative h-40 sm:h-48 w-full rounded-xl overflow-hidden bg-slate-950 mb-3 border border-slate-800">
                <SafeImage
                  src={activeItem.image}
                  fallbackSrc={activeItem.fallbackImage}
                  alt={activeItem.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2.5 py-0.5 bg-black/80 rounded text-[10px] text-slate-200 font-semibold backdrop-blur-md">
                  Estado:{' '}
                  <span className="text-cyan-300 font-mono">
                    {activeItem.image.startsWith('data:') ? 'Foto personalizada guardada' : activeItem.image}
                  </span>
                </div>
              </div>

              {/* Upload Controls */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => singleFileInputRef.current?.click()}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-cyan-500/20"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                  <span>Cambiar Foto de "{activeItem.name}"</span>
                </button>

                {/* URL Direct Form */}
                <form onSubmit={handleUrlSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="URL (https://...) o ruta (/mifoto.jpg)"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white font-bold text-xs rounded-xl border border-slate-700 transition-all"
                  >
                    Asignar
                  </button>
                </form>
              </div>

              {/* Preset Image List */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <FolderHeart className="w-3 h-3 text-cyan-400" />
                  Imágenes precargadas en /public:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {AVAILABLE_PUBLIC_IMAGES.map((img) => (
                    <button
                      key={img.path}
                      type="button"
                      onClick={() => handleSelectPresetPublicImage(img.path)}
                      className={`px-2 py-1 rounded-lg border text-left text-[10px] truncate transition-all ${
                        activeItem.image === img.path
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                          : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                      title={img.label}
                    >
                      {img.path}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Backup & Export Bar */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[11px]">
              <button
                type="button"
                onClick={handleDownloadBackup}
                className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                title="Descargar copia de seguridad en archivo JSON"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Descargar Respaldo</span>
              </button>
              <button
                type="button"
                onClick={() => backupFileInputRef.current?.click()}
                className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                title="Cargar archivo JSON de respaldo"
              >
                <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                <span>Importar Respaldo</span>
              </button>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={onResetAllImages}
                className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Restablecer originales</span>
                <span className="sm:hidden">Restablecer</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-bold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md"
              >
                Guardar y Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
