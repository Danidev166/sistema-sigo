const express = require("express");
const router = express.Router();

const RecursoController = require("../controller/recursoController");
const entregaRecursoController = require("../controller/entregaRecursoController");
const validateBody = require("../middleware/validateBody");
const verifyToken = require("../middleware/verifyToken");
const {
  crearRecursoSchema,
  actualizarRecursoSchema,
} = require("../validators/recursoValidator");
const entregaRecursoValidator = require("../validators/entregaRecursoValidator");

// 🧪 Ruta de prueba sin autenticación (temporal)
router.get("/test", async (req, res) => {
  try {
    const pool = await require("../config/db").getPool();
    const result = await pool.request().query(`
      SELECT id, nombre, tipo_recurso, stock, activo
      FROM recursos 
      ORDER BY nombre
    `);
    
    res.json({
      success: true,
      data: result.recordset,
      message: "Backend funcionando correctamente"
    });
  } catch (error) {
    console.error("Error en ruta de prueba:", error);
    res.status(500).json({ 
      success: false,
      error: "Error al obtener recursos",
      details: error.message 
    });
  }
});

// 🧪 Ruta de prueba para eliminar recurso sin autenticación (temporal)
router.delete("/test/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await require("../config/db").getPool();
    
    // Verificar que el recurso existe
    const recurso = await pool.request()
      .input('id', require("../config/db").sql.Int, id)
      .query(`SELECT id, nombre FROM recursos WHERE id = @id`);
    
    if (recurso.recordset.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: "Recurso no encontrado" 
      });
    }
    
    // Eliminar el recurso
    await pool.request()
      .input('id', require("../config/db").sql.Int, id)
      .query(`DELETE FROM recursos WHERE id = @id`);
    
    res.json({
      success: true,
      message: "Recurso eliminado correctamente",
      recurso_eliminado: recurso.recordset[0]
    });
  } catch (error) {
    console.error("Error al eliminar recurso:", error);
    res.status(500).json({ 
      success: false,
      error: "Error al eliminar el recurso",
      details: error.message 
    });
  }
});

// 🔐 proteger todo
router.use(verifyToken);

// 🎁 Entregas (rutas específicas primero)
router.get("/entregas", entregaRecursoController.obtenerTodas);
router.get("/entregas/estudiante/:id", entregaRecursoController.obtenerPorEstudiante);
router.get("/entregas/:id", entregaRecursoController.obtenerPorId);
router.post("/entregas", validateBody(entregaRecursoValidator.crear), entregaRecursoController.crear);
router.put("/entregas/:id", validateBody(entregaRecursoValidator.actualizar), entregaRecursoController.actualizar);
router.delete("/entregas/:id", entregaRecursoController.eliminar);

// 📦 Recursos
router.get("/", RecursoController.obtenerTodos);
router.post("/", validateBody(crearRecursoSchema), RecursoController.crear);
router.put("/:id", validateBody(actualizarRecursoSchema), RecursoController.actualizar);
router.delete("/:id", RecursoController.eliminar);

// 📋 Lista simple para selects (debe ir antes de /:id)
router.get("/lista-simple", async (req, res) => {
  try {
    const pool = await require("../config/db").getPool();
    const result = await pool.request().query(`
      SELECT id, nombre, tipo_recurso, stock
      FROM recursos 
      WHERE activo = true
      ORDER BY nombre
    `);
    
    const recursos = result.recordset.map(rec => ({
      id: rec.id,
      nombre: rec.nombre,
      tipo_recurso: rec.tipo_recurso,
      stock_disponible: rec.stock
    }));
    
    res.json(recursos);
  } catch (error) {
    console.error("Error al obtener lista de recursos:", error);
    res.status(500).json({ error: "Error al obtener recursos" });
  }
});

// ⚠️ genérica al final
router.get("/:id", RecursoController.obtenerPorId);

module.exports = router;
