/**
 * Componente de grilla responsive mejorado
 * 
 * Este componente proporciona una grilla que se adapta automáticamente
 * a diferentes tamaños de pantalla con breakpoints optimizados
 */

import { memo } from 'react';
import { cn } from '../../utils/cn';

/**
 * @typedef {Object} ResponsiveGridProps
 * @property {number} [cols] - Número de columnas en desktop (default: 3)
 * @property {number} [smCols] - Número de columnas en tablet (default: 2)
 * @property {number} [mdCols] - Número de columnas en desktop pequeño (default: 3)
 * @property {number} [lgCols] - Número de columnas en desktop (default: 4)
 * @property {number} [xlCols] - Número de columnas en desktop grande (default: 5)
 * @property {string} [gap] - Espaciado entre elementos (default: 'gap-4')
 * @property {string} [className] - Clases CSS adicionales
 * @property {React.ReactNode} children - Elementos de la grilla
 */

const ResponsiveGrid = memo(({
  cols = 1,
  smCols = 2,
  mdCols = 3,
  lgCols = 4,
  xlCols = 5,
  gap = 'gap-4',
  className = '',
  children,
  ...props
}) => {
  const gridClasses = cn(
    'grid',
    `grid-cols-${cols}`,
    `sm:grid-cols-${smCols}`,
    `md:grid-cols-${mdCols}`,
    `lg:grid-cols-${lgCols}`,
    `xl:grid-cols-${xlCols}`,
    gap,
    className
  );

  return (
    <div className={gridClasses} {...props}>
      {children}
    </div>
  );
});

ResponsiveGrid.displayName = 'ResponsiveGrid';

export default ResponsiveGrid;
