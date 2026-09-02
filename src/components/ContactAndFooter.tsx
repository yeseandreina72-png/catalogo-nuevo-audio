import React from 'react';
import { Volume2, ShieldCheck, ArrowUp, Lock } from 'lucide-react';

interface ContactAndFooterProps {
  onOpenAdmin?: () => void;
}

export const ContactAndFooter: React.FC<ContactAndFooterProps> = ({ onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contacto" className="bg-[#06080d] border-t border-slate-800 text-slate-300 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80 items-center justify-between">
          {/* Brand Info */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/25">
                <Volume2 className="w-5 h-5 text-slate-950" />
              </div>
              <span className="text-2xl font-extrabold text-white font-['Syne']">
                NUEVO<span className="text-cyan-400"> AUDIO</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl">
              Empresa especializada en producción técnica integral para eventos públicos y privados. Sonido profesional, iluminación robótica DMX, estructuras y techos Truss 10x10 con lona negra, tarimas modulares, pantallas LED y generadores eléctricos.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs font-semibold text-cyan-400">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Montajes certificados y técnicos de sala capacitados</span>
            </div>
          </div>

          {/* Quick Links / Navigation */}
          <div className="md:col-span-4 flex flex-col md:items-end space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-['Syne']">
              Navegación
            </h4>
            <div className="flex flex-col md:items-end space-y-2 text-xs text-slate-400">
              <a href="#hero-section" className="hover:text-cyan-400 transition-colors">
                • Inicio / Presentación
              </a>
              <a href="#catalogo" className="hover:text-cyan-400 transition-colors">
                • Catálogo de Equipos
              </a>
              <a href="#truss-techo" className="hover:text-cyan-400 transition-colors">
                • Techo Truss 10x10
              </a>
              {onOpenAdmin && (
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 pt-1 text-slate-500 hover:text-cyan-300"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Gestión de Fotos (PIN)</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Copyright & Scroll to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} NUEVO AUDIO. Catálogo Técnico y Producción de Eventos.</p>
          <div className="flex items-center gap-4">
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1"
                title="Administración con PIN 202020"
              >
                <Lock className="w-3 h-3" />
                <span>Acceso Admin</span>
              </button>
            )}
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <span>Volver arriba</span>
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
