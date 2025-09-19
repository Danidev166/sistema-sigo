/**
 * Fila de tabla reutilizable para la UI de estudiantes.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Celdas de la fila
 * @returns {JSX.Element}
 *
 * @example
 * <TableRow><TableCell>...</TableCell></TableRow>
 */
// src/features/estudiantes/components/ui/TableRow.jsx
export function TableRow({ children }) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
      {children}
    </tr>
  );
}
