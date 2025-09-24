// controllers/usuarioController.js  ✅ PG
const bcrypt = require("bcrypt");
const {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  actualizarEstadoUsuario
} = require("../models/usuarioModel");
const LogsActividadModel = require('../models/logsActividadModel');

const UsuarioController = {
  listar: async (_req, res) => {
    try {
      const usuarios = await obtenerUsuarios();
      res.json(usuarios);
    } catch (error) {
      console.error("❌ Error al listar usuarios:", error);
      res.status(500).json({ mensaje: "Error interno al listar usuarios" });
    }
  },

  obtener: async (req, res) => {
    try {
      const usuario = await obtenerUsuarioPorId(req.params.id);
      if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });
      res.json(usuario);
    } catch (error) {
      console.error("❌ Error al obtener usuario:", error);
      res.status(500).json({ mensaje: "Error interno al obtener usuario" });
    }
  },

  crear: async (req, res) => {
    try {
      const { nombre, apellido, rut, email, password, rol } = req.body;
      const hashedPassword = await bcrypt.hash(password, 12);
      const nuevo = await crearUsuario({ nombre, apellido, rut, email, password: hashedPassword, rol });
      res.status(201).json(nuevo);

      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Crear',
        tabla_afectada: 'usuarios',
        id_registro: nuevo.id,
        datos_anteriores: null,
        datos_nuevos: JSON.stringify(nuevo),
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (error) {
      console.error("❌ Error al crear usuario:", error);
      res.status(500).json({ mensaje: "Error interno al crear usuario" });
    }
  },

  actualizar: async (req, res) => {
    try {
      const prev = await obtenerUsuarioPorId(req.params.id);
      await actualizarUsuario(req.params.id, req.body);
      res.json({ mensaje: "Usuario actualizado correctamente" });

      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Actualizar',
        tabla_afectada: 'usuarios',
        id_registro: req.params.id,
        datos_anteriores: JSON.stringify(prev),
        datos_nuevos: JSON.stringify(req.body),
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (error) {
      console.error("❌ Error al actualizar usuario:", error);
      res.status(500).json({ mensaje: "Error interno al actualizar usuario" });
    }
  },

  actualizarEstado: async (req, res) => {
    try {
      const { estado } = req.body; // booleano
      const { id } = req.params;
      if (typeof estado !== "boolean") {
        return res.status(400).json({ mensaje: "El estado debe ser booleano (true o false)" });
      }
      
      // Obtener información del usuario para verificar si está protegido
      const usuario = await obtenerUsuarioPorId(id);
      
      // Verificar si el usuario está protegido
      const usuariosProtegidos = [
        'patricia crespo',
        'adminsigo',
        'admin',
        'administrador'
      ];
      
      const nombreCompleto = `${usuario.nombre} ${usuario.apellido}`.toLowerCase();
      const email = usuario.email?.toLowerCase() || '';
      
      const esProtegido = usuariosProtegidos.some(protegido => 
        nombreCompleto.includes(protegido.toLowerCase()) ||
        email.includes(protegido.toLowerCase()) ||
        usuario.email === protegido
      );
      
      // Si está protegido y se intenta desactivar, denegar
      if (esProtegido && !estado) {
        return res.status(403).json({ 
          mensaje: "Este usuario no se puede desactivar por motivos de seguridad",
          error: "USUARIO_PROTEGIDO"
        });
      }
      
      const nuevoEstado = estado ? 'Activo' : 'Inactivo';
      await actualizarEstadoUsuario(id, nuevoEstado);
      res.json({ mensaje: "Estado actualizado correctamente" });
    } catch (error) {
      console.error("❌ Error al actualizar estado del usuario:", error);
      res.status(500).json({ mensaje: "Error interno al actualizar estado del usuario" });
    }
  },

  eliminar: async (req, res) => {
    try {
      const prev = await obtenerUsuarioPorId(req.params.id);
      
      // Verificar si el usuario está protegido
      const usuariosProtegidos = [
        'patricia crespo',
        'adminsigo',
        'admin',
        'administrador'
      ];
      
      const nombreCompleto = `${prev.nombre} ${prev.apellido}`.toLowerCase();
      const email = prev.email?.toLowerCase() || '';
      
      const esProtegido = usuariosProtegidos.some(protegido => 
        nombreCompleto.includes(protegido.toLowerCase()) ||
        email.includes(protegido.toLowerCase()) ||
        prev.email === protegido
      );
      
      if (esProtegido) {
        return res.status(403).json({ 
          mensaje: "Este usuario no se puede eliminar por motivos de seguridad",
          error: "USUARIO_PROTEGIDO"
        });
      }
      
      await eliminarUsuario(req.params.id);
      res.json({ mensaje: "Usuario eliminado correctamente" });

      await LogsActividadModel.crear({
        id_usuario: req.user?.id || null,
        accion: 'Eliminar',
        tabla_afectada: 'usuarios',
        id_registro: req.params.id,
        datos_anteriores: JSON.stringify(prev),
        datos_nuevos: null,
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (error) {
      console.error("❌ Error al eliminar usuario:", error);
      res.status(500).json({ mensaje: "Error interno al eliminar usuario" });
    }
  },
};

module.exports = UsuarioController;
