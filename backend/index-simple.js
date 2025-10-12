// ==============================
//  SIGO API - Versión Simplificada para Render
// ==============================

// 1) Cargar variables de entorno
const isAzure = !!process.env.WEBSITE_SITE_NAME;
const nodeEnv = process.env.NODE_ENV || (isAzure ? "production" : "development");

if (!isAzure) {
  const envFile = nodeEnv === "production" ? ".env.production" : ".env";
  require("dotenv").config({ path: envFile });
  console.log(`🔧 Cargando configuración desde ${envFile}`);
} else {
  console.log("🔧 Usando App Settings de Azure (sin .env local)");
}

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const path = require("path");

const errorHandler = require("./middleware/errorHandler");

// 2) App base
const app = express();
app.set("trust proxy", 1);

// 3) Prefijo API
const API_PREFIX = process.env.API_PREFIX || "/api";

// 4) Middleware básico
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(compression());

// 5) CORS simplificado
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:4174",
  "https://sigo-caupolican.onrender.com",
  "https://sigo-frontend-2025.onrender.com",
  "https://sistema-sigo-2025.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS bloqueado para origen: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// 6) Rate limiting básico
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: { error: "Demasiadas solicitudes, intenta de nuevo más tarde" }
});
app.use(limiter);

// 7) Logging
app.use(morgan(nodeEnv === "development" ? "dev" : "combined"));

// 8) Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 9) Prefijo API y router principal
const apiRouter = express.Router();

// 10) Rutas esenciales solamente
const essentialRoutes = [
  { path: "/auth", module: "./routes/authRoutes" },
  { path: "/estudiantes", module: "./routes/estudiantes" },
  { path: "/seguimiento-academico", module: "./routes/seguimientoAcademico" },
  { path: "/asistencia", module: "./routes/asistencia" },
  { path: "/historial-academico", module: "./routes/historialAcademico" },
  { path: "/conducta", module: "./routes/conducta" },
  { path: "/intervenciones", module: "./routes/intervenciones" },
  { path: "/entrevistas", module: "./routes/entrevistas" },
  { path: "/comunicacion-familia", module: "./routes/comunicacionFamilia" },
  { path: "/reportes", module: "./routes/reportes" }
];

essentialRoutes.forEach(({ path: routePath, module }) => {
  try {
    const route = require(path.join(__dirname, module));
    apiRouter.use(routePath, route);
    console.log(`✅ Ruta cargada: ${routePath}`);
  } catch (error) {
    console.error(`❌ Error cargando módulo ${module}:`, error.message);
  }
});

// 11) Healthcheck
apiRouter.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: nodeEnv,
    version: "2.0.4-simple"
  });
});

// 12) Montar router bajo prefijo
app.use(API_PREFIX, apiRouter);

// 13) Home
app.get("/", (_req, res) => {
  res.json({
    status: "OK",
    message: "✅ API SIGO PRO funcionando (versión simplificada)",
    version: "2.0.4-simple",
    timestamp: new Date().toISOString()
  });
});

// 14) 404
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada", path: req.path });
});

// 15) Manejador global de errores
app.use(errorHandler);

// 16) Arranque
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, "0.0.0.0", () => {
    console.log("\n🚀 Servidor SIGO PRO (SIMPLIFICADO) iniciado");
    console.log(`📡 Puerto: ${PORT}`);
    console.log(`🌐 Render deployment: ${process.env.RENDER ? 'SÍ' : 'NO'}`);
    console.log(`🔧 NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`🚀 VERSIÓN: 2.0.4 - SIMPLIFICADO PARA RENDER`);
    console.log(`⏰ Deploy timestamp: ${new Date().toISOString()}`);
    console.log(`🔍 CORS Origins: ${JSON.stringify(allowedOrigins)}`);
    console.log(`🔍 API_PREFIX: ${API_PREFIX}`);
    console.log(`🔍 Routes loaded: ${essentialRoutes.length}`);
    console.log("");
  });
}

module.exports = app;
