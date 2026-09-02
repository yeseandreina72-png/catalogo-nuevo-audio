import React from 'react';
import { ChevronRight, Zap, Layers, Grid, Tv, Volume2 } from 'lucide-react';
import { COMPANY_INFO } from '../data/catalogData';

export const Hero: React.FC = () => {
  return (
    <section
      id="hero-section"
      className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 overflow-hidden bg-gradient-to-b from-[#090b10] via-[#0d121c] to-[#090b10]"
    >
      {/* Background Lighting Gradients & Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px]"></div>
        <div className="absolute top-20 right-10 w-80 h-80 bg-sky-400/10 rounded-full blur-[100px]"></div>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #06b6d4 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Top Pill / Badge */}
          <div
            id="hero-pill-badge"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 backdrop-blur-md mb-6 shadow-inner shadow-cyan-500/10"
          >
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-xs sm:text-sm font-semibold text-cyan-300 uppercase tracking-widest">
              Experiencia & Potencia en Producción de Eventos
            </span>
          </div>

          {/* Main Title */}
          <h1
            id="hero-main-title"
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white font-['Syne',sans-serif] tracking-tight leading-[1.1] mb-6"
          >
            NUEVO<span className="text-cyan-400 drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]"> AUDIO</span>
          </h1>

          {/* Exact User Text Highlight Box */}
          <div
            id="hero-statement-card"
            className="relative p-4 sm:p-8 rounded-2xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-xl shadow-2xl mb-8 text-left sm:text-center w-full max-w-3xl shadow-cyan-950/40"
          >
            <div className="absolute -top-3 left-4 sm:left-6 px-3 py-0.5 rounded-md bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
              Nuestra Empresa
            </div>
            <p
              id="hero-exact-statement"
              className="text-sm sm:text-base lg:text-lg font-bold text-slate-100 tracking-wide leading-relaxed uppercase"
            >
              {COMPANY_INFO.heroStatement}
            </p>
          </div>

          {/* Equalizer Visual Animation in LED Cyan */}
          <div className="flex items-end justify-center gap-1.5 h-8 mb-8" aria-hidden="true">
            {[40, 70, 95, 60, 85, 100, 75, 90, 65, 50, 80, 95, 60, 40].map((height, i) => (
              <span
                key={i}
                className="w-1 bg-gradient-to-t from-cyan-500 via-sky-400 to-blue-400 rounded-full animate-pulse shadow-[0_0_6px_#06b6d4]"
                style={{
                  height: `${height}%`,
                  animationDuration: `${0.8 + (i % 5) * 0.2}s`,
                  animationDelay: `${i * 0.08}s`,
                }}
              ></span>
            ))}
          </div>

          {/* Quick Pillar Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 text-xs sm:text-sm font-medium text-slate-300">
            <span className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/80 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> Tarimas & Pasamanos
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/80 flex items-center gap-1.5">
              <Grid className="w-3.5 h-3.5 text-cyan-400" /> Techo Truss 10x10 Lona Negra
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/80 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> Sonido & Monitores
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/80 flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-cyan-400" /> Pantallas LED Gigantes
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/80 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" /> Planta Eléctrica & Efectos
            </span>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <a
              href="#catalogo"
              id="hero-btn-catalogo"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 font-extrabold text-base shadow-xl shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
            >
              <span>Ver Catálogo de Equipos</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#truss-techo"
              id="hero-btn-truss"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-bold text-base border border-slate-700 hover:border-cyan-400/50 shadow-lg backdrop-blur-md transition-all flex items-center justify-center gap-2"
            >
              <Grid className="w-5 h-5 text-cyan-400" />
              <span>Estructura Techo Truss 10x10</span>
            </a>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-14 pt-10 border-t border-slate-800/80 w-full max-w-2xl">
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-4xl font-extrabold text-white font-['Syne']">
                {COMPANY_INFO.experienceYears}
              </span>
              <span className="text-xs text-slate-400 uppercase tracking-wider mt-1">
                Años de Trayectoria
              </span>
            </div>
            <div className="flex flex-col items-center border-x border-slate-800">
              <span className="text-2xl sm:text-4xl font-extrabold text-cyan-400 font-['Syne'] drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                {COMPANY_INFO.eventsCompleted}
              </span>
              <span className="text-xs text-slate-400 uppercase tracking-wider mt-1">
                Eventos Realizados
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-4xl font-extrabold text-white font-['Syne']">
                {COMPANY_INFO.satisfactionRate}
              </span>
              <span className="text-xs text-slate-400 uppercase tracking-wider mt-1">
                Compromiso & Calidad
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
