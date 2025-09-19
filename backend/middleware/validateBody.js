module.exports = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const mensajes = error.details.map((e) => e.message);

    console.log("❌ Error de validación:", mensajes);

    return res.status(400).json({
      error: "Error de validación",
      detalles: mensajes,
    });
  }

  next();
};
