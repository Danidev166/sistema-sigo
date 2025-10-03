/**
 * Componente de tabla para mostrar seguimientos académicos del estudiante.
 *
 * @param {Object} props
 * @param {Array} props.registros - Lista de seguimientos académicos
 * @param {Function} props.onEdit - Callback para editar
 * @param {Function} props.onDelete - Callback para eliminar
 * @param {Function} props.onExport - Callback para exportar
 * @returns {JSX.Element}
 *
 * @example
 * <SeguimientoTable registros={[]} onEdit={fn} onDelete={fn} onExport={fn} />
 */
// src/features/estudiantes/components/academico/SeguimientoTable.jsx
import { Pencil, Trash2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { format } from "date-fns";
import EnhancedTable from "../../../../components/ui/EnhancedTable";

export default function SeguimientoTable({ registros, onEdit, onDelete, onExport }) {
  const columns = [
    {
      key: 'asignatura',
      label: 'Asignatura',
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className="font-medium text-gray-900 dark:text-white">{value}</span>
      )
    },
    {
      key: 'nota',
      label: 'Nota',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            value >= 6 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
            value >= 4 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
            'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
          }`}>
            {value}
          </span>
        </div>
      )
    },
    {
      key: 'promedio_curso',
      label: 'Promedio Curso',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-600 dark:text-gray-400">{value}</span>
          {value && (
            <div className="flex items-center text-xs text-gray-500">
              {value > 5 ? <TrendingUp className="w-3 h-3 text-green-500" /> :
               value < 4 ? <TrendingDown className="w-3 h-3 text-red-500" /> :
               <Minus className="w-3 h-3 text-gray-400" />}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'fecha',
      label: 'Fecha',
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className="text-gray-600 dark:text-gray-400">
          {format(new Date(value), "dd/MM/yyyy")}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      sortable: false,
      filterable: false,
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(row)}
            className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
            title="Editar seguimiento"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(row)}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Eliminar seguimiento"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const handleExport = (data) => {
    if (onExport) {
      onExport(data);
    } else {
      // Exportación por defecto a CSV
      const csvContent = [
        ['Asignatura', 'Nota', 'Promedio Curso', 'Fecha'],
        ...data.map(item => [
          item.asignatura,
          item.nota,
          item.promedio_curso,
          format(new Date(item.fecha), "dd/MM/yyyy")
        ])
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `seguimiento-academico-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <EnhancedTable
      data={registros}
      columns={columns}
      searchable={true}
      sortable={true}
      filterable={true}
      pagination={true}
      itemsPerPage={10}
      onExport={handleExport}
      emptyMessage="No hay registros de seguimiento académico"
    />
  );
}
