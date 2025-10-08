const EvaluacionModel = require("../models/evaluacionModel");
const { enviarTestVocacionalQR } = require("../utils/emailService");
const logger = require("../utils/logger");

class EvaluacionesController {
  static async listar(req, res, next) {
    try {
      const { estudiante } = req.query;
      
      if (estudiante) {
        // Filtrar por estudiante
        const evaluaciones = await EvaluacionModel.obtenerPorEstudiante(estudiante);
        res.json(evaluaciones);
      } else {
        // Obtener todas las evaluaciones
        const evaluaciones = await EvaluacionModel.obtenerTodas();
        res.json(evaluaciones);
      }
    } catch (error) {
      logger.error(" Error al obtener evaluaciones:", error);
      next(error);
    }
  }
  static async obtenerPorEspecialidad(req, res, next) {
    try {
      const data = await EvaluacionModel.obtenerPorEspecialidad();
      res.json(data);
    } catch (error) {
      logger.error(" Error al obtener test por especialidad:", error);
      next(error);
    }
  }

  static async obtenerPorEspecialidadTest(req, res, next) {
    try {
      const data = await EvaluacionModel.obtenerPorEspecialidad();
      res.json(data);
    } catch (error) {
      logger.error(" Error al obtener test por especialidad (test):", error);
      next(error);
    }
  }


  static async obtener(req, res, next) {
    try {
      const { id } = req.params;
      const evaluacion = await EvaluacionModel.obtenerPorId(id);
      if (!evaluacion) {
        return res.status(404).json({ error: "Evaluación no encontrada" });
      }
      res.json(evaluacion);
    } catch (error) {
      logger.error(" Error al obtener evaluación:", error);
      next(error);
    }
  }
  

  static async crear(req, res, next) {
    try {
      const nueva = await EvaluacionModel.crear(req.body);
      res.status(201).json({ message: " Evaluación registrada", evaluacion: nueva });
    } catch (error) {
      logger.error(" Error al crear evaluación:", error);
      next(error);
    }
  }

  static async actualizar(req, res, next) {
    try {
      const { id } = req.params;
      const existente = await EvaluacionModel.obtenerPorId(id);
      if (!existente) {
        return res.status(404).json({ error: "Evaluación no encontrada" });
      }

      await EvaluacionModel.actualizar(id, req.body);
      res.json({ message: " Evaluación actualizada correctamente" });
    } catch (error) {
      logger.error(" Error al actualizar evaluación:", error);
      next(error);
    }
  }

  static async eliminar(req, res, next) {
    try {
      const { id } = req.params;
      const existente = await EvaluacionModel.obtenerPorId(id);
      if (!existente) {
        return res.status(404).json({ error: "Evaluación no encontrada" });
      }

      await EvaluacionModel.eliminar(id);
      res.json({ message: " Evaluación eliminada" });
    } catch (error) {
      logger.error(" Error al eliminar evaluación:", error);
      next(error);
    }
  }

  // Enviar test vocacional por email con QR
  static async enviarTestPorEmail(req, res, next) {
    try {
      const { email, estudiante, testType, qrCodeUrl, testUrl } = req.body;

      // Validar datos requeridos
      if (!email || !estudiante || !testType || !qrCodeUrl || !testUrl) {
        return res.status(400).json({ 
          error: " Faltan datos requeridos: email, estudiante, testType, qrCodeUrl, testUrl" 
        });
      }

      // Validar tipo de test
      const testTypes = ['kuder', 'holland', 'aptitudes'];
      if (!testTypes.includes(testType)) {
        return res.status(400).json({ 
          error: " Tipo de test inválido. Debe ser: kuder, holland o aptitudes" 
        });
      }

      // Validar estructura del estudiante
      if (!estudiante.nombre || !estudiante.apellido) {
        return res.status(400).json({ 
          error: " Datos del estudiante incompletos. Se requiere nombre y apellido" 
        });
      }

      logger.info(" Enviando test vocacional por email:", {
        email,
        estudiante: `${estudiante.nombre} ${estudiante.apellido}`,
        testType,
        testUrl
      });

      // Enviar email
      await enviarTestVocacionalQR({
        to: email,
        estudiante,
        testType,
        qrCodeUrl,
        testUrl
      });

      res.json({ 
        message: " Test vocacional enviado por email correctamente",
        data: {
          email,
          estudiante: `${estudiante.nombre} ${estudiante.apellido}`,
          testType,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      logger.error(" Error en enviarTestPorEmail:", error);
      next(error);
    }
  }
}

module.exports = EvaluacionesController;
