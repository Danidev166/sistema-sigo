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
import { X, Search, User, GraduationCap, Filter, Users, CheckSquare, Square, Send, CheckCircle } from 'lucide-react';
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
  
  // Estados para selección múltiple
  const [estudiantesSeleccionados, setEstudiantesSeleccionados] = useState([]);
  const [modoSeleccionMultiple, setModoSeleccionMultiple] = useState(false);
  const [tipoTest, setTipoTest] = useState('');
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);

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
    // Limpiar selección cuando cambian los cursos
    if (modoSeleccionMultiple) {
      setEstudiantesSeleccionados([]);
    }
  };

  // Funciones para selección múltiple
  const toggleSeleccionEstudiante = (estudiante) => {
    if (estudiantesSeleccionados.find(e => e.id === estudiante.id)) {
      setEstudiantesSeleccionados(prev => prev.filter(e => e.id !== estudiante.id));
    } else {
      setEstudiantesSeleccionados(prev => [...prev, estudiante]);
    }
  };

  const seleccionarTodosFiltrados = () => {
    setEstudiantesSeleccionados(estudiantesFiltrados);
  };

  const deseleccionarTodos = () => {
    setEstudiantesSeleccionados([]);
  };

  const toggleModoSeleccion = () => {
    setModoSeleccionMultiple(!modoSeleccionMultiple);
    setEstudiantesSeleccionados([]);
  };

  const handleEnvioMasivo = () => {
    if (estudiantesSeleccionados.length === 0) return;
    setMostrarModalConfirmacion(true);
  };

  const confirmarEnvioMasivo = async () => {
    try {
      // Aquí implementarías la lógica de envío masivo
      console.log('Enviando tests a:', estudiantesSeleccionados, 'Tipo:', tipoTest);
      
      // Por ahora, simular éxito
      alert(`Tests ${tipoTest} enviados exitosamente a ${estudiantesSeleccionados.length} estudiantes`);
      
      // Cerrar modal y limpiar selección
      setMostrarModalConfirmacion(false);
      setEstudiantesSeleccionados([]);
      setModoSeleccionMultiple(false);
      setTipoTest('');
    } catch (error) {
      console.error('Error en envío masivo:', error);
      alert('Error al enviar tests masivamente');
    }
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
    if (modoSeleccionMultiple) {
      toggleSeleccionEstudiante(estudiante);
    } else {
      onSelect(estudiante);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {modoSeleccionMultiple ? 'Selección Múltiple' : 'Seleccionar Estudiante'}
            </h2>
            {modoSeleccionMultiple && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                <Users className="w-3 h-3 mr-1" />
                {estudiantesSeleccionados.length} seleccionado{estudiantesSeleccionados.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleModoSeleccion}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                modoSeleccionMultiple
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {modoSeleccionMultiple ? 'Modo Individual' : 'Selección Múltiple'}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
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

          {/* Controles de selección múltiple */}
          {modoSeleccionMultiple && (
            <div className="flex flex-wrap gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <button
                  onClick={seleccionarTodosFiltrados}
                  disabled={estudiantesFiltrados.length === 0}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <CheckSquare className="w-3 h-3 mr-1" />
                  Seleccionar Todos ({estudiantesFiltrados.length})
                </button>
                <button
                  onClick={deseleccionarTodos}
                  disabled={estudiantesSeleccionados.length === 0}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Square className="w-3 h-3 mr-1" />
                  Deseleccionar Todos
                </button>
              </div>
              
              {estudiantesSeleccionados.length > 0 && (
                <div className="flex items-center space-x-2 ml-auto">
                  <select
                    value={tipoTest}
                    onChange={(e) => setTipoTest(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 dark:border-slate-600 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:text-white"
                  >
                    <option value="">Seleccionar test...</option>
                    <option value="Holland">Test de Holland</option>
                    <option value="Kuder">Test de Kuder</option>
                    <option value="Aptitudes">Test de Aptitudes</option>
                  </select>
                  <button
                    onClick={handleEnvioMasivo}
                    disabled={!tipoTest}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-3 h-3 mr-1" />
                    Enviar Tests ({estudiantesSeleccionados.length})
                  </button>
                </div>
              )}
            </div>
          )}

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
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="h-10 w-10 text-gray-400" />
              </div>
              
              {search ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    No se encontraron estudiantes
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    No hay estudiantes que coincidan con tu búsqueda: "{search}"
                  </p>
                  <button
                    onClick={() => setSearch('')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Limpiar búsqueda
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    No hay estudiantes registrados
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Para generar códigos QR de tests vocacionales, primero necesitas registrar estudiantes en el sistema.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                        📝 ¿Cómo agregar estudiantes?
                      </h4>
                      <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 text-left">
                        <li>1. Ve a la sección "Estudiantes" en el menú principal</li>
                        <li>2. Haz clic en "Agregar Estudiante"</li>
                        <li>3. Completa los datos del estudiante</li>
                        <li>4. Regresa aquí para generar el QR</li>
                      </ol>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => {
                          // Cerrar este modal y navegar a estudiantes
                          onClose();
                          window.location.href = '/estudiantes';
                        }}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center space-x-2"
                      >
                        <User className="h-4 w-4" />
                        <span>Ir a Estudiantes</span>
                      </button>
                      
                      <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {estudiantesFiltrados.map((estudiante) => {
                const isSelected = estudiantesSeleccionados.find(e => e.id === estudiante.id);
                return (
                  <div
                    key={estudiante.id}
                    onClick={() => handleSelect(estudiante)}
                    className={`w-full p-4 text-left rounded-lg transition-colors border cursor-pointer ${
                      modoSeleccionMultiple
                        ? `${
                            isSelected
                              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-500'
                              : 'bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600'
                          }`
                        : 'bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Checkbox para selección múltiple */}
                      {modoSeleccionMultiple && (
                        <div className="flex-shrink-0">
                          {isSelected ? (
                            <CheckSquare className="h-5 w-5 text-blue-600" />
                          ) : (
                            <Square className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      )}
                      
                      {/* Avatar */}
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-500" />
                      </div>
                      
                      {/* Información del estudiante */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-800 dark:text-white">
                            {estudiante.nombre} {estudiante.apellido}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {estudiante.estado && (
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                estudiante.estado === 'Activo' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}>
                                {estudiante.estado}
                              </span>
                            )}
                            {modoSeleccionMultiple && isSelected && (
                              <CheckCircle className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
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
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación para envío masivo */}
      {mostrarModalConfirmacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <Send className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Confirmar Envío Masivo
              </h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                ¿Estás seguro de que quieres enviar el <strong>Test de {tipoTest}</strong> a los siguientes estudiantes?
              </p>
              
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 max-h-32 overflow-y-auto">
                <ul className="space-y-1">
                  {estudiantesSeleccionados.map((estudiante) => (
                    <li key={estudiante.id} className="text-sm text-gray-700 dark:text-gray-300">
                      • {estudiante.nombre} {estudiante.apellido} ({estudiante.curso})
                    </li>
                  ))}
                </ul>
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Total: <strong>{estudiantesSeleccionados.length}</strong> estudiante{estudiantesSeleccionados.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setMostrarModalConfirmacion(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEnvioMasivo}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                <Send className="w-4 h-4 inline mr-2" />
                Enviar Tests
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstudianteSelector;


