import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ImprovedSidebar from "./ImprovedSidebar";
import Footer from "./Footer";
import MobileMenuButton from "../ui/MobileMenuButton";
import { useAuth } from "../../context/useAuth";
;

/**
 * Layout mejorado del dashboard con sidebar optimizado
 */
export default function ImprovedDashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAdmin = user?.rol === "Admin";

  // Cerrar sidebar en móvil al cambiar de ruta
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

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
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900">
      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
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

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top bar simplificado */}
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 dark:border-gray-700/50 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <MobileMenuButton onClick={() => setSidebarOpen(true)} />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">
                  {user?.nombre?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900 dark:text-white">{user?.nombre} {user?.apellido}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">{user?.rol}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido principal */}
        <main className="flex-1 px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <Footer />

        {/* Toast notifications */}
        <!-- ToastContainer removido - Toaster ya está en main.jsx -->
      </div>
    </div>
  );
}
