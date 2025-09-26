// src/components/layout/DashboardLayout.jsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import Footer from "./Footer";
import MobileMenuButton from "../ui/MobileMenuButton";
import FixedTopBar from "../../features/dashboard/components/FixedTopBar";
import {
  HomeIcon,
  UsersIcon,
  CalendarCheckIcon,
  FileTextIcon,
  BarChart3Icon,
  SettingsIcon,
  UserCogIcon,
  LogOutIcon,
  PackageIcon,
  ArrowRightLeftIcon,
  FileText,
} from "lucide-react";

import { useAuth } from "../../context/useAuth";
;
import { BellIcon } from '@heroicons/react/24/outline';

/**
 * Layout principal del dashboard optimizado
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido del layout
 * @returns {JSX.Element}
 */
export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const isAdmin = user?.rol === "Admin";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => logout();

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar móvil */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="absolute inset-0 bg-black bg-opacity-40" onClick={() => setSidebarOpen(false)}></div>
        <aside className="relative z-50 w-64 bg-gray-900 text-white flex flex-col justify-between h-full">
          <SidebarContent isAdmin={isAdmin} handleLogout={handleLogout} />
        </aside>
      </div>

      {/* Sidebar escritorio */}
      <aside className="hidden lg:flex w-64 bg-gray-900 text-white flex-col justify-between">
        <SidebarContent isAdmin={isAdmin} handleLogout={handleLogout} />
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        <FixedTopBar />
        <MobileMenuButton onClick={() => setSidebarOpen(true)} />
        <main className="flex-1 px-6 py-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
        <Footer />
        {/* ToastContainer removido - Toaster ya está en main.jsx */}
      </div>
    </div>
  );
}

function SidebarContent({ isAdmin, handleLogout }) {
  return (
    <>
      <div>
        <div className="text-center text-2xl font-bold py-6 border-b border-white/10">
          SIGO
        </div>
        <nav className="px-4 py-6 space-y-2">
          <NavItem to="/dashboard" icon={<HomeIcon size={18} />}>Inicio</NavItem>
          <NavItem to="/estudiantes" icon={<UsersIcon size={18} />}>Estudiantes</NavItem>
          <NavItem to="/agenda" icon={<CalendarCheckIcon size={18} />}>Agenda</NavItem>
          <NavItem to="/reportes" icon={<BarChart3Icon size={18} />}>Reportes</NavItem>
          <NavItem to="/evaluaciones" icon={<FileTextIcon size={18} />}>Test Vocacionales</NavItem>
          <NavItem to="/seguimiento-psicosocial" icon={<UserCogIcon size={18} />}>Seguimiento Psicosocial</NavItem>
          <NavItem to="/recursos" icon={<PackageIcon size={18} />}>Recursos</NavItem>
          <NavItem to="/movimientos" icon={<ArrowRightLeftIcon size={18} />}>Movimientos</NavItem>
          <NavItem to="/alertas" icon={<BellIcon className="w-4 h-4" />}>Alertas</NavItem>
          {/* Enlace a Notificaciones */}
          <NavItem to="/notificaciones" icon={<BellIcon className="w-4 h-4" />}>Notificaciones</NavItem>

          {isAdmin && (
            <>
              <NavItem to="/usuarios" icon={<UsersIcon size={18} />}>Usuarios</NavItem>
              <NavItem to="/configuracion" icon={<SettingsIcon size={18} />}>Configuración</NavItem>
              <NavItem to="/logs" icon={<FileText size={18} />}>Logs</NavItem>
            </>
          )}
        </nav>
      </div>
      <div className="px-4 pb-6 space-y-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
        >
          <LogOutIcon size={16} />
          Cerrar sesión
        </button>
        <p className="text-xs text-center text-gray-400">v1.0 · SIGO © 2025</p>
      </div>
    </>
  );
}

function NavItem({ to, icon, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-md font-medium transition ${
          isActive
            ? "bg-gray-800 text-white"
            : "text-gray-400 hover:bg-gray-800 hover:text-white"
        }`
      }
    >
      {icon}
      {children}
    </NavLink>
  );
}
