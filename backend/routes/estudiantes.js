const express = require("express");
const router = express.Router();
const EstudianteController = require("../controller/estudianteController");
const verifyToken = require("../middleware/verifyToken");

// Ruta pública para obtener estudiantes (sin autenticación)
router.get("/public", async (req, res) => {
  try {
    const pool = await require("../config/db").getPool();
    const result = await pool.request().query(`
      SELECT id, nombre, apellido, rut, curso, estado
      FROM estudiantes 
      ORDER BY nombre, apellido
    `);
    
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener estudiantes públicos:", error);
    res.status(500).json({ error: "Error al obtener estudiantes" });
  }
});

// Protege todo el módulo
router.use(verifyToken);

// Endpoint para obtener lista simple de estudiantes (para selects)
router.get("/lista-simple", async (req, res) => {
  try {
    const pool = await require("../config/db").getPool();
    const result = await pool.request().query(`
      SELECT id, nombre, apellido, rut, curso
      FROM estudiantes 
      WHERE estado = 'Activo'
      ORDER BY nombre, apellido
    `);
    
    const estudiantes = result.recordset.map(est => ({
      id: est.id,
      nombre_completo: `${est.nombre} ${est.apellido}`,
      rut: est.rut,
      curso: est.curso
    }));
    
    res.json(estudiantes);
  } catch (error) {
    console.error("Error al obtener lista de estudiantes:", error);
    res.status(500).json({ error: "Error al obtener estudiantes" });
  }
});

// Rutas de apoderados
router.get("/apoderados", EstudianteController.obtenerApoderados);
router.get("/apoderados/estadisticas", EstudianteController.obtenerEstadisticasApoderados);
router.get("/cursos", EstudianteController.obtenerCursos);

// Otras rutas de estudiantes...
router.get("/", EstudianteController.obtenerTodos);
router.get("/:id", EstudianteController.obtenerPorId);
router.post("/", EstudianteController.crear);
router.put("/:id", EstudianteController.actualizar);
router.delete("/:id", EstudianteController.eliminar);

module.exports = router;