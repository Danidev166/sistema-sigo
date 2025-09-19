export default function CheckboxField({ name, label, checked, onChange }) {
  return (
    <div className="flex items-start sm:items-center gap-2 py-2">
      <input
        id={name}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(name, e.target.checked)}
        className="h-4 w-4 mt-1 sm:mt-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600"
      />
      <label
        htmlFor={name}
        className="text-sm text-gray-700 dark:text-gray-200 cursor-pointer leading-tight"
      >
        {label}
      </label>
    </div>
  );
}
