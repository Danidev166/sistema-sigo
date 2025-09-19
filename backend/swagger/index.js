const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const path = require("path");

const setupSwagger = (app) => {
  const swaggerDir = path.join(__dirname, "modules");
  const swaggerFiles = fs.readdirSync(swaggerDir).filter(file => file.endsWith(".swagger.json"));

  console.log("📄 Archivos Swagger encontrados:", swaggerFiles);

  const baseDoc = {
    openapi: "3.0.0",
    info: {
      title: "API SIGO PRO",
      version: "1.0.0",
      description: "Documentación oficial del Sistema Integral de Gestión de Orientación Escolar (SIGO)"
    },
    paths: {},
    components: {},
    tags: []
  };

  swaggerFiles.forEach(file => {
    const filePath = path.join(swaggerDir, file);
    const rawData = fs.readFileSync(filePath, 'utf8');
    const doc = JSON.parse(rawData); // ✅ ya no usa require

    if (doc.paths) {
      baseDoc.paths = { ...baseDoc.paths, ...doc.paths };
    }

    if (doc.components) {
      Object.entries(doc.components).forEach(([key, value]) => {
        baseDoc.components[key] = { ...(baseDoc.components[key] || {}), ...value };
      });
    }

    if (doc.tags) {
      doc.tags.forEach(tag => {
        if (!baseDoc.tags.some(t => t.name === tag.name)) {
          baseDoc.tags.push(tag);
        }
      });
    }
  });

  app.use("/api/docs", (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
  }, swaggerUi.serve, swaggerUi.setup(baseDoc));

  console.log("✅ Swagger UI cargado en 👉 http://localhost:3000/api/docs");
};
module.exports = setupSwagger;
