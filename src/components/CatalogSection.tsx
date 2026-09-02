import React, { useState, useRef, useEffect } from 'react';
import {
  Layers,
  Grid,
  Volume2,
  Sun,
  Tv,
  Flame,
  Zap,
  Info,
  Search,
  ArrowUpRight,
  Camera,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { EquipmentItem, ServiceCategory } from '../types';
import { CATEGORIES } from '../data/catalogData';
import { SafeImage } from './SafeImage';
import { compressImage } from '../utils/imageUtils';

interface CatalogSectionProps {
  items: EquipmentItem[];
  onViewItemDetails: (item: EquipmentItem) => void;
  onUpdateItemImage?: (itemId: string, newUrl: string) => void;
  onRequestProtectedUpload?: (itemId: string) => void;
  onOpenImageManager?: () => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  items,
  onViewItemDetails,
  onUpdateItemImage,
  onRequestProtectedUpload,
  onOpenImageManager,
}) => {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeUploadItemId, setActiveUploadItemId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const cardFileInputRef = useRef<HTMLInputElement>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const checkScroll = () => {
    const el = categoryScrollRef.current;
    if (el) {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setCanScrollLeft(scrollLeft > 8);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8);
      const maxScroll = scrollWidth - clientWidth;
      setScrollProgress(maxScroll > 0 ? Math.min(100, Math.max(0, (scrollLeft / maxScroll) * 100)) : 0);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = categoryScrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = 260;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleSelectCategory = (catId: ServiceCategory, e?: React.MouseEvent<HTMLButtonElement>) => {
    setActiveCategory(catId);
    if (e?.currentTarget) {
      e.currentTarget.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  };

  const handleCardFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeUploadItemId && onUpdateItemImage) {
      setIsUploading(true);
      try {
        const compressed = await compressImage(file);
        onUpdateItemImage(activeUploadItemId, compressed);
      } catch (err) {
        console.error(err);
      } finally {
        setIsUploading(false);
      }
    }
    if (e.target) e.target.value = '';
  };

  const triggerUploadForItem = (itemId: string) => {
    setActiveUploadItemId(itemId);
    cardFileInputRef.current?.click();
  };

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'tarimas':
        return <Layers className="w-4 h-4" />;
      case 'truss':
        return <Grid className="w-4 h-4" />;
      case 'sonido':
        return <Volume2 className="w-4 h-4" />;
      case 'iluminacion':
        return <Sun className="w-4 h-4" />;
      case 'pantallas':
        return <Tv className="w-4 h-4" />;
      case 'efectos':
        return <Flame className="w-4 h-4" />;
      case 'energia':
        return <Zap className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="catalogo" className="py-20 bg-[#090b10] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hidden file input for direct card upload */}
        <input
          ref={cardFileInputRef}
          type="file"
          accept="image/*"
          onChange={handleCardFileSelect}
          className="hidden"
        />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
              Catálogo de Servicios & Equipos
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-['Syne'] tracking-tight">
              Infraestructura & <span className="text-cyan-400">Tecnología</span>
            </h2>
            <p className="text-slate-400 mt-2 max-w-xl text-sm sm:text-base">
              Equipos de primera línea para conciertos, eventos corporativos, galas y festivales. Todo operado por personal técnico calificado.
            </p>
          </div>

          {/* Search Input */}
          <div className="w-full md:w-72 relative">
            <input
              type="text"
              id="catalog-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar equipo o servicio..."
              className="w-full bg-slate-900 border border-slate-700/80 focus:border-cyan-400 rounded-xl px-4 py-3 pl-10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>
        </div>

        {/* Category Carousel Navigation */}
        <div className="relative mb-10 group">
          {/* Left Arrow Button */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollCategories('left')}
              aria-label="Desplazar categorías hacia la izquierda"
              className="absolute -left-2 sm:-left-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900/95 hover:bg-slate-800 text-cyan-400 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-black/80 backdrop-blur-md transition-all hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* Left Gradient Edge Fade */}
          <div
            className={`pointer-events-none absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#090b10] via-[#090b10]/90 to-transparent z-10 transition-opacity duration-200 ${
              canScrollLeft ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Category Pills Row */}
          <div
            ref={categoryScrollRef}
            className="flex items-center gap-2.5 overflow-x-auto py-1 px-1 no-scrollbar smooth-scroll-x"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                id={`cat-filter-${cat.id}`}
                onClick={(e) => handleSelectCategory(cat.id as ServiceCategory, e)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all select-none shrink-0 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25 scale-[1.02]'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800/90 hover:border-slate-700'
                }`}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Right Gradient Edge Fade */}
          <div
            className={`pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#090b10] via-[#090b10]/90 to-transparent z-10 transition-opacity duration-200 ${
              canScrollRight ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Right Arrow Button */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => scrollCategories('right')}
              aria-label="Desplazar categorías hacia la derecha"
              className="absolute -right-2 sm:-right-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900/95 hover:bg-slate-800 text-cyan-400 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-black/80 backdrop-blur-md transition-all hover:scale-110 active:scale-95"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* Sleek Minimalist Neon Progress Indicator */}
          <div className="mt-3 flex items-center justify-center">
            <div className="w-28 sm:w-40 h-1 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/40 relative">
              <div
                className="h-full w-8 sm:w-12 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-transform duration-100 shadow-[0_0_8px_rgba(6,182,212,0.7)]"
                style={{
                  transform: `translateX(${scrollProgress * 2.3}%)`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Catalog Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-base">No se encontraron equipos con el filtro seleccionado.</p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-sm font-semibold"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              return (
                <div
                  key={item.id}
                  id={`catalog-card-${item.id}`}
                  className="group relative rounded-2xl bg-[#0e131f] border border-slate-800 hover:border-cyan-500/40 shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10"
                >
                  {/* Item Image Container */}
                  <div className="relative h-56 w-full overflow-hidden bg-slate-950">
                    <SafeImage
                      src={item.image}
                      fallbackSrc={item.fallbackImage}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e131f] via-transparent to-black/30"></div>

                    {/* Badge */}
                    {item.badge && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-cyan-400 text-slate-950 text-[11px] font-black tracking-wide uppercase shadow-md shadow-cyan-950/50">
                        {item.badge}
                      </span>
                    )}

                    {/* Quick Buttons */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {onUpdateItemImage && (
                        <button
                          type="button"
                          id={`btn-upload-${item.id}`}
                          onClick={() => {
                            if (onRequestProtectedUpload) {
                              onRequestProtectedUpload(item.id);
                            } else {
                              triggerUploadForItem(item.id);
                            }
                          }}
                          className="p-2 rounded-lg bg-black/70 hover:bg-cyan-400 hover:text-slate-950 text-cyan-300 backdrop-blur-md transition-all shadow-md border border-cyan-500/30"
                          title="Subir / Cambiar foto de este equipo"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        id={`btn-view-${item.id}`}
                        onClick={() => onViewItemDetails(item)}
                        className="p-2 rounded-lg bg-black/60 hover:bg-cyan-400 hover:text-slate-950 text-white backdrop-blur-md transition-all shadow-md"
                        title="Ver Ficha Técnica"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        onClick={() => onViewItemDetails(item)}
                        className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors font-['Syne'] cursor-pointer"
                      >
                        {item.name}
                      </h3>
                      <p className="text-xs text-cyan-400/90 font-semibold tracking-wide uppercase mt-1 mb-3">
                        {item.tagline}
                      </p>
                      <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-4">
                        {item.description}
                      </p>

                      {/* Specs Highlights */}
                      <div className="space-y-1.5 mb-6">
                        {item.features.slice(0, 2).map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-4 border-t border-slate-800/80">
                      <button
                        type="button"
                        id={`btn-details-${item.id}`}
                        onClick={() => onViewItemDetails(item)}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-800/90 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-500 hover:text-slate-950 text-cyan-300 text-xs font-bold border border-cyan-500/30 hover:border-transparent flex items-center justify-center gap-2 transition-all group/btn shadow-md shadow-cyan-950/20"
                      >
                        <span>Ver Ficha Técnica & Medidas</span>
                        <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
