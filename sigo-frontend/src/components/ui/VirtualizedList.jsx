import React, { useState, useMemo, useRef, useEffect } from 'react';

/**
 * Componente de Lista Virtualizada
 * 
 * Optimiza el rendimiento de listas largas renderizando
 * solo los elementos visibles en el viewport.
 */
export default function VirtualizedList({
  items = [],
  itemHeight = 50,
  containerHeight = 400,
  renderItem,
  className = '',
  overscan = 5
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  // Calcular elementos visibles
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length
    );

    return items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index,
      top: (startIndex + index) * itemHeight
    }));
  }, [items, itemHeight, containerHeight, scrollTop, overscan]);

  const totalHeight = items.length * itemHeight;

  // Manejar scroll
  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item) => (
          <div
            key={item.index}
            style={{
              position: 'absolute',
              top: item.top,
              left: 0,
              right: 0,
              height: itemHeight
            }}
          >
            {renderItem(item, item.index)}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Hook para usar con VirtualizedList
 */
export function useVirtualizedList(items, itemHeight, containerHeight) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    
    return items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index,
      top: (startIndex + index) * itemHeight
    }));
  }, [items, itemHeight, containerHeight, scrollTop]);
  
  const totalHeight = items.length * itemHeight;
  
  return {
    visibleItems,
    totalHeight,
    setScrollTop
  };
}
