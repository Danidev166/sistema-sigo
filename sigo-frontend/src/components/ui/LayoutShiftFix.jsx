import React, { useEffect, useRef, useState } from 'react';

/**
 * Componente para prevenir Layout Shift
 * 
 * Este componente reserva espacio para contenido
 * que se carga dinámicamente para evitar CLS.
 */
export function LayoutShiftFix({ 
  children, 
  minHeight = '200px', 
  className = '',
  showSkeleton = true 
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Simular carga para evitar layout shift
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative ${className}`}
      style={{ minHeight }}
    >
      {!isLoaded && showSkeleton && (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      )}
      
      {isLoaded && children}
    </div>
  );
}

/**
 * Hook para reservar espacio para imágenes
 */
export function useImageDimensions(src, fallbackWidth = 400, fallbackHeight = 300) {
  const [dimensions, setDimensions] = useState({
    width: fallbackWidth,
    height: fallbackHeight
  });

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.onload = () => {
      setDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    img.src = src;
  }, [src, fallbackWidth, fallbackHeight]);

  return dimensions;
}

/**
 * Componente de imagen optimizada para evitar layout shift
 */
export function OptimizedImage({ 
  src, 
  alt, 
  fallbackWidth = 400, 
  fallbackHeight = 300,
  className = '',
  ...props 
}) {
  const { width, height } = useImageDimensions(src, fallbackWidth, fallbackHeight);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        aspectRatio: `${width}/${height}`
      }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Cargando...</div>
        </div>
      )}
      
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
        style={{
          width: `${width}px`,
          height: `${height}px`
        }}
        {...props}
      />
    </div>
  );
}

/**
 * Componente para reservar espacio para listas dinámicas
 */
export function ListPlaceholder({ 
  itemCount = 5, 
  itemHeight = 60,
  className = '' 
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: itemCount }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-gray-200 rounded"
          style={{ height: `${itemHeight}px` }}
        />
      ))}
    </div>
  );
}

/**
 * Hook para detectar layout shifts
 */
export function useLayoutShiftDetection() {
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    if (!window.PerformanceObserver) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.hadRecentInput) return;
        
        setShifts(prev => [...prev, {
          value: entry.value,
          sources: entry.sources,
          timestamp: entry.startTime
        }]);
      });
    });

    observer.observe({ entryTypes: ['layout-shift'] });

    return () => observer.disconnect();
  }, []);

  return shifts;
}

export default LayoutShiftFix;
