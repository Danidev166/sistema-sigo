-- Esquema completo de la base de datos SIGO
-- Generado automáticamente el 2025-09-23T17:20:44.018Z

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla agenda
CREATE TABLE IF NOT EXISTS agenda (
  id bigint NOT NULL DEFAULT nextval('agenda_id_seq'::regclass),
  id_estudiante bigint NOT NULL,
  fecha date NOT NULL,
  hora time without time zone NOT NULL,
  motivo character varying(255) NOT NULL,
  profesional character varying(100) NOT NULL,
  email_orientador character varying(255),
  creado_en timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id)
);

-- Índices para agenda
CREATE INDEX idx_agenda_fecha ON public.agenda USING btree (fecha);

-- Tabla alertas
CREATE TABLE IF NOT EXISTS alertas (
  id bigint NOT NULL DEFAULT nextval('alertas_id_seq'::regclass),
  id_estudiante bigint NOT NULL,
  fecha_alerta timestamp with time zone NOT NULL DEFAULT now(),
  tipo_alerta character varying(100) NOT NULL,
  descripcion text,
  estado character varying(30) NOT NULL DEFAULT 'Nueva'::character varying,
  PRIMARY KEY (id),
  FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id)
);

-- Índices para alertas
CREATE INDEX idx_alertas_estudiante_fecha ON public.alertas USING btree (id_estudiante, fecha_alerta DESC);

-- Tabla asistencia
CREATE TABLE IF NOT EXISTS asistencia (
  id bigint NOT NULL DEFAULT nextval('asistencia_id_seq'::regclass),
  id_estudiante bigint NOT NULL,
  fecha date NOT NULL,
  tipo character varying(50) NOT NULL,
  justificacion text,
  PRIMARY KEY (id),
  FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id)
);

-- Índices para asistencia
CREATE INDEX idx_asistencia_estudiante_fecha ON public.asistencia USING btree (id_estudiante, fecha);

-- Tabla comunicacion_interna
CREATE TABLE IF NOT EXISTS comunicacion_interna (
  id bigint NOT NULL DEFAULT nextval('comunicacion_interna_id_seq'::regclass),
  id_remitente bigint NOT NULL,
  id_destinatario bigint NOT NULL,
  asunto character varying(200) NOT NULL,
  mensaje text NOT NULL,
  prioridad character varying(20) NOT NULL DEFAULT 'Normal'::character varying,
  leida boolean NOT NULL DEFAULT false,
  adjuntos text,
  fecha_envio timestamp with time zone NOT NULL DEFAULT now(),
  fecha_lectura timestamp with time zone,
  PRIMARY KEY (id),
  FOREIGN KEY (id_remitente) REFERENCES usuarios(id),
  FOREIGN KEY (id_destinatario) REFERENCES usuarios(id)
);

-- Índices para comunicacion_interna
CREATE INDEX idx_ci_dest_leida ON public.comunicacion_interna USING btree (id_destinatario, leida);

-- Tabla comunicacionfamilia
CREATE TABLE IF NOT EXISTS comunicacionfamilia (
  id bigint NOT NULL DEFAULT nextval('comunicacionfamilia_id_seq'::regclass),
  id_estudiante bigint NOT NULL,
  fecha date NOT NULL,
  tipo character varying(50) NOT NULL,
  detalle text,
  responsable character varying(100) NOT NULL,
  proxima_accion character varying(255),
  PRIMARY KEY (id),
  FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id)
);

-- Tabla conducta
CREATE TABLE IF NOT EXISTS conducta (
  id bigint NOT NULL DEFAULT nextval('conducta_id_seq'::regclass),
  id_estudiante bigint NOT NULL,
  fecha date NOT NULL,
  observacion text NOT NULL,
  categoria character varying(50) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id)
);

-- Índices para conducta
CREATE INDEX idx_conducta_estudiante_fecha ON public.conducta USING btree (id_estudiante, fecha);

