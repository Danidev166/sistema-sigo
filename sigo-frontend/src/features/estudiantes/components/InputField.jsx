// src/features/estudiantes/components/InputField.jsx
import UpperCaseInput from "../../../components/ui/UpperCaseInput";
import SimpleInput from "../../../components/ui/SimpleInput";

export default function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  error
}) {
  // Solo usar UpperCaseInput para campos que necesitan mayúsculas
  const camposMayusculas = ['nombre', 'apellido', 'direccion', 'situacion_economica', 'nombreApoderado'];
  const InputComponent = (type === "text" && camposMayusculas.includes(name)) ? UpperCaseInput : SimpleInput;

  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
      </label>
      <InputComponent
        id={name}
        name={name}
        type={type}
        value={value || ''}
        onChange={onChange}
        required={required}
        className={`${error ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'}`}
      />
      {error && <span className="text-xs text-red-600 mt-1 block">{error}</span>}
    </div>
  );
}
