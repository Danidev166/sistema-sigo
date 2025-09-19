/**
 * Componente para seleccionar un estudiante para generar QR
 * 
 * @component
 * @param {Function} props.onSelect - Callback cuando se selecciona un estudiante
 * @param {Function} props.onClose - Función para cerrar el modal
 * @returns {JSX.Element}
 */
import { useState, useEffect } from 'react';
import { X, Search, User, GraduationCap } from 'lucide-react';
import api from '../../../services/axios';

const EstudianteSelector = ({ onSelect, onClose }) => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  const cargarEstudiantes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/estudiantes');
      setEstudiantes(response.data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar estudiantes:', err);
      setError('Error al cargar la lista de estudiantes');
    } finally {
      setLoading(false);
    }
  };

  const estudiantesFiltrados = estudiantes.filter(estudiante =>
    `${estudiante.nombre} ${estudiante.apellido}`.toLowerCase().includes(search.toLowerCase()) ||
    estudiante.rut?.toLowerCase().includes(search.toLowerCase()) ||
    estudiante.curso?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (estudiante) => {
    onSelect(estudiante);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Seleccionar Estudiante
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, RUT o curso..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Cargando estudiantes...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={cargarEstudiantes}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Reintentar
              </button>
            </div>
          ) : estudiantesFiltrados.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">
                {search ? 'No se encontraron estudiantes' : 'No hay estudiantes registrados'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {estudiantesFiltrados.map((estudiante) => (
                <button
                  key={estudiante.id}
                  onClick={() => handleSelect(estudiante)}
                  className="w-full p-4 text-left bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 dark:text-white">
                        {estudiante.nombre} {estudiante.apellido}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>RUT: {estudiante.rut || 'No especificado'}</span>
                        {estudiante.curso && (
                          <span className="flex items-center space-x-1">
                            <GraduationCap className="h-4 w-4" />
                            <span>{estudiante.curso}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EstudianteSelector;


