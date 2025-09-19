import { Menu } from "lucide-react";

export default function MobileMenuButton({ onClick }) {
  return (
    <div className="lg:hidden px-4 pt-4">
      <button
        onClick={onClick}
        className="text-gray-700 dark:text-white bg-white dark:bg-slate-800 p-2 rounded-md shadow hover:bg-gray-100 dark:hover:bg-slate-700 transition"
        aria-label="Abrir menú de navegación"
      >
        <Menu size={24} />
      </button>
    </div>
  );
}
