import React, { useState, useEffect, useRef } from 'react';
import { Volume2 } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
}

function resolveCleanSrc(rawSrc: string | undefined): string {
  if (!rawSrc || typeof rawSrc !== 'string') return '/TARIMA.jpg';
  const trimmed = rawSrc.trim();
  if (trimmed.startsWith('data:') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  if (trimmed.includes('tarima_modular_stage')) return '/TARIMA.jpg';
  if (trimmed.includes('techo_truss_stage')) return '/LONA.jpg';
  if (trimmed.includes('puente_truss_luces')) return '/ESTRUCTURAS.jpg';
  if (trimmed.includes('sonido_line_array')) return '/SONIDOSMOVIL2.jpg';
  if (trimmed.includes('pantalla_led_gigante')) return '/PANTALLA.jpg';
  if (trimmed.includes('planta_electrica_pro')) return '/PLANTAELECTRICA.jpg';
  if (trimmed.includes('transmision_streaming_live')) return '/TRANSMISIONENVIVO.jpg';

  if (trimmed.startsWith('/')) return trimmed;
  return '/' + trimmed;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  fallbackSrc = '/TARIMA.jpg',
  alt,
  className = '',
  ...rest
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(() => resolveCleanSrc(src));
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const clean = resolveCleanSrc(src);
    setCurrentSrc(clean);
    setHasError(false);

    // If already cached or complete, immediately mark as loaded
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [src]);

  const handleError = () => {
    const cleanFallback = resolveCleanSrc(fallbackSrc);
    if (cleanFallback && currentSrc !== cleanFallback) {
      setCurrentSrc(cleanFallback);
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    if (img.naturalWidth === 0) {
      handleError();
    } else {
      setIsLoaded(true);
      setHasError(false);
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden flex items-center justify-center">
      {/* Background placeholder if still waiting for load */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 animate-pulse pointer-events-none" />
      )}

      {hasError ? (
        <div className="flex flex-col items-center justify-center p-4 text-center text-slate-400 bg-gradient-to-br from-slate-900 to-slate-950 w-full h-full border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-2">
            <Volume2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-200 line-clamp-1">{alt}</span>
          <span className="text-[10px] text-cyan-400 font-mono mt-0.5">NUEVO AUDIO</span>
        </div>
      ) : (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`${className} transition-opacity duration-200`}
          referrerPolicy="no-referrer"
          {...rest}
        />
      )}
    </div>
  );
};

