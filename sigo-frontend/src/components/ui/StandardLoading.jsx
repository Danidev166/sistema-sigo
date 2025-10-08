import React from 'react';
import LoadingSpinner, { PageLoader, CardLoader, ButtonLoader, TableLoader, ChartLoader } from './LoadingSpinner';

/**
 * Componente de loading estandarizado que usa el sistema unificado
 * Mantiene compatibilidad con OptimizedLoading pero con mejor consistencia
 */
const StandardLoading = ({ 
  type = 'default', 
  message = 'Cargando...', 
  size = 'md',
  showIcon = true,
  className = '',
  centered = false
}) => {
  // Para tipos específicos, usar componentes especializados
  if (type === 'page') {
    return <PageLoader text={message} />;
  }
  
  if (type === 'card') {
    return <CardLoader text={message} />;
  }
  
  if (type === 'button') {
    return <ButtonLoader text={message} />;
  }
  
  if (type === 'table') {
    return <TableLoader />;
  }
  
  if (type === 'chart') {
    return <ChartLoader />;
  }

  // Para el tipo default, usar LoadingSpinner
  return (
    <LoadingSpinner
      size={size}
      text={message}
      className={className}
      centered={centered}
      color="blue"
    />
  );
};

export default StandardLoading;
export { PageLoader, CardLoader, ButtonLoader, TableLoader, ChartLoader };