-- Tabla configuracion
CREATE TABLE IF NOT EXISTS configuracion (
  id bigint NOT NULL DEFAULT nextval('configuracion_id_seq'::regclass),
  tipo character varying(50) NOT NULL,
  clave character varying(100) NOT NULL,
  valor text,
  descripcion character varying(255),
  usuario_modificacion character varying(100),
  fecha_modificacion timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Índices para configuracion
CREATE UNIQUE INDEX uq_configuracion_tipo_clave ON public.configuracion USING btree (tipo, clave);

-- Tabla configuracion_sistema
CREATE TABLE IF NOT EXISTS configuracion_sistema (
  id bigint NOT NULL DEFAULT nextval('configuracion_sistema_id_seq'::regclass),
  clave character varying(100) NOT NULL,
  valor text NOT NULL,
  tipo character varying(50) NOT NULL,
  descripcion character varying(255),
  categoria character varying(50),
  editable boolean NOT NULL DEFAULT true,
  modificado_por character varying(100),
  fecha_modificacion timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Índices para configuracion_sistema
CREATE UNIQUE INDEX configuracion_sistema_clave_key ON public.configuracion_sistema USING btree (clave);

-- Tabla entrega_recursos
CREATE TABLE IF NOT EXISTS entrega_recursos (
  id bigint NOT NULL DEFAULT nextval('entrega_recursos_id_seq'::regclass),
  id_estudiante bigint NOT NULL,
  id_recurso bigint NOT NULL,
  cantidad_entregada integer NOT NULL DEFAULT 1,
  fecha_entrega timestamp with time zone NOT NULL DEFAULT now(),
  observaciones text,
  PRIMARY KEY (id),
  FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id),
  FOREIGN KEY (id_recurso) REFERENCES recursos(id)
);

-- Índices para entrega_recursos
CREATE INDEX idx_entrega_estudiante_fecha ON public.entrega_recursos USING btree (id_estudiante, fecha_entrega DESC);

-- Tabla entrevistas
CREATE TABLE IF NOT EXISTS entrevistas (
  id bigint NOT NULL DEFAULT nextval('entrevistas_id_seq'::regclass),
  id_estudiante bigint NOT NULL,
  id_orientador bigint NOT NULL,
  fecha_entrevista timestamp with time zone NOT NULL,
  motivo text NOT NULL,
  observaciones text,
  estado character varying(50) NOT NULL DEFAULT 'Pendiente'::character varying,
  PRIMARY KEY (id),
  FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id),
  FOREIGN KEY (id_orientador) REFERENCES usuarios(id)
);

-- Índices para entrevistas
CREATE INDEX idx_entrevistas_estudiante_fecha ON public.entrevistas USING btree (id_estudiante, fecha_entrevista DESC);

-- Tabla estudiantes
CREATE TABLE IF NOT EXISTS estudiantes (
  id bigint NOT NULL DEFAULT nextval('estudiantes_id_seq'::regclass),
  nombre character varying(100) NOT NULL,
  apellido character varying(100) NOT NULL,
  rut character varying(20) NOT NULL,
  email VARCHAR(255),
  telefono character varying(30),
  direccion character varying(200),
  fecha_nacimiento date,
  curso character varying(50),
  especialidad character varying(100),
  situacion_economica character varying(100),
  fecha_registro timestamp with time zone NOT NULL DEFAULT now(),
  estado character varying(20) NOT NULL DEFAULT 'Activo'::character varying,
  PRIMARY KEY (id)
);

-- Índices para estudiantes
CREATE UNIQUE INDEX estudiantes_rut_key ON public.estudiantes USING btree (rut);

-- Tabla evaluaciones_vocacionales
CREATE TABLE IF NOT EXISTS evaluaciones_vocacionales (
  id bigint NOT NULL DEFAULT nextval('evaluaciones_vocacionales_id_seq'::regclass),
  id_estudiante bigint NOT NULL,
  tipo_evaluacion character varying(100) NOT NULL,
  resultados text NOT NULL,
  fecha_evaluacion timestamp with time zone NOT NULL,
  nombre_completo character varying(200) NOT NULL,
  curso character varying(50) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id)
);

-- Índices para evaluaciones_vocacionales
CREATE INDEX idx_evalvoc_estudiante_fecha ON public.evaluaciones_vocacionales USING btree (id_estudiante, fecha_evaluacion DESC);

-- Tabla historial_academico
CREATE TABLE IF NOT EXISTS historial_academico (
  id bigint NOT NULL DEFAULT nextval('historial_academico_id_seq'::regclass),
  id_estudiante bigint NOT NULL,
  promedio_general numeric,
  asistencia numeric,
  observaciones_academicas text,
  fecha_actualizacion timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id)
);

