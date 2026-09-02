import React, { useState, useEffect, useRef } from 'react';
import { Lock, ShieldAlert, CheckCircle2, X, Eye, EyeOff, KeyRound } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

const ADMIN_PIN = '202020';

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = 'Acceso de Administrador',
  description = 'Ingresa la clave de seguridad para personalizar y modificar las fotos de los equipos.',
}) => {
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(false);
      setIsSuccess(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pin === ADMIN_PIN) {
      setIsSuccess(true);
      setError(false);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 400);
    } else {
      setError(true);
      setPin('');
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      id="admin-auth-modal"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all animate-fadeIn"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        className={`relative w-full max-w-md rounded-2xl bg-gradient-to-b from-[#0e1320] to-[#070a12] border ${
          error
            ? 'border-red-500/80 shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-shake'
            : isSuccess
            ? 'border-emerald-500/80 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
            : 'border-slate-800 shadow-2xl shadow-cyan-950/40'
        } p-6 sm:p-8 text-center transition-all`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          aria-label="Cerrar ventana de autenticación"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Security Icon Badge */}
        <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
          {isSuccess ? (
            <CheckCircle2 className="w-7 h-7 text-emerald-400 animate-scale" />
          ) : error ? (
            <ShieldAlert className="w-7 h-7 text-red-400" />
          ) : (
            <KeyRound className="w-7 h-7 text-cyan-400" />
          )}
        </div>

        {/* Modal Title & Text */}
        <h3 id="auth-modal-title" className="text-lg sm:text-xl font-bold text-white font-['Syne']">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-1.5 mb-6 max-w-xs mx-auto leading-relaxed">
          {description}
        </p>

        {/* PIN Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              ref={inputRef}
              type={showPassword ? 'text' : 'password'}
              maxLength={12}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                if (error) setError(false);
              }}
              placeholder="Ingresa la clave de acceso"
              className={`w-full bg-slate-900/90 border ${
                error
                  ? 'border-red-500 text-red-200 focus:ring-red-500'
                  : 'border-slate-700/80 focus:border-cyan-400 focus:ring-cyan-400 text-cyan-100'
              } rounded-xl px-4 py-3.5 pl-11 pr-11 text-center font-mono text-lg tracking-[0.3em] placeholder:tracking-normal placeholder:text-slate-500 placeholder:text-xs placeholder:font-sans focus:outline-none focus:ring-1 transition-all shadow-inner`}
            />
            <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition-colors"
              title={showPassword ? 'Ocultar clave' : 'Mostrar clave'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-xs font-semibold text-red-400 flex items-center justify-center gap-1.5 animate-fadeIn">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>Clave incorrecta. Solo administradores autorizados.</span>
            </p>
          )}

          {isSuccess && (
            <p className="text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>¡Acceso concedido! Abriendo gestor...</span>
            </p>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={pin.length === 0}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-cyan-500/20"
            >
              Desbloquear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
