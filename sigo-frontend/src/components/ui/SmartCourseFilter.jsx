import { useState, useRef, useEffect } from 'react';
import { Search, X, Users, Send, Check } from 'lucide-react';
import { OPCIONES_CURSOS, getCursoColor } from '../../features/estudiantes/constants/cursos';

/**
 * Componente de filtro inteligente para cursos con funcionalidades avanzadas:
 * - Búsqueda en tiempo real
 * - Selección múltiple
 * - Contador de estudiantes
 * - Envío masivo de tests
 * 
 * @param {Object} props
 * @param {Array} props.estudiantes - Lista de estudiantes para filtrar
 * @param {Array} props.cursosSeleccionados - Cursos actualmente seleccionados
 * @param {Function} props.onCursosChange - Callback cuando cambian los cursos seleccionados
 * @param {Function} props.onEnvioMasivo - Callback para envío masivo de tests
 * @param {boolean} props.showEnvioMasivo - Mostrar botón de envío masivo
 * @returns {JSX.Element}
 */
export default function SmartCourseFilter({ 
  estudiantes = [], 
  cursosSeleccionados = [], 
  onCursosChange, 
  onEnvioMasivo,
  showEnvioMasivo = true 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Filtrar cursos basado en búsqueda
  const cursosFiltrados = OPCIONES_CURSOS.filter(curso =>
    curso.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Contar estudiantes por curso seleccionado
  const estudiantesPorCurso = cursosSeleccionados.map(curso => ({
    curso,
    count: estudiantes.filter(est => est.curso === curso).length
  }));

  const totalEstudiantes = estudiantesPorCurso.reduce((sum, item) => sum + item.count, 0);

  // Manejar selección de curso
  const handleCursoToggle = (curso) => {
    const newCursos = cursosSeleccionados.includes(curso)
      ? cursosSeleccionados.filter(c => c !== curso)
      : [...cursosSeleccionados, curso];
    
    onCursosChange(newCursos);
  };

  // Manejar envío masivo
  const handleEnvioMasivo = () => {
    if (onEnvioMasivo && cursosSeleccionados.length > 0) {
      onEnvioMasivo(cursosSeleccionados, estudiantesPorCurso);
    }
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
        setHoveredIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Enfocar input cuando se abre
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Manejar navegación con teclado
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHoveredIndex(prev => 
          prev < cursosFiltrados.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHoveredIndex(prev => 
          prev > 0 ? prev - 1 : cursosFiltrados.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (hoveredIndex >= 0 && hoveredIndex < cursosFiltrados.length) {
          handleCursoToggle(cursosFiltrados[hoveredIndex].value);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setHoveredIndex(-1);
        break;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Search size={18} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {cursosSeleccionados.length === 0 
              ? "Seleccionar cursos..." 
              : `${cursosSeleccionados.length} curso${cursosSeleccionados.length !== 1 ? 's' : ''} seleccionado${cursosSeleccionados.length !== 1 ? 's' : ''}`
            }
          </span>
          {totalEstudiantes > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <Users size={12} className="mr-1" />
              {totalEstudiantes} estudiante{totalEstudiantes !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {cursosSeleccionados.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCursosChange([]);
              }}
              className="p-1 hover:bg-gray-200 dark:hover:bg-slate-500 rounded-full transition-colors"
            >
              <X size={16} className="text-gray-400" />
            </button>
          )}
          <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Barra de búsqueda */}
          <div className="p-3 border-b border-gray-200 dark:border-slate-600">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar curso..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setHoveredIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Lista de cursos */}
          <div className="max-h-60 overflow-y-auto">
            {cursosFiltrados.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                No se encontraron cursos
              </div>
            ) : (
              cursosFiltrados.map((curso, index) => {
                const isSelected = cursosSeleccionados.includes(curso.value);
                const isHovered = index === hoveredIndex;
                const estudiantesEnCurso = estudiantes.filter(est => est.curso === curso.value).length;

                return (
                  <div
                    key={curso.value}
                    onClick={() => handleCursoToggle(curso.value)}
                    className={`px-4 py-3 cursor-pointer transition-colors ${
                      isHovered ? 'bg-gray-100 dark:bg-slate-600' : ''
                    } ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                    onMouseEnter={() => setHoveredIndex(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          isSelected 
                            ? 'bg-blue-500 border-blue-500' 
                            : 'border-gray-300 dark:border-slate-600'
                        }`}>
                          {isSelected && <Check size={12} className="text-white" />}
                        </div>
                        <span className={`text-sm font-medium ${
                          isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
                        }`}>
                          {curso.label}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCursoColor(curso.value)}`}>
                          {curso.value.split(' ')[0]}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {estudiantesEnCurso} estudiante{estudiantesEnCurso !== 1 ? 's' : ''}
                        </span>
                        <Users size={14} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer con acciones */}
          {cursosSeleccionados.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">{totalEstudiantes}</span> estudiante{totalEstudiantes !== 1 ? 's' : ''} seleccionado{totalEstudiantes !== 1 ? 's' : ''}
                </div>
                {showEnvioMasivo && (
                  <button
                    onClick={handleEnvioMasivo}
                    className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    <Send size={14} className="mr-2" />
                    Enviar Tests
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
