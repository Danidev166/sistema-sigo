// src/features/estudiantes/components/EstudianteFormModal.jsx
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import SelectField from "./SelectField";
import { OPCIONES_CURSOS } from "../constants/cursos";

export default function EstudianteFormModal({
  isOpen,
  onClose,
  onSubmit,
  estudiante = null,
}) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    rut: "",
    email: "",
    telefono: "",
    direccion: "",
    fechaNacimiento: "",
    curso: "",
    especialidad: "",
    situacion_economica: "",
    estado: "Activo",
    nombreApoderado: "",
    telefonoApoderado: "",
    emailApoderado: "",
  });


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rutError, setRutError] = useState("");

  useEffect(() => {
    if (estudiante) {
      setFormData(estudiante);
    }
  }, [estudiante]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'rut') {
      // Formatear automáticamente el RUT
      const rutFormateado = formatearRut(value.replace(/\./g, '').replace(/-/g, ''));
      setFormData((prev) => ({ ...prev, [name]: rutFormateado }));
      // Validar
      if (rutFormateado.length >= 3 && !validarRut(rutFormateado)) {
        setRutError('RUT inválido');
      } else {
        setRutError('');
      }
    } else {
      // Para otros campos, aplicar mayúsculas si es necesario
      const camposMayus = ['nombre', 'apellido', 'direccion', 'situacion_economica', 'nombreApoderado'];
      const newValue = camposMayus.includes(name) ? value.toUpperCase() : value;
      setFormData((prev) => ({ ...prev, [name]: newValue }));
    }
  };

  // Componente de input simple memoizado
  const SimpleInput = useMemo(() => {
    return ({ label, name, type = "text", value, onChange, required = false, error }) => {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
          <input
            type={type}
            name={name}
            value={value || ''}
            onChange={onChange}
            required={required}
            className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm`}
          />
          {error && <span className="text-xs text-red-600 mt-1 block">{error}</span>}
        </div>
      );
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rutError) return;
    if (!validarRut(formData.rut)) {
      setRutError('RUT inválido');
      return;
    }
    
    // Validar campos requeridos
    if (!formData.fechaNacimiento) {
      toast.error('La fecha de nacimiento es requerida');
      return;
    }
    
    // Forzar mayúsculas antes de enviar
    const camposMayus = ['nombre', 'apellido', 'direccion', 'curso', 'especialidad', 'situacion_economica', 'nombreApoderado'];
    const formMayus = { ...formData };
    camposMayus.forEach((campo) => {
      if (formMayus[campo]) formMayus[campo] = formMayus[campo].toUpperCase();
    });
    
    console.log('Datos a enviar:', formMayus); // Debug
    
    setIsSubmitting(true);
    try {
      await onSubmit(formMayus);
      onClose();
      toast.success(estudiante ? "Estudiante actualizado" : "Estudiante registrado");
    } catch (error) {
      toast.error("Error al guardar el estudiante");
      console.error(error);
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
      <div className="relative z-10 w-full max-w-3xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-4 sm:p-6 border border-gray-200 dark:border-slate-700 max-h-screen overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
        >
          <X size={20} />
        </button>
        <Dialog.Title className="text-xl font-bold text-center text-gray-800 dark:text-white mb-6">
          {estudiante ? "Editar Estudiante" : "Agregar Estudiante"}
        </Dialog.Title>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SimpleInput label="Nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
            <SimpleInput label="Apellido" name="apellido" value={formData.apellido} onChange={handleInputChange} required />
            <SimpleInput label="RUT" name="rut" value={formData.rut} onChange={handleInputChange} required error={rutError} />
            <SimpleInput type="email" label="Email" name="email" value={formData.email} onChange={handleInputChange} required />
            <SelectField
              label="Curso"
              name="curso"
              value={formData.curso}
              onChange={handleInputChange}
              options={OPCIONES_CURSOS}
              required
            />
            <SimpleInput type="date" label="Fecha de Nacimiento" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleInputChange} required />
            <SimpleInput label="Teléfono" name="telefono" value={formData.telefono} onChange={handleInputChange} />
            <div className="lg:col-span-2">
              <SimpleInput label="Dirección" name="direccion" value={formData.direccion} onChange={handleInputChange} />
            </div>
          </div>
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Información del Apoderado
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <SimpleInput label="Nombre del Apoderado" name="nombreApoderado" value={formData.nombreApoderado} onChange={handleInputChange} />
              <SimpleInput label="Teléfono del Apoderado" name="telefonoApoderado" value={formData.telefonoApoderado} onChange={handleInputChange} />
              <SimpleInput type="email" label="Email del Apoderado" name="emailApoderado" value={formData.emailApoderado} onChange={handleInputChange} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SimpleInput label="Situación Económica" name="situacion_economica" value={formData.situacion_economica} onChange={handleInputChange} />
            <SelectField
              label="Estado"
              name="estado"
              value={formData.estado}
              onChange={handleInputChange}
              options={[
                { value: "Activo", label: "Activo" },
                { value: "Inactivo", label: "Inactivo" },
              ]}
            />
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
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm"
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}

