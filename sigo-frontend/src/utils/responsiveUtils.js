/**
 * Utilidades para responsive design
 * 
 * Este módulo proporciona utilidades para manejar responsive design
 * de manera consistente en toda la aplicación
 */

/**
 * Breakpoints de Tailwind CSS
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

/**
 * Clases de grilla responsive predefinidas
 */
export const GRID_CLASSES = {
  // Grillas básicas
  '1-col': 'grid-cols-1',
  '2-col': 'grid-cols-1 sm:grid-cols-2',
  '3-col': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  '4-col': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  '5-col': 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
  
  // Grillas para cards
  'cards': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  'cards-dense': 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
  
  // Grillas para formularios
  'form': 'grid-cols-1 sm:grid-cols-2',
  'form-3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  
  // Grillas para estadísticas
  'stats': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  'stats-2': 'grid-cols-1 sm:grid-cols-2',
  'stats-3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
};

/**
 * Clases de espaciado responsive
 */
export const SPACING_CLASSES = {
  'gap': 'gap-2 sm:gap-4 lg:gap-6',
  'gap-sm': 'gap-1 sm:gap-2 lg:gap-3',
  'gap-lg': 'gap-4 sm:gap-6 lg:gap-8',
  'padding': 'p-4 sm:p-6 lg:p-8',
  'padding-sm': 'p-2 sm:p-4 lg:p-6',
  'padding-lg': 'p-6 sm:p-8 lg:p-10',
  'margin': 'm-4 sm:m-6 lg:m-8',
  'margin-sm': 'm-2 sm:m-4 lg:m-6',
  'margin-lg': 'm-6 sm:m-8 lg:m-10',
};

/**
 * Clases de texto responsive
 */
export const TEXT_CLASSES = {
  'heading-1': 'text-2xl sm:text-3xl lg:text-4xl',
  'heading-2': 'text-xl sm:text-2xl lg:text-3xl',
  'heading-3': 'text-lg sm:text-xl lg:text-2xl',
  'heading-4': 'text-base sm:text-lg lg:text-xl',
  'body': 'text-sm sm:text-base',
  'body-sm': 'text-xs sm:text-sm',
  'body-lg': 'text-base sm:text-lg',
  'caption': 'text-xs sm:text-sm',
};

/**
 * Clases de botones responsive
 */
export const BUTTON_CLASSES = {
  'primary': 'w-full sm:w-auto',
  'secondary': 'w-full sm:w-auto',
  'group': 'flex flex-col sm:flex-row gap-2 sm:gap-3',
  'group-horizontal': 'flex flex-row gap-2 sm:gap-3',
  'group-vertical': 'flex flex-col gap-2 sm:gap-3',
};

/**
 * Clases de contenedores responsive
 */
export const CONTAINER_CLASSES = {
  'page': 'px-4 sm:px-6 lg:px-8',
  'section': 'px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8',
  'card': 'p-4 sm:p-6',
  'modal': 'p-4 sm:p-6 lg:p-8',
  'form': 'space-y-4 sm:space-y-6',
  'grid': 'grid gap-4 sm:gap-6',
};

/**
 * Clases de visibilidad responsive
 */
export const VISIBILITY_CLASSES = {
  'mobile-only': 'block sm:hidden',
  'tablet-only': 'hidden sm:block lg:hidden',
  'desktop-only': 'hidden lg:block',
  'mobile-tablet': 'block lg:hidden',
  'tablet-desktop': 'hidden sm:block',
  'desktop-xl': 'hidden xl:block',
};

/**
 * Obtener clases de grilla responsive
 * @param {string} type - Tipo de grilla
 * @param {Object} options - Opciones adicionales
 * @returns {string} Clases CSS
 */
export function getGridClasses(type = '3-col', options = {}) {
  const baseClasses = GRID_CLASSES[type] || GRID_CLASSES['3-col'];
  const gap = options.gap ? SPACING_CLASSES[options.gap] : SPACING_CLASSES.gap;
  
  return `${baseClasses} ${gap}`;
}

/**
 * Obtener clases de contenedor responsive
 * @param {string} type - Tipo de contenedor
 * @param {Object} options - Opciones adicionales
 * @returns {string} Clases CSS
 */
export function getContainerClasses(type = 'page', options = {}) {
  const baseClasses = CONTAINER_CLASSES[type] || CONTAINER_CLASSES.page;
  const spacing = options.spacing ? SPACING_CLASSES[options.spacing] : '';
  
  return `${baseClasses} ${spacing}`;
}

/**
 * Obtener clases de texto responsive
 * @param {string} type - Tipo de texto
 * @param {Object} options - Opciones adicionales
 * @returns {string} Clases CSS
 */
export function getTextClasses(type = 'body', options = {}) {
  const baseClasses = TEXT_CLASSES[type] || TEXT_CLASSES.body;
  const weight = options.weight ? `font-${options.weight}` : '';
  const color = options.color ? `text-${options.color}` : '';
  
  return `${baseClasses} ${weight} ${color}`.trim();
}

/**
 * Obtener clases de botón responsive
 * @param {string} type - Tipo de botón
 * @param {Object} options - Opciones adicionales
 * @returns {string} Clases CSS
 */
export function getButtonClasses(type = 'primary', options = {}) {
  const baseClasses = BUTTON_CLASSES[type] || BUTTON_CLASSES.primary;
  const size = options.size ? `px-${options.size} py-${options.size}` : '';
  const variant = options.variant ? `bg-${options.variant}` : '';
  
  return `${baseClasses} ${size} ${variant}`.trim();
}

/**
 * Obtener clases de visibilidad responsive
 * @param {string} type - Tipo de visibilidad
 * @returns {string} Clases CSS
 */
export function getVisibilityClasses(type = 'mobile-only') {
  return VISIBILITY_CLASSES[type] || VISIBILITY_CLASSES['mobile-only'];
}

/**
 * Verificar si el dispositivo es móvil
 * @param {number} width - Ancho de la pantalla
 * @returns {boolean}
 */
export function isMobile(width) {
  return width < BREAKPOINTS.sm;
}

/**
 * Verificar si el dispositivo es tablet
 * @param {number} width - Ancho de la pantalla
 * @returns {boolean}
 */
export function isTablet(width) {
  return width >= BREAKPOINTS.sm && width < BREAKPOINTS.lg;
}

/**
 * Verificar si el dispositivo es desktop
 * @param {number} width - Ancho de la pantalla
 * @returns {boolean}
 */
export function isDesktop(width) {
  return width >= BREAKPOINTS.lg;
}

/**
 * Obtener el breakpoint actual
 * @param {number} width - Ancho de la pantalla
 * @returns {string}
 */
export function getCurrentBreakpoint(width) {
  if (width < BREAKPOINTS.sm) return 'sm';
  if (width < BREAKPOINTS.md) return 'md';
  if (width < BREAKPOINTS.lg) return 'lg';
  if (width < BREAKPOINTS.xl) return 'xl';
  return '2xl';
}

export default {
  BREAKPOINTS,
  GRID_CLASSES,
  SPACING_CLASSES,
  TEXT_CLASSES,
  BUTTON_CLASSES,
  CONTAINER_CLASSES,
  VISIBILITY_CLASSES,
  getGridClasses,
  getContainerClasses,
  getTextClasses,
  getButtonClasses,
  getVisibilityClasses,
  isMobile,
  isTablet,
  isDesktop,
  getCurrentBreakpoint
};
