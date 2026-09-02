import React, { useState, useEffect } from 'react';
import { Volume2, Menu, X, Lock } from 'lucide-react';

interface NavbarProps {
  onOpenImageManager: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenImageManager }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Catálogo', href: '#catalogo' },
    { label: 'Techo Truss 10x10', href: '#truss-techo' },
  ];

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#090b10]/95 backdrop-blur-md border-b border-slate-800/80 shadow-2xl py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#"
            id="brand-logo"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform">
              <Volume2 className="w-5 h-5 text-slate-950" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-wider text-white font-['Syne',sans-serif]">
                  NUEVO<span className="text-cyan-400">AUDIO</span>
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse"></span>
              </div>
              <span className="text-[10px] tracking-widest text-slate-400 uppercase font-semibold">
                Producción Audiovisual
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                id={`nav-link-${link.href.replace('#', '')}`}
                className="text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors py-1 relative group tracking-wide"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Action Button: Admin Gestor de Fotos con PIN */}
          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              id="btn-open-image-manager"
              onClick={onOpenImageManager}
              className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700/60 hover:border-cyan-500/40 transition-all flex items-center gap-1.5 shadow-sm"
              title="Panel de Administración para gestionar fotos (Requiere PIN 202020)"
            >
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Admin Fotos</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              id="btn-mobile-image-manager"
              onClick={onOpenImageManager}
              className="p-2 rounded-lg bg-slate-900 text-cyan-400 border border-slate-700/60"
              title="Admin Fotos"
            >
              <Lock className="w-4 h-4" />
            </button>
            <button
              type="button"
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 text-slate-200 hover:text-white border border-slate-800"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="md:hidden bg-[#0c1017] border-b border-slate-800 px-4 pt-4 pb-6 mt-3 space-y-3 shadow-2xl"
        >
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-base font-semibold text-slate-200 hover:text-cyan-400 hover:bg-slate-800/60"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenImageManager();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 text-cyan-300 font-bold text-sm flex items-center justify-center gap-2 border border-cyan-500/30"
            >
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Gestión de Fotos (PIN: 202020)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
