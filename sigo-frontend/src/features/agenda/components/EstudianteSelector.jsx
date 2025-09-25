import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import estudianteService from "../../estudiantes/services/estudianteService";

/**
 * Selector de estudiantes para formularios de agenda.
 *
 * @param {Object} props
 * @param {Array} props.estudiantes - Lista de estudiantes
 * @param {Function} props.onChange - Callback al seleccionar estudiante
 * @param {string|number} [props.value] - Valor seleccionado
 * @returns {JSX.Element}
 *
 * @example
 * <EstudianteSelector estudiantes={[]} onChange={fn} value={id} />
 */

export default function EstudianteSelector({ value, onChange }) {
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);

  const isDarkMode =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const formatOption = (e) => ({
    label: `${e.nombre} ${e.apellido} - ${e.rut} (${e.curso})`,
    value: e.id,
  });

  const loadOptions = async (inputText) => {
    try {
      const res = await estudianteService.getEstudiantes();
      const filtrados = res.data.filter((e) =>
        `${e.nombre} ${e.apellido} ${e.rut} ${e.curso}`
          .toLowerCase()
          .includes(inputText.toLowerCase())
      );
      return filtrados.map(formatOption);
    } catch (err) {
      console.error("❌ Error al cargar estudiantes:", err);
      return [];
    }
  };

  // Cargar el estudiante seleccionado cuando hay un value
  const loadSelectedStudent = async (studentId) => {
    if (!studentId) return;
    
    try {
      const res = await estudianteService.getEstudiantes();
      const student = res.data.find(e => e.id === studentId);
      if (student) {
        setSelectedOption(formatOption(student));
      }
    } catch (err) {
      console.error("❌ Error al cargar estudiante seleccionado:", err);
    }
  };

  // Cargar estudiante cuando cambia el value
  React.useEffect(() => {
    if (value) {
      loadSelectedStudent(value);
    } else {
      setSelectedOption(null);
    }
  }, [value]);

  return (
    <AsyncSelect
      inputId="estudiante-selector"
      cacheOptions
      defaultOptions
      loadOptions={loadOptions}
      onInputChange={setInputValue}
      value={selectedOption}
      onChange={(option) => {
        setSelectedOption(option);
        onChange(option);
      }}
      placeholder="Buscar estudiante por nombre, RUT o curso..."
      styles={{
        control: (base, state) => ({
          ...base,
          backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
          borderColor: state.isFocused ? "#2563eb" : "#cbd5e1",
          boxShadow: state.isFocused ? "0 0 0 1px #2563eb" : "none",
          "&:hover": {
            borderColor: "#2563eb",
          },
          color: isDarkMode ? "#f1f5f9" : "#000",
          borderRadius: 6,
          minHeight: 38,
        }),
        input: (base) => ({
          ...base,
          color: isDarkMode ? "#f1f5f9" : "#000",
        }),
        singleValue: (base) => ({
          ...base,
          color: isDarkMode ? "#f1f5f9" : "#000",
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
          color: isDarkMode ? "#f1f5f9" : "#000",
          zIndex: 50,
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused
            ? isDarkMode
              ? "#334155"
              : "#e0f2fe"
            : isDarkMode
            ? "#1e293b"
            : "#ffffff",
          color: isDarkMode ? "#f1f5f9" : "#000",
          cursor: "pointer",
        }),
      }}
    />
  );
}
