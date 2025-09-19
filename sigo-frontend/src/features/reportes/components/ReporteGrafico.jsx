/**
 * Componente de gráfico para reportes.
 *
 * @param {Object} props
 * @param {string} props.titulo - Título del gráfico
 * @param {Array} props.datos - Datos para el gráfico
 * @param {string} props.tipo - Tipo de gráfico
 * @returns {JSX.Element}
 *
 * @example
 * <ReporteGrafico titulo="Estudiantes por curso" datos={[]} tipo="bar" />
 */
// src/features/reportes/components/ReporteGrafico.jsx
import {
  BarChart,
  PieChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Bar,
  Pie,
  Cell,
  Legend,
} from "recharts";

const coloresVibrantes = [
  "#3B82F6",
  "#22C55E",
  "#A855F7",
  "#F43F5E",
  "#06B6D4",
  "#EAB308",
  "#8B5CF6",
  "#0EA5E9",
  "#EC4899",
];

const customTooltip =
  (tooltipLabelSingular) =>
  ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 px-3 py-2 rounded shadow text-sm">
          <p className="text-gray-800 dark:text-white font-semibold">
            {payload[0].payload.label}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            {payload[0].value} {tooltipLabelSingular}
          </p>
        </div>
      );
    }
    return null;
  };

export default function ReporteGrafico({
  title,
  data = [],
  type = "bar",
  tooltipLabelSingular = "elementos",
}) {
  console.log("📊 Datos recibidos para el gráfico:", data);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 sm:p-5 min-w-[280px]">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">
          {title}
        </h3>
        <p className="text-gray-500 dark:text-gray-300 text-sm sm:text-base">
          No hay datos disponibles.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 sm:p-5 min-w-[280px] transition hover:shadow-lg">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">
        {title}
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        {type === "bar" ? (
          <BarChart data={data} barSize={30} barGap={10}>
            <XAxis dataKey="label" stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <YAxis stroke="#94a3b8" domain={[0, "auto"]} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(value, name) => [`${value}`, name]} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: 8 }} />
            <Bar dataKey="presentes" fill="#22C55E" name="Presentes" />
            <Bar dataKey="ausentes" fill="#EF4444" name="Ausentes" />
          </BarChart>
        ) : (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
              dataKey="value"
              labelLine={false}
              nameKey="label"
            >
              {data.map((_, index) => (
                <Cell
                  key={`pie-${index}`}
                  fill={coloresVibrantes[index % coloresVibrantes.length]}
                />
              ))}
            </Pie>
            <Tooltip content={customTooltip(tooltipLabelSingular)} />
            <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '12px', paddingTop: 8 }} />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
