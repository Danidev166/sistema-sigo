import { useAuth } from "../../../context/useAuth";
import logo from "../../../assets/logo.webp";
import { LogOutIcon } from "lucide-react";

/**
 * Barra superior fija del dashboard.
 *
 * @param {Object} props
 * @param {string} props.title - Título de la página
 * @param {React.ReactNode} [props.children] - Contenido adicional
 * @returns {JSX.Element}
 *
 * @example
 * <FixedTopBar title="Estudiantes" />
 */

export default function FixedTopBar() {
  const { user, logout } = useAuth();

  return (
    <div className="w-full bg-[#0e1a33] text-white flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 sm:px-6 py-3 sm:py-4 gap-y-3 sm:gap-y-0 shadow-md">
      {/* Logo + Nombre sistema */}
      <div className="flex items-center gap-3 sm:gap-4">
        <img
          src={logo}
          alt="Logo SIGO"
          className="w-10 h-10 object-contain rounded-full border border-white"
        />
        <h1 className="text-lg sm:text-xl font-semibold tracking-wide">SIGO</h1>
      </div>

      {/* Bienvenida + Avatar + Logout */}
      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
        {/* Bienvenida */}
        <div className="text-left sm:text-right flex-1 hidden sm:block">
          <p className="text-xs sm:text-sm text-white/80">Bienvenido/a</p>
          <h2 className="text-sm sm:text-md font-semibold truncate">
            {user?.nombre} {user?.apellido}
          </h2>
          <span className="text-xs text-white/60">{user?.rol}</span>
        </div>

        {/* Inicial del usuario */}
        <div className="w-10 h-10 bg-white text-[#0e1a33] font-bold flex items-center justify-center rounded-full shadow-sm">
          {user?.nombre?.charAt(0) || "?"}
        </div>

        {/* Botón salir */}
        <button
          onClick={logout}
          className="text-xs sm:text-sm px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-md flex items-center gap-1 transition"
        >
          <LogOutIcon size={16} />
          <span>Salir</span>
        </button>
      </div>
    </div>
  );
}
