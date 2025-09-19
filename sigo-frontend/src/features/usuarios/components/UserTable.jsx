import { useState, useMemo, memo, useCallback } from "react";
import { PencilIcon, TrashIcon, Search, Filter, X } from "lucide-react";

/**
 * Componente de tabla para mostrar usuarios del sistema.
 *
 * @param {Object} props
 * @param {Array} props.usuarios - Lista de usuarios
 * @param {Function} props.onEdit - Callback para editar
 * @param {Function} props.onDelete - Callback para eliminar
 * @param {Function} props.onToggleEstado - Callback para cambiar estado
 * @returns {JSX.Element}
 *
 * @example
 * <UserTable usuarios={[]} onEdit={fn} onDelete={fn} onToggleEstado={fn} />
 */
const UserTable = memo(({ usuarios, onEdit, onDelete, onToggleEstado }) => {
  const [search, setSearch] = useState("");
  const [filterRol, setFilterRol] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const usuariosFiltrados = useMemo(() => {
    let filtered = Array.isArray(usuarios) ? usuarios : [];

    if (search) {
      filtered = filtered.filter((user) =>
        `${user.nombre} ${user.apellido}`.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterRol) {
      filtered = filtered.filter((user) => user.rol === filterRol);
    }

    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];

        // Para evitar errores en undefined o booleanos convertimos a string lowercase
        aValue = aValue !== undefined ? String(aValue).toLowerCase() : "";
        bValue = bValue !== undefined ? String(bValue).toLowerCase() : "";

        return sortAsc ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      });
    }

    return filtered;
  }, [usuarios, search, filterRol, sortBy, sortAsc]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
  };

  const hasActiveFilters = search || filterRol;

  return (
    <div className="space-y-6">
      {/* Filtro y búsqueda */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition"
          aria-label="Abrir filtros"
        >
          <Filter className="w-5 h-5 text-gray-600 dark:text-white" />
        </button>
        {hasActiveFilters && (
          <button
            onClick={() => {
              setSearch("");
              setFilterRol("");
            }}
            className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition"
            aria-label="Limpiar filtros"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-white" />
          </button>
        )}
      </div>

      {isFilterOpen && (
        <div className="p-4 rounded-lg border bg-gray-50 dark:bg-slate-800 dark:border-slate-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="filterRol">
            Filtrar por rol
          </label>
          <select
            id="filterRol"
            value={filterRol}
            onChange={(e) => setFilterRol(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los roles</option>
            <option value="Admin">Admin</option>
            <option value="Orientador">Orientador</option>
          </select>
        </div>
      )}

      {/* Vista móvil */}
      <div className="md:hidden space-y-4">
        {usuariosFiltrados.length > 0 ? (
          usuariosFiltrados.map((user) => (
            <div
              key={user.id}
              className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border border-gray-200 dark:border-slate-700 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {user.nombre} {user.apellido}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300">{user.email}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    user.rol === "Admin"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {user.rol}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 flex justify-between">
                <span>RUT: {user.rut}</span>
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium ${
                    user.estado
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.estado ? "Activo" : "Inactivo"}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-slate-700">
                <button
                  onClick={() => onToggleEstado(user)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Cambiar Estado
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="p-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-md"
                    title="Editar"
                    aria-label={`Editar usuario ${user.nombre} ${user.apellido}`}
                  >
                    <PencilIcon size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(user)}
                    className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md"
                    title="Eliminar"
                    aria-label={`Eliminar usuario ${user.nombre} ${user.apellido}`}
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-300">No hay usuarios registrados.</p>
        )}
      </div>

      {/* Vista escritorio */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 dark:border-slate-700">
        <table className="w-full text-sm text-left bg-white dark:bg-slate-800">
          <thead className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 uppercase">
            <tr>
              <th
                onClick={() => handleSort("nombre")}
                className="px-4 py-3 cursor-pointer select-none"
                title="Ordenar por nombre"
              >
                Nombre
              </th>
              <th className="px-4 py-3">RUT</th>
              <th className="px-4 py-3">Email</th>
              <th
                onClick={() => handleSort("rol")}
                className="px-4 py-3 cursor-pointer select-none"
                title="Ordenar por rol"
              >
                Rol
              </th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.length > 0 ? (
              usuariosFiltrados.map((user) => (
                <tr
                  key={user.id}
                  className="border-t dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                >
                  <td className="px-4 py-3">{user.nombre} {user.apellido}</td>
                  <td className="px-4 py-3">{user.rut}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.rol === "Admin"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.rol}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.estado
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.estado ? "Activo" : "Inactivo"}
                    </span>
                    <div>
                      <button
                        onClick={() => onToggleEstado(user)}
                        className="mt-1 text-sm text-blue-600 hover:underline"
                      >
                        Cambiar Estado
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(user)}
                        className="p-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-md"
                        title="Editar"
                        aria-label={`Editar usuario ${user.nombre} ${user.apellido}`}
                      >
                        <PencilIcon size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(user)}
                        className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md"
                        title="Eliminar"
                        aria-label={`Eliminar usuario ${user.nombre} ${user.apellido}`}
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500 dark:text-gray-300">
                  No hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});

// Agregar displayName para debugging
UserTable.displayName = 'UserTable';

export default UserTable;
