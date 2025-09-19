import AsyncSelect from "react-select/async";
import estudianteService from "../../features/estudiantes/services/estudianteService";

export default function EstudianteSelector({ value, onChange }) {
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

  return (
    <div className="w-full">
      <AsyncSelect
        cacheOptions
        defaultOptions
        loadOptions={loadOptions}
        value={value}
        onChange={onChange}
        placeholder="Buscar estudiante por nombre, RUT o curso..."
        className="text-sm"
        styles={{
          control: (base, state) => ({
            ...base,
            backgroundColor: state.isDisabled ? "#f1f5f9" : "#fff",
            borderColor: "#334155",
            borderRadius: "0.5rem",
            minHeight: "40px",
            boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
            "&:hover": { borderColor: "#3b82f6" },
          }),
          input: (base) => ({
            ...base,
            color: "#0f172a",
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: "#fff",
            zIndex: 50,
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? "#e0f2fe" : "#fff",
            color: "#0f172a",
          }),
          singleValue: (base) => ({
            ...base,
            color: "#0f172a",
          }),
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 8,
          colors: {
            ...theme.colors,
            primary25: "#e0f2fe", // hover
            primary: "#3b82f6", // border focus
          },
        })}
      />
    </div>
  );
}
