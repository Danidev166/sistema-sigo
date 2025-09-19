/**
 * Cuerpo de tabla reutilizable para la UI de estudiantes.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Filas de la tabla
 * @returns {JSX.Element}
 *
 * @example
 * <TableBody><tr>...</tr></TableBody>
 */
// src/features/estudiantes/components/ui/TableBody.jsx
export function TableBody({ children }) {
  return (
    <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
      {children}
    </tbody>
  );
}
