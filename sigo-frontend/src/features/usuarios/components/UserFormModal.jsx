/**
 * Modal de formulario para crear o editar usuarios.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Function} props.onSubmit - Callback para guardar los datos
 * @param {Object} [props.initialData] - Datos iniciales para edición
 * @returns {JSX.Element}
 *
 * @example
 * <UserFormModal isOpen={true} onClose={fn} onSubmit={fn} />
 */
// src/components/ui/UserFormModal.jsx

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

// Función para validar RUT chileno
function validarRut(rut) {
  rut = rut.replace(/\./g, '').replace(/-/g, '');
  if (!/^[0-9kK]+$/.test(rut)) return false;
  let cuerpo = rut.slice(0, -1);
  let dv = rut.slice(-1).toUpperCase();
  let suma = 0, multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplo;
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }
  let dvEsperado = 11 - (suma % 11);
  dvEsperado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
  return dv === dvEsperado;
}
// Función para formatear RUT (sin puntos, con guion)
function formatearRut(rut) {
  rut = rut.replace(/\./g, '').replace(/-/g, '');
  if (rut.length < 2) return rut;
  let cuerpo = rut.slice(0, -1);
  let dv = rut.slice(-1);
  return cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '-' + dv;
}

export default function UserFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const isEdit = !!initialData;

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    rut: "",
    email: "",
    password: "",
    rol: "Orientador",
  });

  const [rutError, setRutError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (isEdit) {
      setForm({ ...initialData, password: "" });
    } else {
      setForm({
        nombre: "",
        apellido: "",
        rut: "",
        email: "",
        password: "",
        rol: "Orientador",
      });
    }
    // Limpiar errores al abrir/cerrar modal
    setRutError("");
    setSubmitError("");
    setIsSubmitting(false);
  }, [initialData, isEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Forzar mayúsculas en campos de texto
    const camposMayus = ['nombre', 'apellido', 'direccion'];
    let newValue = value;
    if (camposMayus.includes(name)) {
      newValue = value.toUpperCase();
    }
    if (name === 'rut') {
      // Formatear automáticamente
      const rutFormateado = formatearRut(newValue.replace(/\./g, '').replace(/-/g, ''));
      setForm((prev) => ({ ...prev, [name]: rutFormateado }));
      // Validar
      if (rutFormateado.length >= 3 && !validarRut(rutFormateado)) {
        setRutError('RUT inválido');
      } else {
        setRutError('');
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: newValue }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    
    // Validar campos requeridos
    if (!form.nombre.trim()) {
      setSubmitError("El nombre es requerido");
      return;
    }
    if (!form.apellido.trim()) {
      setSubmitError("El apellido es requerido");
      return;
    }
    if (!form.rut.trim()) {
      setSubmitError("El RUT es requerido");
      return;
    }
    if (!form.email.trim()) {
      setSubmitError("El email es requerido");
      return;
    }
    if (!isEdit && !form.password.trim()) {
      setSubmitError("La contraseña es requerida");
      return;
    }
    
    // Validar RUT
    if (rutError || !validarRut(form.rut)) {
      setRutError('RUT inválido');
      setSubmitError("El RUT ingresado no es válido");
      return;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setSubmitError("El email no tiene un formato válido");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Forzar mayúsculas antes de enviar
      const camposMayus = ['nombre', 'apellido'];
      const formMayus = { ...form };
      camposMayus.forEach((campo) => {
        if (formMayus[campo]) formMayus[campo] = formMayus[campo].toUpperCase();
      });
      
      console.log("Enviando datos del usuario:", formMayus);
      await onSubmit(formMayus);
    } catch (error) {
      console.error("Error al enviar formulario:", error);
      setSubmitError("Error al guardar el usuario. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-4 sm:p-6 border border-gray-200 dark:border-slate-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
        >
          <X size={20} />
        </button>

        <Dialog.Title className="text-xl font-bold text-center text-gray-800 dark:text-white mb-6">
          {isEdit ? "Editar Usuario" : "Agregar Usuario"}
        </Dialog.Title>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mensaje de error general */}
          {submitError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{submitError}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["nombre", "apellido"].map((campo) => (
              <div key={campo}>
                <label htmlFor={campo} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {campo.charAt(0).toUpperCase() + campo.slice(1)}
                </label>
                <input
                  id={campo}
                  name={campo}
                  value={form[campo]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            ))}
          </div>

          {["rut", "email"].map((campo) => (
            <div key={campo}>
              <label htmlFor={campo} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {campo.toUpperCase()}
              </label>
              <input
                id={campo}
                name={campo}
                type={campo === "email" ? "email" : "text"}
                value={form[campo]}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${campo === 'rut' && rutError ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500`}
                required
              />
              {campo === 'rut' && rutError && (
                <span className="text-xs text-red-600">{rutError}</span>
              )}
            </div>
          ))}

          {!isEdit && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="rol" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Rol
            </label>
            <select
              id="rol"
              name="rol"
              value={form.rol}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Admin">Admin</option>
              <option value="Orientador">Orientador</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white transition text-sm ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isEdit ? "Guardando..." : "Creando..."}
                </div>
              ) : (
                isEdit ? "Guardar" : "Crear Usuario"
              )}
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
