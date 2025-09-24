import { useState, useEffect } from 'react';

/**
 * Hook personalizado para detectar el tamaño de pantalla y proporcionar utilidades responsivas
 * 
 * @returns {Object} Objeto con información sobre el tamaño de pantalla y utilidades
 */
export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  const [breakpoint, setBreakpoint] = useState('lg');

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const width = screenSize.width;
    
    if (width < 640) {
      setBreakpoint('sm');
    } else if (width < 768) {
      setBreakpoint('md');
    } else if (width < 1024) {
      setBreakpoint('lg');
    } else if (width < 1280) {
      setBreakpoint('xl');
    } else {
      setBreakpoint('2xl');
    }
  }, [screenSize.width]);

  const isMobile = breakpoint === 'sm';
  const isTablet = breakpoint === 'md';
  const isDesktop = breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl';
  const isSmallScreen = breakpoint === 'sm' || breakpoint === 'md';

  return {
    screenSize,
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen,
  };
};

export default useResponsive;
