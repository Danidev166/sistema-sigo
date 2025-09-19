/**
 * Página de error 404 (No encontrada).
 *
 * Muestra un mensaje de error cuando la ruta no existe.
 *
 * @component
 * @returns {JSX.Element} Página de error 404
 *
 * @example
 * <Route path="*" element={<NotFoundPage />} />
 */
// src/pages/NotFoundPage.jsx

import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-700 px-4 py-8 sm:py-12 md:py-16 text-center">
      <AlertTriangle 
        size={48} 
        className="text-red-500 mb-3 sm:mb-4 md:mb-6 sm:w-16 sm:h-16 md:w-20 md:h-20" 
      />
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4">
        404 - Página no encontrada
      </h1>
      <p className="mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base md:text-lg text-gray-500 max-w-xs sm:max-w-sm md:max-w-md">
        La página que estás buscando no existe o ha sido movida.
      </p>
      <Link
        to="/"
        className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-blue-700 transition text-sm sm:text-base"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
