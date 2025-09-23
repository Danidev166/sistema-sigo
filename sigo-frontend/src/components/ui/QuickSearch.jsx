import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, XIcon, ArrowRightIcon } from 'lucide-react';

/**
 * Componente de búsqueda rápida para el sidebar
 */
const QuickSearch = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  // Opciones de búsqueda rápida
  const searchOptions = useMemo(() => [
    { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { label: 'Estudiantes', path: '/estudiantes', icon: '👥' },
    { label: 'Agenda', path: '/agenda', icon: '📅' },
    { label: 'Reportes', path: '/reportes', icon: '📊' },
    { label: 'Test Vocacionales', path: '/evaluaciones', icon: '📝' },
    { label: 'Recursos', path: '/recursos', icon: '📦' },
    { label: 'Alertas', path: '/alertas', icon: '🚨' },
    { label: 'Notificaciones', path: '/notificaciones', icon: '🔔' },
    { label: 'Configuración', path: '/configuracion', icon: '⚙️' },
  ], []);

  // Filtrar opciones según la consulta
  const filteredOptions = useMemo(() => {
    if (!query.trim()) return [];
    return searchOptions.filter(option =>
      option.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, searchOptions]);

  // Manejar selección con teclado
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredOptions[selectedIndex]) {
          handleSelect(filteredOptions[selectedIndex]);
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  const handleSelect = (option) => {
    navigate(option.path);
    setQuery('');
    setSelectedIndex(0);
    onClose();
  };

  // Focus en el input cuando se abre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Resetear índice cuando cambia la consulta
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
        {/* Input de búsqueda */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <SearchIcon className="text-gray-400" size={20} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar en el sistema..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 outline-none text-gray-900 placeholder-gray-500"
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <XIcon size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Resultados */}
        {filteredOptions.length > 0 && (
          <div ref={resultsRef} className="max-h-64 overflow-y-auto">
            {filteredOptions.map((option, index) => (
              <button
                key={option.path}
                onClick={() => handleSelect(option)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors
                  ${index === selectedIndex ? 'bg-blue-50 border-r-2 border-blue-500' : ''}
                `}
              >
                <span className="text-lg">{option.icon}</span>
                <span className="flex-1 text-gray-900">{option.label}</span>
                <ArrowRightIcon size={16} className="text-gray-400" />
              </button>
            ))}
          </div>
        )}

        {/* Sin resultados */}
        {query && filteredOptions.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No se encontraron resultados para "{query}"
          </div>
        )}

        {/* Atajos de teclado */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>↑↓ Navegar</span>
            <span>Enter Seleccionar</span>
            <span>Esc Cerrar</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickSearch;
