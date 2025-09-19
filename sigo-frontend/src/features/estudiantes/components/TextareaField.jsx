// ✅ TextareaField.jsx
// src/features/estudiantes/components/TextareaField.jsx

export default function TextareaField({ label, name, value, onChange, required }) {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={4}
        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
      ></textarea>
    </div>
  );
}
