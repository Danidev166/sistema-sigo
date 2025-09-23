// ==============================
//  SIGO API - listo para Azure / Prod
// ==============================

// 1) Cargar variables de entorno
// - En Azure App Service usaremos App Settings (no .env)
// - En local, sí cargamos .env/.env.production según NODE_ENV
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

const setupSwagger = require("./swagger");
const errorHandler = require("./middleware/errorHandler");

// 2) App base
const app = express();
app.set("trust proxy", 1); // necesario detrás del proxy de Azure para cookies/secure

// 3) Prefijo API (defínelo pronto porque lo usamos para Swagger/CSP)
const API_PREFIX = process.env.API_PREFIX || "/api";

// 4) Seguridad y performance (UN solo Helmet con CSP dinámica)
const baseHelmetDirectives = {
  useDefaults: true,
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'"],
  },
};

// Desactiva CSP sólo para Swagger UI
const swaggerCspOff = (req, res, next) => {
  res.locals.cspDisabled = true;
  next();
};
// Monta este middleware ANTES de Helmet y sólo en la ruta de Swagger
app.use(`${API_PREFIX}/docs`, swaggerCspOff);

// Wrapper que aplica helmet con CSP calculada por request
app.use((req, res, next) => {
  const csp = res.locals?.cspDisabled ? false : baseHelmetDirectives;
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    frameguard: { action: "deny" },
    referrerPolicy: { policy: "no-referrer" },
    contentSecurityPolicy: csp, // false en /api/docs, objeto en el resto
  })(req, res, next);
});

app.use(compression());

// 5) CORS seguro (lista blanca + opción para Azure Static Web Apps)
const parseCsv = (v) => (v || "").split(",").map((s) => s.trim()).filter(Boolean);

const LOCAL_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:4174",
  "http://192.168.18.10:5173",
  "http://192.168.18.10:5174",
  "http://192.168.18.10:4174",
  "https://sigo-frontend-2025.onrender.com",
  "https://sistema-sigo-2025.onrender.com",
];

const FRONTEND_URLS = parseCsv(process.env.FRONTEND_URLS || process.env.FRONTEND_URL);
const EXTRA_ORIGINS = parseCsv(process.env.CORS_EXTRA_ORIGINS);

const allowSwaRegex = process.env.CORS_ALLOW_SWA_REGEX === "true";
const swaRegex = /\.azurestaticapps\.net$/i;

const allowed = new Set([...LOCAL_ORIGINS, ...FRONTEND_URLS, ...EXTRA_ORIGINS]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true); // curl/servicios internos
      try {
        const url = new URL(origin);
        if (allowed.has(origin) || allowed.has(url.origin)) return callback(null, true);
        if (allowSwaRegex && swaRegex.test(url.hostname)) return callback(null, true);
        return callback(new Error(`CORS bloqueado para origen: ${origin}`));
      } catch {
        return callback(new Error("Origen inválido"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Cache-Control"],
    optionsSuccessStatus: 200,
  })
);

// 6) Rate limiting (configurable por env)
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || `${15 * 60 * 1000}`, 10); // 15 min
const GENERAL_MAX = parseInt(
  process.env.RATE_LIMIT_GENERAL_MAX ||
    process.env.RATE_LIMIT_MAX_REQUESTS ||
    (nodeEnv === "development" ? "1000" : "100"),
  10
);
const AUTH_MAX = parseInt(
  process.env.RATE_LIMIT_AUTH_MAX ||
    process.env.RATE_LIMIT_AUTH_MAX_REQUESTS ||
    (nodeEnv === "development" ? "50" : "5"),
  10
);

const generalLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: GENERAL_MAX,
  message: { error: "⚠️ Demasiadas solicitudes, intenta de nuevo más tarde" },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: AUTH_MAX,
  message: { error: "⚠️ Demasiados intentos de login, intenta de nuevo más tarde" },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(generalLimiter);
app.use("/api/auth", authLimiter);

// 7) Logging
app.use(morgan(nodeEnv === "development" ? "dev" : "combined"));

// 8) Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 9) Prefijo API y router principal
const apiRouter = express.Router();

// 10) Registro dinámico de rutas
const routes = [
  { path: "/auth", module: "./routes/authRoutes" },
  { path: "/usuarios", module: "./routes/usuarios" },
  { path: "/estudiantes", module: "./routes/estudiantes" },
  { path: "/recursos", module: "./routes/recursosRoutes" },
  { path: "/entregas", module: "./routes/entregaRecursoRoutes" },
  { path: "/movimientos", module: "./routes/movimientoRoutes" },
  { path: "/evaluaciones", module: "./routes/evaluaciones" },
  { path: "/entrevistas", module: "./routes/entrevistas" },
  { path: "/agenda", module: "./routes/agenda" },
  { path: "/historial-academico", module: "./routes/historialAcademico" },
  { path: "/reportes", module: "./routes/reportes" },
  { path: "/seguimiento", module: "./routes/seguimiento" },
  { path: "/asistencia", module: "./routes/asistencia" },
  { path: "/seguimiento-academico", module: "./routes/seguimientoAcademico" },
  { path: "/comunicacion-familia", module: "./routes/comunicacionFamilia" },
  { path: "/intervenciones", module: "./routes/intervenciones" },
  { path: "/conducta", module: "./routes/conducta" },
  { path: "/configuracion", module: "./routes/configuracionRoutes" },
  { path: "/alertas", module: "./routes/alertas" },
  { path: "/seguimiento-psicosocial", module: "./routes/seguimientoPsicosocial" },
  { path: "/comunicacion-interna", module: "./routes/comunicacionInterna" },
  { path: "/configuracion-sistema", module: "./routes/configuracionSistema" },
  { path: "/logs-actividad", module: "./routes/logsActividad" },
  { path: "/notificaciones", module: "./routes/notificaciones" },
  { path: "/permisos-roles", module: "./routes/permisosRoles" },
  { path: "/reportes-mejorado", module: "./routes/reportesMejorado" },
  { path: "/seguimiento-cronologico", module: "./routes/seguimientoCronologico" },
];

routes.forEach(({ path: routePath, module }) => {
  try {
    const route = require(path.join(__dirname, module));
    apiRouter.use(routePath, route);
    console.log(`✅ Ruta cargada: ${routePath}`);

    // Logging de endpoints definidos
    if (route.stack) {
      route.stack.forEach((layer) => {
        if (layer.route) {
          const methods = Object.keys(layer.route.methods).map((m) => m.toUpperCase());
          console.log(`  ➡️  [${methods.join(", ")}] ${API_PREFIX}${routePath}${layer.route.path}`);
        }
      });
    }
  } catch (error) {
    console.error(`❌ Error cargando módulo ${module}:`, error.message);
    console.error(error.stack);
  }
});

// 11) Healthchecks
apiRouter.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: nodeEnv,
  });
});

// 12) Montar router bajo prefijo
app.use(API_PREFIX, apiRouter);

// 13) Swagger (sirve bajo `${API_PREFIX}/docs`)
setupSwagger(app);

// 14) Home
app.get("/", (_req, res) => {
  res.json({
    status: "OK",
    message: "✅ API SIGO PRO funcionando",
    version: process.env.npm_package_version || "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// 15) 404
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada", path: req.path });
});

// 16) Manejador global de errores
app.use(errorHandler);

// 17) Arranque
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, "0.0.0.0", () => {
    console.log("\n🚀 Servidor SIGO PRO iniciado");
    console.log(`📡 Puerto: ${PORT}`);
    console.log(`📚 Swagger: http://localhost:${PORT}${API_PREFIX}/docs\n`);
  });
}

module.exports = app;
