/**
 * Hook avanzado para responsive design
 * 
 * Este hook proporciona funcionalidades avanzadas para manejar
 * responsive design de manera eficiente
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { BREAKPOINTS, getCurrentBreakpoint, isMobile, isTablet, isDesktop } from '../utils/responsiveUtils';

/**
 * Hook avanzado para responsive design
 * 
 * @param {Object} options - Opciones de configuración
 * @param {boolean} options.trackOrientation - Si rastrear la orientación del dispositivo
 * @param {boolean} options.trackScroll - Si rastrear el scroll
 * @param {boolean} options.trackResize - Si rastrear el redimensionamiento
 * @returns {Object} Objeto con información responsive
 */
export const useResponsiveAdvanced = (options = {}) => {
  const {
    trackOrientation = true,
    trackScroll = false,
    trackResize = true
  } = options;

  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  const [orientation, setOrientation] = useState(
    typeof window !== 'undefined' 
      ? (window.innerWidth > window.innerHeight ? 'landscape' : 'portrait')
      : 'landscape'
  );

  const [scrollPosition, setScrollPosition] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Función para actualizar el tamaño de pantalla
  const updateScreenSize = useCallback(() => {
    setScreenSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  // Función para actualizar la orientación
  const updateOrientation = useCallback(() => {
    const newOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    setOrientation(newOrientation);
  }, []);

  // Función para actualizar la posición de scroll
  const updateScrollPosition = useCallback(() => {
    const scrollY = window.scrollY;
    setScrollPosition(scrollY);
    setIsScrolled(scrollY > 20);
  }, []);

  // Efecto para rastrear el redimensionamiento
  useEffect(() => {
    if (!trackResize) return;

    const handleResize = () => {
      updateScreenSize();
      if (trackOrientation) {
        updateOrientation();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [trackResize, trackOrientation, updateScreenSize, updateOrientation]);

  // Efecto para rastrear la orientación
  useEffect(() => {
    if (!trackOrientation) return;

    const handleOrientationChange = () => {
      updateOrientation();
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    return () => window.removeEventListener('orientationchange', handleOrientationChange);
  }, [trackOrientation, updateOrientation]);

  // Efecto para rastrear el scroll
  useEffect(() => {
    if (!trackScroll) return;

    const handleScroll = () => {
      updateScrollPosition();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackScroll, updateScrollPosition]);

  // Valores computados
  const breakpoint = useMemo(() => getCurrentBreakpoint(screenSize.width), [screenSize.width]);
  const deviceType = useMemo(() => {
    if (isMobile(screenSize.width)) return 'mobile';
    if (isTablet(screenSize.width)) return 'tablet';
    if (isDesktop(screenSize.width)) return 'desktop';
    return 'unknown';
  }, [screenSize.width]);

  const isMobileDevice = useMemo(() => isMobile(screenSize.width), [screenSize.width]);
  const isTabletDevice = useMemo(() => isTablet(screenSize.width), [screenSize.width]);
  const isDesktopDevice = useMemo(() => isDesktop(screenSize.width), [screenSize.width]);

  const isSmallScreen = useMemo(() => screenSize.width < BREAKPOINTS.md, [screenSize.width]);
  const isMediumScreen = useMemo(() => 
    screenSize.width >= BREAKPOINTS.md && screenSize.width < BREAKPOINTS.lg, 
    [screenSize.width]
  );
  const isLargeScreen = useMemo(() => screenSize.width >= BREAKPOINTS.lg, [screenSize.width]);

  const isPortrait = useMemo(() => orientation === 'portrait', [orientation]);
  const isLandscape = useMemo(() => orientation === 'landscape', [orientation]);

  // Funciones de utilidad
  const getResponsiveValue = useCallback((values) => {
    if (typeof values === 'object') {
      if (isMobileDevice && values.mobile !== undefined) return values.mobile;
      if (isTabletDevice && values.tablet !== undefined) return values.tablet;
      if (isDesktopDevice && values.desktop !== undefined) return values.desktop;
      return values.default || values.mobile || values.tablet || values.desktop;
    }
    return values;
  }, [isMobileDevice, isTabletDevice, isDesktopDevice]);

  const getResponsiveClass = useCallback((classes) => {
    if (typeof classes === 'object') {
      const mobileClass = classes.mobile || '';
      const tabletClass = classes.tablet || '';
      const desktopClass = classes.desktop || '';
      
      let result = mobileClass;
      if (isTabletDevice) result += ` ${tabletClass}`;
      if (isDesktopDevice) result += ` ${desktopClass}`;
      
      return result.trim();
    }
    return classes;
  }, [isTabletDevice, isDesktopDevice]);

  const getResponsiveGrid = useCallback((cols) => {
    if (typeof cols === 'object') {
      const { mobile = 1, tablet = 2, desktop = 3 } = cols;
      return `grid-cols-${mobile} sm:grid-cols-${tablet} lg:grid-cols-${desktop}`;
    }
    return `grid-cols-${cols}`;
  }, []);

  const getResponsiveSpacing = useCallback((spacing) => {
    if (typeof spacing === 'object') {
      const { mobile = 2, tablet = 4, desktop = 6 } = spacing;
      return `gap-${mobile} sm:gap-${tablet} lg:gap-${desktop}`;
    }
    return `gap-${spacing}`;
  }, []);

  return {
    // Información básica
    screenSize,
    breakpoint,
    deviceType,
    orientation,
    scrollPosition,
    isScrolled,
    
    // Estados de dispositivo
    isMobile: isMobileDevice,
    isTablet: isTabletDevice,
    isDesktop: isDesktopDevice,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    
    // Estados de orientación
    isPortrait,
    isLandscape,
    
    // Funciones de utilidad
    getResponsiveValue,
    getResponsiveClass,
    getResponsiveGrid,
    getResponsiveSpacing,
    
    // Funciones de actualización
    updateScreenSize,
    updateOrientation,
    updateScrollPosition
  };
};

export default useResponsiveAdvanced;
