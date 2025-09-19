/**
 * Tarjeta para mostrar evaluaciones vocacionales del estudiante.
 *
 * @param {Object} props
 * @param {Object} props.evaluacion - Datos de la evaluación
 * @param {Function} props.onVerDetalle - Callback para ver detalles
 * @returns {JSX.Element}
 *
 * @example
 * <EvaluacionCard evaluacion={evaluacion} onVerDetalle={fn} />
 */
// src/features/estudiantes/components/evaluaciones/EvaluacionCard.jsx
import React from "react";
import { interpretarResultado } from "../../../test-vocacionales/utils/interpretaciones";

// Mapa de íconos por tipo
const iconoPorTipo = {
  Kuder: "🧩",
  Holland: "🧠",
  Aptitudes: "📊",
};

const colorBadge = {
  Kuder: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200",
  Holland: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
  Aptitudes: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
};

export default function EvaluacionCard({ tipo, fecha, resultados, curso }) {
  console.log("🎯 EvaluacionCard renderizando:", { tipo, fecha, resultados, curso });
  
  let parsedResultados = {};
  try {
    parsedResultados = JSON.parse(resultados);
  } catch (err) {
    console.error("❌ Error al parsear resultados:", err);
    parsedResultados = { error: "⚠️ Resultados en formato inválido." };
  }

  // Obtener interpretación del resultado
  const interpretacion = interpretarResultado(tipo, parsedResultados);

  // Renderizado simplificado temporalmente
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow border border-gray-200 dark:border-slate-700 p-5 hover:shadow-md transition w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-1">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(fecha).toLocaleDateString()}
        </span>
        <span className="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
          {tipo}
        </span>
      </div>
      
      <div className="text-sm text-gray-700 dark:text-gray-100">
        <p><strong>Curso:</strong> {curso}</p>
        <p><strong>Resultados:</strong> {typeof resultados === 'string' ? resultados.substring(0, 100) + '...' : 'N/A'}</p>
        {interpretacion && (
          <p><strong>Perfil:</strong> {interpretacion.tipo}</p>
        )}
      </div>
    </div>
  );
}