-- Índices para historial_academico
CREATE INDEX idx_hist_estudiante_fecha ON public.historial_academico USING btree (id_estudiante, fecha_actualizacion DESC);

-- Tabla intervenciones
CREATE TABLE IF NOT EXISTS intervenciones (
  id bigint NOT NULL DEFAULT nextval('intervenciones_id_seq'::regclass),
  id_estudiante bigint NOT NULL,
  accion text NOT NULL,
  responsable character varying(100) NOT NULL,
  fecha date NOT NULL,
  meta text,
  compromiso text,
  completado boolean NOT NULL DEFAULT false,
  id_profesional bigint,
  PRIMARY KEY (id),
  FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id),
  FOREIGN KEY (id_profesional) REFERENCES usuarios(id)
);

-- Índices para intervenciones
CREATE INDEX idx_intervenciones_estudiante_fecha ON public.intervenciones USING btree (id_estudiante, fecha DESC);

-- Tabla logs_actividad
CREATE TABLE IF NOT EXISTS logs_actividad (
  id bigint NOT NULL DEFAULT nextval('logs_actividad_id_seq'::regclass),
  id_usuario bigint,
  accion text NOT NULL,
  tabla_afectada character varying(100),
  id_registro bigint,
  datos_anteriores text,
  datos_nuevos text,
  ip_address character varying(45),
  user_agent text,
  fecha_accion timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

-- Índices para logs_actividad
CREATE INDEX idx_logs_fecha ON public.logs_actividad USING btree (fecha_accion DESC);

-- Tabla movimiento_recursos
CREATE TABLE IF NOT EXISTS movimiento_recursos (
  id bigint NOT NULL DEFAULT nextval('movimiento_recursos_id_seq'::regclass),
  id_recurso bigint NOT NULL,
  tipo_movimiento character varying(30) NOT NULL,
  cantidad integer NOT NULL,
  fecha timestamp with time zone NOT NULL DEFAULT now(),
  observaciones text,
  id_estudiante bigint,
  responsable character varying(100),
  PRIMARY KEY (id),
  FOREIGN KEY (id_recurso) REFERENCES recursos(id),
  FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id)
);

-- Índices para movimiento_recursos
CREATE INDEX idx_movrec_fecha ON public.movimiento_recursos USING btree (fecha DESC);

-- Tabla notificaciones
CREATE TABLE IF NOT EXISTS notificaciones (
  id bigint NOT NULL DEFAULT nextval('notificaciones_id_seq'::regclass),
  id_usuario bigint NOT NULL,
  tipo character varying(50) NOT NULL,
  titulo character varying(200) NOT NULL,
  mensaje text NOT NULL,
  prioridad character varying(20) NOT NULL DEFAULT 'Normal'::character varying,
  categoria character varying(50),
  id_estudiante bigint,
  fecha_limite timestamp with time zone,
  leida boolean NOT NULL DEFAULT false,
  accion_requerida text,
  fecha_creacion timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
  FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id)
);

-- Índices para notificaciones
CREATE INDEX idx_notif_usuario_leida ON public.notificaciones USING btree (id_usuario, leida);

-- Tabla permisos_roles
CREATE TABLE IF NOT EXISTS permisos_roles (
  id bigint NOT NULL DEFAULT nextval('permisos_roles_id_seq'::regclass),
  rol character varying(50) NOT NULL,
  modulo character varying(50) NOT NULL,
  accion character varying(50) NOT NULL,
  permitido boolean NOT NULL DEFAULT false,
  PRIMARY KEY (id)
);

-- Índices para permisos_roles
CREATE UNIQUE INDEX uq_permisos_roles ON public.permisos_roles USING btree (rol, modulo, accion);

-- Tabla plantillas_reportes
CREATE TABLE IF NOT EXISTS plantillas_reportes (
  id bigint NOT NULL DEFAULT nextval('plantillas_reportes_id_seq'::regclass),
  nombre character varying(150) NOT NULL,
  descripcion text,
  tipo_reporte character varying(50) NOT NULL,
  configuracion text NOT NULL,
  activa boolean NOT NULL DEFAULT true,
  creado_por bigint NOT NULL,
  fecha_creacion timestamp with time zone NOT NULL DEFAULT now(),
  fecha_modificacion timestamp with time zone,
  PRIMARY KEY (id),
  FOREIGN KEY (creado_por) REFERENCES usuarios(id)
);

