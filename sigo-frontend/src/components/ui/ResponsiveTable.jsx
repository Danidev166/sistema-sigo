import { memo } from 'react';
import useResponsive from '../../hooks/useResponsive';

/**
 * Componente de tabla responsiva que se adapta automáticamente a diferentes tamaños de pantalla
 * 
 * @param {Object} props
 * @param {Array} props.data - Datos de la tabla
 * @param {Array} props.columns - Configuración de columnas
 * @param {Function} props.onRowClick - Callback para clic en fila
 * @param {boolean} props.loading - Estado de carga
 * @param {string} props.emptyMessage - Mensaje cuando no hay datos
 * @param {string} props.className - Clases CSS adicionales
 * @returns {JSX.Element}
 */
const ResponsiveTable = memo(({ 
  data = [], 
  columns = [], 
  onRowClick = null,
  loading = false,
  emptyMessage = "No hay datos disponibles",
  className = ""
}) => {
  const { isMobile, isTablet } = useResponsive();

  if (loading) {
    return (
      <div className={`bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden ${className}`}>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden ${className}`}>
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          {emptyMessage}
        </div>
      </div>
    );
  }

  // Vista móvil - Cards
  if (isMobile) {
    return (
      <div className={`space-y-4 ${className}`}>
        {data.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-200 dark:border-slate-700 p-4 ${
              onRowClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
            }`}
            onClick={() => onRowClick && onRowClick(row, rowIndex)}
          >
            <div className="space-y-3">
              {columns.map((column, colIndex) => (
                <div key={colIndex} className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {column.label}:
                  </span>
                  <div className="text-sm text-gray-900 dark:text-white text-right flex-1 ml-2">
                    {column.render ? column.render(row[column.key], row, rowIndex) : row[column.key]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Vista tablet/desktop - Tabla tradicional
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${
                    column.align === 'center' ? 'text-center' : 
                    column.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => onRowClick && onRowClick(row, rowIndex)}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white ${
                      column.align === 'center' ? 'text-center' : 
                      column.align === 'right' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {column.render ? column.render(row[column.key], row, rowIndex) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

ResponsiveTable.displayName = 'ResponsiveTable';

export default ResponsiveTable;
