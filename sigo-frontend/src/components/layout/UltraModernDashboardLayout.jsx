import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ImprovedSidebar from "./ImprovedSidebar";
import Footer from "./Footer";
import MobileMenuButton from "../ui/MobileMenuButton";
import { useAuth } from "../../context/useAuth";
;

/**
 * Layout ultra-moderno del dashboard con estilos avanzados
 */
export default function UltraModernDashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isAdmin = user?.rol === "Admin";

  // Cerrar sidebar en móvil al cambiar de ruta
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Detectar scroll para efectos dinámicos
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar sidebar al hacer clic fuera en móvil
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && window.innerWidth < 1024) {
        const sidebar = document.querySelector('[data-sidebar]');
        if (sidebar && !sidebar.contains(event.target)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Overlay para móvil con animación */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar mejorado */}
      <ImprovedSidebar
        isAdmin={isAdmin}
        handleLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Contenido principal con efectos modernos */}
      <div className="flex-1 flex flex-col lg:ml-0 transition-all duration-300 ease-in-out">
        {/* Top bar ultra-moderno */}
        <header className={`
          bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl
          border-b border-gray-200/50 dark:border-gray-700/50
          lg:hidden transition-all duration-300 ease-in-out
          ${isScrolled ? 'shadow-lg shadow-gray-200/20 dark:shadow-gray-900/20' : 'shadow-sm'}
        `}>
          <div className="flex items-center justify-between px-4 py-3">
            <MobileMenuButton onClick={() => setSidebarOpen(true)} />
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">
                    {user?.nombre?.charAt(0) || 'U'}
                  </span>
                </div>
                {/* Indicador de estado online */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900 dark:text-white">
                  {user?.nombre} {user?.apellido}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  {user?.rol}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido principal */}
        <main className="flex-1 px-4 py-6 lg:px-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb moderno */}
            <nav className="mb-6 hidden lg:block">
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer transition-colors">
                  Dashboard
                </span>
                <span className="text-gray-300 dark:text-gray-600">/</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {location.pathname.split('/')[1] || 'Inicio'}
                </span>
              </div>
            </nav>

            {/* Contenido principal con animación */}
            <div className="animate-fade-in">
              {children}
            </div>
          </div>
        </main>

        {/* Footer moderno */}
        <Footer />

        {/* Toast notifications con estilos mejorados */}
        {/* ToastContainer removido - Toaster ya está en main.jsx */}
      </div>

    </div>
  );
}
