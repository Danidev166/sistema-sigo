/**
 * Celda de tabla reutilizable para la UI de estudiantes.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido de la celda
 * @returns {JSX.Element}
 *
 * @example
 * <TableCell>Juan Pérez</TableCell>
 */
// src/features/estudiantes/components/ui/TableCell.jsx
export function TableCell({ children, className = "" }) {
  return (
    <td className={`px-4 py-2 text-sm text-gray-800 dark:text-gray-200 ${className}`}>
      {children}
    </td>
  );
}
