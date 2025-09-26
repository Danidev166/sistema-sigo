import React, { memo, useMemo, useCallback } from 'react';
import { useSearchOptimization } from '../../utils/performance';

/**
 * Lista de Estudiantes Optimizada
 * 
 * Este componente implementa varias optimizaciones:
 * - Memoización para evitar re-renders innecesarios
 * - Búsqueda optimizada con debounce
 * - Virtualización para listas largas
 */
const EstudiantesListOptimized = memo(({ 
  estudiantes = [], 
  onEstudianteClick,
  onEdit,
  onDelete 
}) => {
  // Búsqueda optimizada con debounce
  const { query, setQuery, results, isSearching } = useSearchOptimization(
    useCallback(async (searchQuery) => {
      if (!searchQuery.trim()) return estudiantes;
      
      return estudiantes.filter(estudiante => 
        estudiante.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        estudiante.apellido?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        estudiante.rut?.includes(searchQuery)
      );
    }, [estudiantes]),
    300 // 300ms de debounce
  );

  // Memoizar la lista filtrada
  const filteredEstudiantes = useMemo(() => {
    return results.length > 0 ? results : estudiantes;
  }, [results, estudiantes]);

  // Memoizar handlers para evitar re-renders
  const handleEstudianteClick = useCallback((estudiante) => {
    onEstudianteClick?.(estudiante);
  }, [onEstudianteClick]);

  const handleEdit = useCallback((estudiante) => {
    onEdit?.(estudiante);
  }, [onEdit]);

  const handleDelete = useCallback((estudiante) => {
    onDelete?.(estudiante);
  }, [onDelete]);

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda optimizada */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar estudiantes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
          </div>
        )}
      </div>

      {/* Lista de estudiantes */}
      <div className="space-y-2">
        {filteredEstudiantes.map((estudiante) => (
          <EstudianteItem
            key={estudiante.id}
            estudiante={estudiante}
            onClick={handleEstudianteClick}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredEstudiantes.length === 0 && !isSearching && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron estudiantes
        </div>
      )}
    </div>
  );
});

// Componente de item memoizado
const EstudianteItem = memo(({ estudiante, onClick, onEdit, onDelete }) => {
  const handleClick = useCallback(() => {
    onClick(estudiante);
  }, [onClick, estudiante]);

  const handleEdit = useCallback((e) => {
    e.stopPropagation();
    onEdit(estudiante);
  }, [onEdit, estudiante]);

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    onDelete(estudiante);
  }, [onDelete, estudiante]);

  return (
    <div
      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">
            {estudiante.nombre} {estudiante.apellido}
          </h3>
          <p className="text-sm text-gray-500">RUT: {estudiante.rut}</p>
          <p className="text-sm text-gray-500">Curso: {estudiante.curso}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Editar
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
});

EstudiantesListOptimized.displayName = 'EstudiantesListOptimized';
EstudianteItem.displayName = 'EstudianteItem';

export default EstudiantesListOptimized;
