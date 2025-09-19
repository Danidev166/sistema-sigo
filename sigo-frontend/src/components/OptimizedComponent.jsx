import { memo, useCallback, useMemo, Suspense, lazy } from 'react';
import OptimizedImage from './OptimizedImage';
import { useOptimizedApi } from '../hooks/useOptimizedApi';

// Lazy load para componentes pesados
const HeavyDataComponent = lazy(() => import('./HeavyDataComponent'));

/**
 * Componente optimizado con memoización y cache inteligente
 * 
 * @param {Object} props
 * @param {string} props.id - ID del componente
 * @param {string} props.title - Título del componente
 * @param {string} props.imageUrl - URL de la imagen
 * @param {boolean} [props.showHeavyData] - Si mostrar datos pesados
 * @returns {JSX.Element}
 */
const OptimizedComponent = memo(({ id, title, imageUrl, showHeavyData = false }) => {
  // Cache inteligente para datos
  const { data, loading, error, refetch } = useOptimizedApi(
    `component_${id}`,
    async () => {
      const response = await fetch(`/api/data/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return response.json();
    },
    {
      ttl: 10 * 60 * 1000, // 10 minutos
      debounceMs: 300
    }
  );

  // Memoizar datos procesados
  const processedData = useMemo(() => {
    if (!data) return null;
    return { 
      ...data, 
      processed: true,
      processedAt: new Date().toISOString()
    };
  }, [data]);

  // Memoizar handler de click
  const handleClick = useCallback(() => {
    console.log('Component clicked:', id);
    // Refetch data si es necesario
    if (Date.now() - new Date(data?.timestamp || 0).getTime() > 5 * 60 * 1000) {
      refetch();
    }
  }, [id, data?.timestamp, refetch]);

  // Memoizar clases CSS
  const containerClasses = useMemo(() => 
    "p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer",
    []
  );

  const titleClasses = useMemo(() => 
    "text-lg font-semibold text-gray-800 dark:text-white mb-2",
    []
  );

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-200 dark:bg-slate-700 h-36 rounded-lg shadow-sm">
        <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 px-4 py-2 rounded">
        Error al cargar los datos
        <button 
          onClick={refetch}
          className="ml-2 underline hover:no-underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div onClick={handleClick} className={containerClasses}>
      <h2 className={titleClasses}>{title}</h2>

      <OptimizedImage
        src={imageUrl}
        alt={title}
        width={400}
        height={300}
        className="w-full h-48 object-cover rounded-md"
      />

      {processedData && (
        <div className="mt-4 bg-gray-50 dark:bg-slate-700 p-3 rounded text-sm text-gray-700 dark:text-gray-200 overflow-auto max-h-60">
          <pre className="text-xs">{JSON.stringify(processedData, null, 2)}</pre>
        </div>
      )}

      {showHeavyData && (
        <Suspense fallback={<div className="mt-4 h-20 bg-gray-100 dark:bg-slate-600 rounded animate-pulse"></div>}>
          <HeavyDataComponent data={processedData} />
        </Suspense>
      )}
    </div>
  );
});

OptimizedComponent.displayName = 'OptimizedComponent';

export default OptimizedComponent;