-- Tabla recursos
CREATE TABLE IF NOT EXISTS recursos (
  id bigint NOT NULL DEFAULT nextval('recursos_id_seq'::regclass),
  nombre character varying(150) NOT NULL,
  tipo_recurso character varying(50),
  descripcion text,
  stock integer NOT NULL DEFAULT 0,
  activo boolean NOT NULL DEFAULT true,
  fecha_creacion timestamp without time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Tabla seguimiento
CREATE TABLE IF NOT EXISTS seguimiento (
  id bigint NOT NULL DEFAULT nextval('seguimiento_id_seq'::regclass),
  id_estudiante bigint NOT NULL,
  fecha date NOT NULL,
  tipo character varying(50) NOT NULL,
  descripcion text NOT NULL,
  profesional character varying(100),
  subtipo character varying(100),
  archivo character varying(500),
  urgencias character varying(100),
  PRIMARY KEY (id),
  FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id)
);

-- Índices para seguimiento
CREATE INDEX idx_seguimiento_estudiante_fecha ON public.seguimiento USING btree (id_estudiante, fecha DESC);

-- Tabla seguimiento_academico
CREATE TABLE IF NOT EXISTS seguimiento_academico (
  id bigint NOT NULL DEFAULT nextval('seguimiento_academico_id_seq'::regclass),
  id_estudiante bigint NOT NULL,
  asignatura character varying(100) NOT NULL,
  nota numeric NOT NULL,
  promedio_curso numeric,
  fecha date NOT NULL DEFAULT CURRENT_DATE,
  observaciones text,
  PRIMARY KEY (id),
  FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id)
);

-- Índices para seguimiento_academico
CREATE INDEX idx_segacad_estudiante_fecha ON public.seguimiento_academico USING btree (id_estudiante, fecha DESC);

-- Tabla seguimiento_cronologico
CREATE TABLE IF NOT EXISTS seguimiento_cronologico (
  id bigint NOT NULL DEFAULT nextval('seguimiento_cronologico_id_seq'::regclass),
  id_estudiante bigint NOT NULL,
  fecha timestamp with time zone NOT NULL DEFAULT now(),
  titulo character varying(200),
  descripcion text,
  profesional character varying(100),
  PRIMARY KEY (id),
  FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id)
);

-- Índices para seguimiento_cronologico
CREATE INDEX idx_segcron_estudiante_fecha ON public.seguimiento_cronologico USING btree (id_estudiante, fecha DESC);

-- Tabla seguimiento_psicosocial
CREATE TABLE IF NOT EXISTS seguimiento_psicosocial (
  id bigint NOT NULL DEFAULT nextval('seguimiento_psicosocial_id_seq'::regclass),
  id_estudiante bigint NOT NULL,
  fecha date NOT NULL,
  motivo character varying(255) NOT NULL,
  objetivos text,
  plan_intervencion text,
  profesional_asignado character varying(255) NOT NULL,
  estado character varying(50) NOT NULL DEFAULT 'Pendiente'::character varying,
  observaciones text,
  PRIMARY KEY (id),
  FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id)
);

-- Índices para seguimiento_psicosocial
CREATE INDEX idx_segpsi_estudiante_fecha ON public.seguimiento_psicosocial USING btree (id_estudiante, fecha DESC);

-- Tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id bigint NOT NULL DEFAULT nextval('usuarios_id_seq'::regclass),
  nombre character varying(100) NOT NULL,
  apellido character varying(100) NOT NULL,
  rut character varying(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password text NOT NULL,
  rol character varying(30) NOT NULL,
  estado character varying(20) NOT NULL DEFAULT 'Activo'::character varying,
  fecha_creacion timestamp with time zone NOT NULL DEFAULT now(),
  reset_token text,
  reset_token_expiration timestamp with time zone,
  PRIMARY KEY (id)
);

-- Índices para usuarios
CREATE UNIQUE INDEX usuarios_rut_key ON public.usuarios USING btree (rut);
CREATE UNIQUE INDEX usuarios_email_key ON public.usuarios USING btree (email);

