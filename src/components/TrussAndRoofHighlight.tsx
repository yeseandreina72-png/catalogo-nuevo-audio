import React from 'react';
import { Grid, ShieldCheck, ArrowRight, Zap, Wind, Layers, Info } from 'lucide-react';
import { SafeImage } from './SafeImage';

interface TrussAndRoofHighlightProps {
  onViewDetails?: () => void;
  trussImage?: string;
}

export const TrussAndRoofHighlight: React.FC<TrussAndRoofHighlightProps> = ({
  onViewDetails,
  trussImage,
}) => {
  return (
    <section
      id="truss-techo"
      className="py-20 bg-gradient-to-b from-[#090b10] via-[#0c1018] to-[#090b10] border-t border-slate-800/80 relative overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Technical Narrative & Value */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Grid className="w-3.5 h-3.5" />
              Especialidad en Rigging & Estructuras
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-['Syne'] tracking-tight leading-tight">
              Estructura & <span className="text-cyan-400">Techo Truss 10x10</span> con Lona Negra
            </h2>

            <p className="text-slate-300 text-base leading-relaxed">
              Diseñado y fabricado para proteger escenarios principales y suspender sistemas de sonido profesional, iluminación robótica y pantallas LED. Nuestra cubierta con <strong>lona negra impermeable de alta densidad</strong> garantiza estética sobria, sombra fresca y protección absoluta para cualquier producción en exteriores.
            </p>

            {/* Technical Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Medida Monumental 10x10m</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    100 m² de cobertura total con altura libre ajustable hasta 7.50 metros.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Lona Negra Antilluvia</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Lona vinílica blackout 100% impermeable, ignífuga y de máxima duración.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Ground Support Certificado</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Torres de elevación y malacates con frenos mecánicos y anclaje de vientos.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Puente Truss Integrado</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Vigas cruzadas para colgado frontal, central y trasero de luces y pantallas.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Showcase Button */}
            {onViewDetails && (
              <div className="pt-3">
                <button
                  type="button"
                  id="btn-ver-ficha-truss"
                  onClick={onViewDetails}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 group"
                >
                  <Info className="w-4 h-4" />
                  <span>Ver Ficha Técnica y Especificaciones de Montaje</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Visual Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 to-[#0b101a] border border-cyan-500/30 p-2 shadow-2xl overflow-hidden group shadow-cyan-950/40">
              <div className="relative h-96 w-full rounded-xl overflow-hidden bg-slate-950">
                <SafeImage
                  src={trussImage || "/LONA.jpg"}
                  fallbackSrc="/LONA.jpg"
                  alt="Techo Truss 10x10 con Lona Negra y Estructura"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                {/* Overlaid Blueprint Stats */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/80 backdrop-blur-md border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      Ficha de Estructura Principal
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                      Listo para Montaje
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
                      <span className="block text-slate-400 text-[10px]">Superficie</span>
                      <span className="font-extrabold text-white">10x10 Metros</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
                      <span className="block text-slate-400 text-[10px]">Cubierta</span>
                      <span className="font-extrabold text-cyan-300">Lona Negra</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
                      <span className="block text-slate-400 text-[10px]">Capacidad</span>
                      <span className="font-extrabold text-white">Truss Heavy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
