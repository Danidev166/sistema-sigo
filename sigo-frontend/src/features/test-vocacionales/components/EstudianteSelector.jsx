/**
 * Componente mejorado para seleccionar un estudiante para generar QR
 * Incluye filtro inteligente de cursos y búsqueda avanzada
 * 
 * @component
 * @param {Function} props.onSelect - Callback cuando se selecciona un estudiante
 * @param {Function} props.onClose - Función para cerrar el modal
 * @returns {JSX.Element}
 */
import { useState, useEffect } from 'react';
import { X, Search, User, GraduationCap, Filter, Users } from 'lucide-react';
import SmartCourseFilter from '../../../components/ui/SmartCourseFilter';
import { getCursoColor } from '../../estudiantes/constants/cursos';
import api from '../../../services/axios';

const EstudianteSelector = ({ onSelect, onClose }) => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  
  // Estados para filtros inteligentes
  const [cursosSeleccionados, setCursosSeleccionados] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  // Manejar cambio de cursos seleccionados
  const handleCursosChange = (nuevosCursos) => {
    setCursosSeleccionados(nuevosCursos);
  };

  // Lógica de filtrado mejorada
  const estudiantesFiltrados = estudiantes.filter(estudiante => {
    // Filtro por búsqueda de texto
    const matchesSearch = search === '' || 
      `${estudiante.nombre} ${estudiante.apellido}`.toLowerCase().includes(search.toLowerCase()) ||
      estudiante.rut?.toLowerCase().includes(search.toLowerCase()) ||
      estudiante.curso?.toLowerCase().includes(search.toLowerCase());
    
    // Filtro por cursos seleccionados
    const matchesCursos = cursosSeleccionados.length === 0 || 
      cursosSeleccionados.includes(estudiante.curso);
    
    // Filtro por estado
    const matchesEstado = filtroEstado === '' || 
      estudiante.estado === filtroEstado;
    
    return matchesSearch && matchesCursos && matchesEstado;
  });

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

        {/* Filtros mejorados */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700 space-y-4">
          {/* Búsqueda por texto */}
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

          {/* Filtros inteligentes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Filtro inteligente de cursos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filtrar por Cursos
              </label>
              <SmartCourseFilter
                estudiantes={estudiantes}
                cursosSeleccionados={cursosSeleccionados}
                onCursosChange={handleCursosChange}
                showEnvioMasivo={false}
              />
            </div>
            
            {/* Filtro de estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estado del Estudiante
              </label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:text-white"
              >
                <option value="">Todos los estados</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          {/* Información de filtros activos */}
          {(cursosSeleccionados.length > 0 || filtroEstado || search) && (
            <div className="flex flex-wrap gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Filtros activos:
              </span>
              {search && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  Búsqueda: "{search}"
                </span>
              )}
              {cursosSeleccionados.length > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200">
                  {cursosSeleccionados.length} curso{cursosSeleccionados.length !== 1 ? 's' : ''}
                </span>
              )}
              {filtroEstado && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200">
                  Estado: {filtroEstado}
                </span>
              )}
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200">
                <Users className="w-3 h-3 mr-1" />
                {estudiantesFiltrados.length} estudiante{estudiantesFiltrados.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
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
                  className="w-full p-4 text-left bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg transition-colors border border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-800 dark:text-white">
                          {estudiante.nombre} {estudiante.apellido}
                        </h3>
                        {estudiante.estado && (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            estudiante.estado === 'Activo' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {estudiante.estado}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <span>RUT: {estudiante.rut || 'No especificado'}</span>
                        {estudiante.curso && (
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getCursoColor(estudiante.curso)}`}>
                            <GraduationCap className="h-3 w-3" />
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


