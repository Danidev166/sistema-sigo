/**
 * Tabla base reutilizable para la UI de estudiantes.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Filas y celdas de la tabla
 * @returns {JSX.Element}
 *
 * @example
 * <Table><TableHead>...</TableHead><TableBody>...</TableBody></Table>
 */
// src/features/estudiantes/components/ui/Table.jsx
export function Table({ children, className = "" }) {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-gray-300 dark:divide-slate-700 ${className}`}>
        {children}
      </table>
    </div>
  );
}
