import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, Image as ImageIcon, Loader2, Camera } from 'lucide-react';
import { EquipmentItem } from '../types';
import { SafeImage } from './SafeImage';
import { compressImage } from '../utils/imageUtils';

interface EquipmentModalProps {
  item: EquipmentItem | null;
  onClose: () => void;
  onUpdateItemImage: (id: string, newImageUrl: string) => void;
  onRequestAuth?: (onSuccess: () => void) => void;
}

export const EquipmentModal: React.FC<EquipmentModalProps> = ({
  item,
  onClose,
  onUpdateItemImage,
  onRequestAuth,
}) => {
  const [showImageChanger, setShowImageChanger] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (item) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [item, onClose]);

  if (!item) return null;

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      onUpdateItemImage(item.id, customUrl.trim());
      setShowImageChanger(false);
      setCustomUrl('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      try {
        const compressed = await compressImage(file);
        onUpdateItemImage(item.id, compressed);
        setShowImageChanger(false);
      } catch (err) {
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div
      id="equipment-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm transition-all"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-equipment-title"
    >
      <div
        id="equipment-modal-content"
        className="relative w-full max-w-2xl max-h-[88vh] rounded-2xl bg-[#0c101a] border border-slate-700/80 shadow-2xl shadow-black/80 overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          type="button"
          id="btn-close-modal"
          onClick={onClose}
          className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/70 hover:bg-cyan-400 hover:text-slate-950 text-white backdrop-blur-md transition-all shadow-md border border-white/10"
          aria-label="Cerrar Ficha Técnica"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 overscroll-contain">
          {/* Header Image with Panoramic Ratio */}
          <div className="relative h-44 sm:h-56 w-full bg-slate-950 overflow-hidden shrink-0">
            <SafeImage
              src={item.image}
              fallbackSrc={item.fallbackImage}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c101a] via-[#0c101a]/30 to-black/40"></div>

            {/* Category / Distinctive Badge */}
            {item.badge && (
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-cyan-400 text-slate-950 text-[11px] font-black uppercase tracking-wider shadow-md">
                {item.badge}
              </span>
            )}

            {/* Quick Photo Customizer Trigger */}
            <button
              type="button"
              onClick={() => {
                if (!showImageChanger && onRequestAuth) {
                  onRequestAuth(() => setShowImageChanger(true));
                } else {
                  setShowImageChanger(!showImageChanger);
                }
              }}
              className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/75 hover:bg-slate-800 text-cyan-300 text-[11px] font-semibold backdrop-blur-md border border-cyan-500/30 transition-all flex items-center gap-1.5 shadow-sm"
              title="Cambiar foto de este equipo"
            >
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cambiar Foto</span>
            </button>
          </div>

          {/* Quick Photo Change Subpanel */}
          {showImageChanger && (
            <div className="p-3 bg-slate-900 border-b border-cyan-500/30 text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-400 uppercase tracking-wider text-[11px]">
                  Reemplazar Foto de "{item.name}"
                </span>
                <button
                  type="button"
                  onClick={() => setShowImageChanger(false)}
                  className="text-slate-400 hover:text-white px-1 text-xs"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <form onSubmit={handleApplyCustomUrl} className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="URL (https://...) o ruta (/foto.jpg)"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-lg text-xs"
                  >
                    Guardar
                  </button>
                </form>
                <label className="cursor-pointer py-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 text-center font-semibold truncate flex items-center justify-center gap-1.5 text-xs">
                  {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>Subir de tu galería</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Body Content with Refined Proportions */}
          <div className="p-5 sm:p-6 space-y-5">
            {/* Title & Description */}
            <div>
              <h3
                id="modal-equipment-title"
                className="text-xl sm:text-2xl font-extrabold text-white font-['Syne'] tracking-tight"
              >
                {item.name}
              </h3>
              <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider mt-1">
                {item.tagline}
              </p>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mt-2.5">
                {item.description}
              </p>
            </div>

            {/* Technical Specs Grid */}
            <div>
              <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Especificaciones Técnicas
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.specs.map((spec, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/90 flex justify-between items-center text-xs"
                  >
                    <span className="text-slate-400">{spec.label}</span>
                    <span className="font-semibold text-slate-100 text-right ml-2">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features List */}
            <div>
              <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                Características del Equipo
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ideal For Tags */}
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Ideal para:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {item.idealFor.map((use, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-md bg-slate-800/80 text-slate-300 text-[11px] font-medium border border-slate-700/80"
                  >
                    {use}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions Fixed at Bottom */}
        <div className="p-3.5 sm:p-4 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Producción técnica y montajes certificados
          </span>
          <button
            type="button"
            id="modal-close-btn"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors ml-auto"
          >
            Cerrar Ficha Técnica
          </button>
        </div>
      </div>
    </div>
  );
};
