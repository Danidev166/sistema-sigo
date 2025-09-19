/**
 * Encabezado de tabla reutilizable para la UI de estudiantes.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Celdas de encabezado
 * @returns {JSX.Element}
 *
 * @example
 * <TableHead><th>Nombre</th></TableHead>
 */
// src/features/estudiantes/components/ui/TableHead.jsx
export function TableHead({ children }) {
  return (
    <thead className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-100 text-sm font-semibold">
      {children}
    </thead>
  );
}
