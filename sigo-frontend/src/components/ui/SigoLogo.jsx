import React from 'react';

/**
 * Logo de SIGO - Componente SVG
 * Basado en el diseño: persona leyendo un libro
 */
const SigoLogo = ({ 
  size = 32, 
  className = "", 
  showText = true, 
  textSize = "text-xl",
  variant = "default" // default, compact, icon-only
}) => {
  const logoVariants = {
    default: {
      iconSize: size,
      textSize: textSize,
      showText: showText
    },
    compact: {
      iconSize: size * 0.8,
      textSize: "text-lg",
      showText: showText
    },
    "icon-only": {
      iconSize: size,
      textSize: "",
      showText: false
    }
  };

  const config = logoVariants[variant] || logoVariants.default;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icono SVG */}
      <div className="flex-shrink-0">
        <svg
          width={config.iconSize}
          height={config.iconSize}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
        >
          {/* Cabeza (círculo) */}
          <circle
            cx="16"
            cy="8"
            r="4"
            fill="currentColor"
            className="text-blue-600"
          />
          
          {/* Libro abierto */}
          <path
            d="M8 16 L16 12 L24 16 L16 20 L8 16 Z"
            fill="currentColor"
            className="text-blue-600"
          />
          
          {/* Línea central del libro (espina) */}
          <line
            x1="16"
            y1="12"
            x2="16"
            y2="20"
            stroke="currentColor"
            strokeWidth="1"
            className="text-blue-500"
          />
          
          {/* Páginas del libro (detalles) */}
          <path
            d="M10 15 L16 13 L22 15"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
            className="text-blue-400"
          />
          <path
            d="M10 17 L16 15 L22 17"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
            className="text-blue-400"
          />
        </svg>
      </div>

      {/* Texto SIGO */}
      {config.showText && (
        <div className="flex-shrink-0">
          <h1 className={`font-bold text-white tracking-tight ${config.textSize}`}>
            SIGO
          </h1>
        </div>
      )}
    </div>
  );
};

export default SigoLogo;
