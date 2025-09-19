import { useState, useEffect, memo, useCallback } from 'react';

/**
 * Componente de imagen optimizado con lazy loading y fallbacks
 * 
 * @param {Object} props
 * @param {string} props.src - URL de la imagen
 * @param {string} props.alt - Texto alternativo
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {number} [props.width] - Ancho de la imagen
 * @param {number} [props.height] - Alto de la imagen
 * @param {string} [props.fallbackSrc] - URL de imagen de respaldo
 * @param {boolean} [props.lazy=true] - Si usar lazy loading
 * @returns {JSX.Element}
 */
const OptimizedImage = memo(({ 
  src, 
  alt, 
  className = '', 
  width, 
  height, 
  fallbackSrc,
  lazy = true 
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);

  // Intersection Observer para lazy loading
  useEffect(() => {
    if (!lazy) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Cargar 50px antes de que sea visible
        threshold: 0.1
      }
    );

    const imgElement = document.createElement('img');
    observer.observe(imgElement);

    return () => observer.disconnect();
  }, [lazy]);

  // Cargar imagen cuando esté en vista
  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    
    const handleLoad = () => {
      setImageSrc(src);
      setIsLoading(false);
      setError(false);
    };

    const handleError = () => {
      if (fallbackSrc && src !== fallbackSrc) {
        // Intentar con imagen de respaldo
        const fallbackImg = new Image();
        fallbackImg.onload = () => {
          setImageSrc(fallbackSrc);
          setIsLoading(false);
          setError(false);
        };
        fallbackImg.onerror = () => {
          setError(true);
          setIsLoading(false);
        };
        fallbackImg.src = fallbackSrc;
      } else {
        setError(true);
        setIsLoading(false);
      }
    };

    img.onload = handleLoad;
    img.onerror = handleError;
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallbackSrc, isInView]);

  // Memoizar clases CSS
  const containerClasses = useCallback(() => {
    const baseClasses = 'rounded object-cover';
    return `${baseClasses} ${className}`.trim();
  }, [className]);

  const skeletonClasses = useCallback(() => {
    return `animate-pulse bg-gray-300 dark:bg-slate-700 rounded ${className}`;
  }, [className]);

  const errorClasses = useCallback(() => {
    return `flex items-center justify-center bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 rounded text-sm ${className}`;
  }, [className]);

  if (isLoading) {
    return (
      <div
        className={skeletonClasses()}
        style={{ width, height }}
        aria-label="Cargando imagen..."
      />
    );
  }

  if (error) {
    return (
      <div
        className={errorClasses()}
        style={{ width, height }}
        role="img"
        aria-label={`Error al cargar imagen: ${alt}`}
      >
        <div className="flex flex-col items-center space-y-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs">Error</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      loading={lazy ? "lazy" : "eager"}
      className={containerClasses()}
      onError={() => setError(true)}
      decoding="async"
      style={{
        width: width ? `${width}px` : 'auto',
        height: height ? `${height}px` : 'auto'
      }}
    />
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
