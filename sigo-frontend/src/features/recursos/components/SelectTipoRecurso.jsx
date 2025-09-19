/**
 * Selector de tipo de recurso.
 *
 * @param {Object} props
 * @param {Function} props.onChange - Callback al seleccionar tipo
 * @param {string} [props.value] - Valor seleccionado
 * @returns {JSX.Element}
 *
 * @example
 * <SelectTipoRecurso onChange={fn} value="libro" />
 */
// src/features/recursos/components/SelectTipoRecurso.jsx
import { useState, useEffect, useCallback } from "react";
import tiposRecurso from "../utils/tiposRecurso";

export default function SelectTipoRecurso({ tipo, subTipo, setTipo, setSubTipo }) {
  const [opcionesSub, setOpcionesSub] = useState([]);

  // Memoizar la actualización de opciones para evitar recreaciones innecesarias
  const actualizarOpciones = useCallback(() => {
    if (tipo) {
      const nuevasOpciones = tiposRecurso[tipo] || [];
      setOpcionesSub(nuevasOpciones);

      // Solo resetear el subtipo si no está en las nuevas opciones
      if (subTipo && !nuevasOpciones.includes(subTipo)) {
        setSubTipo("");
      }
    } else {
      setOpcionesSub([]);
    }
  }, [tipo, subTipo, setSubTipo]);

  useEffect(() => {
    actualizarOpciones();
  }, [actualizarOpciones]);

  const handleTipoChange = (e) => {
    const nuevoTipo = e.target.value;
    setTipo(nuevoTipo);
    if (!nuevoTipo) {
      setSubTipo("");
    }
  };

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {/* Select Tipo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Tipo de recurso
        </label>
        <select
          value={tipo}
          onChange={handleTipoChange}
          className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-700 dark:text-white text-sm"
        >
          <option value="">Seleccione tipo</option>
          {Object.keys(tiposRecurso).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Select Subtipo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Detalle / Subtipo
        </label>
        <select
          value={subTipo}
          onChange={(e) => setSubTipo(e.target.value)}
          className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-700 dark:text-white text-sm"
          disabled={!tipo}
        >
          <option value="">Seleccione subtipo</option>
          {opcionesSub.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
