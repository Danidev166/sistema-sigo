import React, { memo, useMemo, useCallback, useState } from 'react';
import { useSearchOptimization } from '../../utils/performance';
import VirtualizedList from '../ui/VirtualizedList';

/**
 * Tabla de Datos Optimizada
 * 
 * Características de optimización:
 * - Virtualización para listas largas
 * - Búsqueda optimizada
 * - Paginación eficiente
 * - Memoización de componentes
 */
const DataTableOptimized = memo(({
  data = [],
  columns = [],
  onRowClick,
  onEdit,
  onDelete,
  searchable = true,
  virtualized = false,
  pageSize = 50
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  // Búsqueda optimizada
  const { query, setQuery, results, isSearching } = useSearchOptimization(
    useCallback(async (searchQuery) => {
      if (!searchQuery.trim()) return data;
      
      return data.filter(item => 
        columns.some(column => {
          const value = item[column.key];
          return value?.toString().toLowerCase().includes(searchQuery.toLowerCase());
        })
      );
    }, [data, columns]),
    300
  );

  // Datos procesados con paginación y ordenamiento
  const processedData = useMemo(() => {
    let filteredData = results.length > 0 ? results : data;
    
    // Ordenamiento
    if (sortField) {
      filteredData = [...filteredData].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    // Paginación
    if (!virtualized) {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return filteredData.slice(startIndex, endIndex);
    }
    
    return filteredData;
  }, [results, data, sortField, sortDirection, currentPage, pageSize, virtualized]);

  // Handlers memoizados
  const handleSort = useCallback((field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  const handleRowClick = useCallback((item) => {
    onRowClick?.(item);
  }, [onRowClick]);

  const handleEdit = useCallback((item, e) => {
    e.stopPropagation();
    onEdit?.(item);
  }, [onEdit]);

  const handleDelete = useCallback((item, e) => {
    e.stopPropagation();
    onDelete?.(item);
  }, [onDelete]);

  // Renderizar fila
  const renderRow = useCallback((item, index) => (
    <tr
      key={item.id || index}
      className="hover:bg-gray-50 cursor-pointer"
      onClick={() => handleRowClick(item)}
    >
      {columns.map(column => (
        <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {column.render ? column.render(item[column.key], item) : item[column.key]}
        </td>
      ))}
      {(onEdit || onDelete) && (
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex space-x-2">
            {onEdit && (
              <button
                onClick={(e) => handleEdit(item, e)}
                className="text-blue-600 hover:text-blue-900"
              >
                Editar
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => handleDelete(item, e)}
                className="text-red-600 hover:text-red-900"
              >
                Eliminar
              </button>
            )}
          </div>
        </td>
      )}
    </tr>
  ), [columns, handleRowClick, handleEdit, handleDelete, onEdit, onDelete]);

  const totalPages = Math.ceil((results.length > 0 ? results : data).length / pageSize);

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda */}
      {searchable && (
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
            </div>
          )}
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(column => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {sortField === column.key && (
                      <span className="text-blue-500">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {virtualized ? (
              <VirtualizedList
                items={processedData}
                itemHeight={60}
                containerHeight={400}
                renderItem={renderRow}
              />
            ) : (
              processedData.map((item, index) => renderRow(item, index))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {!virtualized && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {((currentPage - 1) * pageSize) + 1} a {Math.min(currentPage * pageSize, (results.length > 0 ? results : data).length)} de {(results.length > 0 ? results : data).length} resultados
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="px-3 py-1">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

DataTableOptimized.displayName = 'DataTableOptimized';

export default DataTableOptimized;
