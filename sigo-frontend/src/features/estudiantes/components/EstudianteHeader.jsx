// src/features/estudiantes/components/EstudianteHeader.jsx
import { UserIcon, GraduationCap, Mail, BadgeInfo } from 'lucide-react';

export default function EstudianteHeader({ estudiante }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 border border-gray-100 dark:border-slate-700 transition-all">
      {/* Avatar central con fondo institucional */}
      <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center shadow-md shrink-0">
        <UserIcon className="text-blue-700 dark:text-blue-300 w-12 h-12" />
      </div>

      {/* Info del estudiante */}
      <div className="flex-1 space-y-2 text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
          {estudiante?.nombre} {estudiante?.apellido}
        </h2>

        <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center sm:justify-start gap-2 sm:gap-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
          <span className="flex items-center gap-1">
            <BadgeInfo className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            {estudiante?.rut}
          </span>
          <span className="flex items-center gap-1">
            <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            {estudiante?.email}
          </span>
          <span className="flex items-center gap-1">
            <GraduationCap className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            Curso: {estudiante?.curso}
          </span>
          <span className="flex items-center gap-1">
            <GraduationCap className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            Especialidad: {estudiante?.especialidad}
          </span>
        </div>
      </div>
    </div>
  );
}
