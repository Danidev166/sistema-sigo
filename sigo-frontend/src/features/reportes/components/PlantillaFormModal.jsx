import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import { X, Plus, Trash2, Settings } from "lucide-react";

const tipos = [
  { value: "Académico", label: "Académico", icon: "📚" },
  { value: "Conducta", label: "Conducta", icon: "👥" },
  { value: "Asistencia", label: "Asistencia", icon: "✅" },
  { value: "Entrevistas", label: "Entrevistas", icon: "💬" },
  { value: "Recursos", label: "Recursos", icon: "📦" },
  { value: "Alertas", label: "Alertas", icon: "⚠️" },
  { value: "Intervenciones", label: "Intervenciones", icon: "🔧" },
];

const columnasDisponibles = [
  { id: "nombre", label: "Nombre Completo", categoria: "Datos Personales" },
  { id: "rut", label: "RUT", categoria: "Datos Personales" },
  { id: "curso", label: "Curso", categoria: "Datos Académicos" },
  { id: "fecha_nacimiento", label: "Fecha de Nacimiento", categoria: "Datos Personales" },
  { id: "email", label: "Email", categoria: "Datos Personales" },
  { id: "telefono", label: "Teléfono", categoria: "Datos Personales" },
  { id: "direccion", label: "Dirección", categoria: "Datos Personales" },
  { id: "nombre_apoderado", label: "Nombre Apoderado", categoria: "Datos Familiares" },
  { id: "telefono_apoderado", label: "Teléfono Apoderado", categoria: "Datos Familiares" },
  { id: "email_apoderado", label: "Email Apoderado", categoria: "Datos Familiares" },
  { id: "fecha_ingreso", label: "Fecha de Ingreso", categoria: "Datos Académicos" },
  { id: "estado", label: "Estado", categoria: "Datos Académicos" },
];

export default function PlantillaFormModal({ isOpen, onClose, onSubmit, plantilla }) {
  const [form, setForm] = useState({
    nombre: "",
    tipo_reporte: "Académico",
    descripcion: "",
    activa: true,
    columnas: ["nombre", "curso"]
  });
  const [error, setError] = useState("");
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  useEffect(() => {
    if (plantilla) {
      let columnas = ["nombre", "curso"];
      try {
        const config = JSON.parse(plantilla.configuracion || "{}");
        columnas = config.columnas || ["nombre", "curso"];
      } catch (e) {
        console.warn("Error parsing configuracion:", e);
      }
      
      setForm({
        nombre: plantilla.nombre || "",
        tipo_reporte: plantilla.tipo_reporte || "Académico",
        descripcion: plantilla.descripcion || "",
        activa: !!plantilla.activa,
        columnas: columnas
      });
    } else {
      setForm({
        nombre: "",
        tipo_reporte: "Académico",
        descripcion: "",
        activa: true,
        columnas: ["nombre", "curso"]
      });
    }
    setError("");
  }, [plantilla, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleColumna = (columnaId) => {
    setForm(prev => ({
      ...prev,
      columnas: prev.columnas.includes(columnaId)
        ? prev.columnas.filter(c => c !== columnaId)
        : [...prev.columnas, columnaId]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    if (!form.tipo_reporte) {
      setError("El tipo de reporte es obligatorio");
      return;
    }
    if (form.columnas.length === 0) {
      setError("Debe seleccionar al menos una columna");
      return;
    }
    
    // Crear configuración JSON automáticamente
    const configuracion = JSON.stringify({
      columnas: form.columnas,
      orden: form.columnas,
      filtros: [],
      agrupaciones: []
    });
    
    setError("");
    onSubmit({
      ...form,
      configuracion
    });
  };

  const columnasAgrupadas = columnasDisponibles.reduce((acc, col) => {
    if (!acc[col.categoria]) acc[col.categoria] = [];
    acc[col.categoria].push(col);
    return acc;
  }, {});

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-4xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
                {plantilla ? "Editar Plantilla" : "Nueva Plantilla de Reporte"}
              </Dialog.Title>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {plantilla ? "Modifica los datos de la plantilla" : "Crea una nueva plantilla para generar reportes"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre de la Plantilla *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Reporte Mensual de Estudiantes"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 dark:text-white transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de Reporte *
                </label>
                <div className="relative">
                  <select
                    name="tipo_reporte"
                    value={form.tipo_reporte}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 dark:text-white appearance-none cursor-pointer"
                    required
                  >
                    {tipos.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.icon} {t.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Describe el propósito de esta plantilla de reporte..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 dark:text-white resize-none"
                rows={3}
              />
            </div>

            {/* Selector de Columnas */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Columnas del Reporte *
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Selecciona las columnas que aparecerán en el reporte
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowColumnSelector(!showColumnSelector)}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  {showColumnSelector ? "Ocultar" : "Configurar"}
                </button>
              </div>

              {/* Columnas Seleccionadas */}
              <div className="flex flex-wrap gap-2 mb-4">
                {form.columnas.map(columnaId => {
                  const columna = columnasDisponibles.find(c => c.id === columnaId);
                  return (
                    <div key={columnaId} className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg text-sm">
                      <span>{columna?.label}</span>
                      <button
                        type="button"
                        onClick={() => toggleColumna(columnaId)}
                        className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-1 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
                {form.columnas.length === 0 && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                    No hay columnas seleccionadas
                  </div>
                )}
              </div>

              {/* Selector de Columnas */}
              {showColumnSelector && (
                <div className="border border-gray-200 dark:border-slate-600 rounded-lg p-4 bg-gray-50 dark:bg-slate-700/50">
                  <div className="space-y-4">
                    {Object.entries(columnasAgrupadas).map(([categoria, columnas]) => (
                      <div key={categoria}>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {categoria}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {columnas.map(columna => (
                            <label
                              key={columna.id}
                              className="flex items-center gap-2 p-2 hover:bg-white dark:hover:bg-slate-600 rounded-lg cursor-pointer transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={form.columnas.includes(columna.id)}
                                onChange={() => toggleColumna(columna.id)}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {columna.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Estado */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <input
                type="checkbox"
                name="activa"
                checked={form.activa}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Plantilla Activa
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Las plantillas activas están disponibles para generar reportes
                </p>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-500 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {plantilla ? "Actualizar Plantilla" : "Crear Plantilla"}
          </button>
        </div>
      </div>
    </Dialog>
  );
} 