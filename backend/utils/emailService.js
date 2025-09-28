const nodemailer = require("nodemailer");

const enviarCorreoAgenda = async ({
  to,
  estudiante,
  fecha,
  hora,
  motivo,
  profesional,
  cc = null,
}) => {
  // Simulación para entorno de desarrollo
  if (process.env.NODE_ENV === "development") {
    console.log("📨 [SIMULADO] Enviar correo a:", to);
    console.log("👤 Estudiante:", estudiante);
    console.log("📅 Fecha:", fecha, "| ⏰ Hora:", hora);
    console.log("📌 Motivo:", motivo);
    console.log("👨‍⚕️ Profesional asignado:", profesional);
    if (cc) console.log("📧 Copia a:", cc);
    console.log("✅ Fin de simulación de correo");
    return;
  }

  // Producción: enviar correo real
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || "587"),
    secure: process.env.MAIL_SECURE === "true", // true para 465, false para otros
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"SIGO - Agenda" <${process.env.MAIL_USER}>`,
    to,
    cc: cc || undefined,
    subject: "📅 Entrevista Agendada",
    html: `
      <h2>📌 Detalle de la Entrevista</h2>
      <p><strong>Estudiante:</strong> ${estudiante}</p>
      <p><strong>Fecha:</strong> ${fecha}</p>
      <p><strong>Hora:</strong> ${hora}</p>
      <p><strong>Motivo:</strong> ${motivo}</p>
      <p><strong>Profesional:</strong> ${profesional}</p>
      <hr/>
      <p>Este mensaje fue enviado automáticamente por el sistema SIGO.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const enviarCodigoRecuperacion = async ({ to, codigo }) => {
  // Verificar si las variables de email están configuradas
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.log("📨 [SIMULADO] Variables de email no configuradas");
    console.log("📨 [SIMULADO] Enviar código a:", to);
    console.log("🔑 Código de recuperación:", codigo);
    console.log("💡 Para habilitar emails reales, configura MAIL_USER y MAIL_PASS en .env.production");
    console.log("🌐 En producción, las variables se cargan desde .env.production");
    return;
  }

  if (process.env.NODE_ENV === "development") {
    console.log("📨 [SIMULADO] Enviar código a:", to);
    console.log("🔑 Código de recuperación:", codigo);
    console.log("💡 Para enviar emails reales, cambia NODE_ENV=production");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || "587"),
    secure: process.env.MAIL_SECURE === "true",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"SIGO Sistema" <${process.env.MAIL_USER}>`,
    to,
    subject: "🔑 Código de recuperación de contraseña - SIGO",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #0e1a33; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">🔑 Recuperación de Contraseña</h1>
        </div>
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Hola,</p>
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            Has solicitado recuperar tu contraseña en el sistema SIGO. 
            Usa el siguiente código para continuar:
          </p>
          <div style="background: #0e1a33; color: white; padding: 20px; text-align: center; margin: 30px 0; border-radius: 8px;">
            <h1 style="margin: 0; font-size: 36px; letter-spacing: 5px;">${codigo}</h1>
          </div>
          <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
            ⏰ Este código expira en <strong>15 minutos</strong>
          </p>
          <p style="font-size: 14px; color: #666; margin-bottom: 20px;">
            Si no solicitaste este cambio, ignora este email.
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
            Sistema SIGO - Liceo Técnico<br>
            Este mensaje fue enviado automáticamente
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email de recuperación enviado a: ${to}`);
  } catch (error) {
    console.error("❌ Error enviando email:", error);
    throw error;
  }
};

const enviarCitacionReunion = async ({ to, apoderado, estudiante, fecha, hora, lugar, motivo, profesional }) => {
  // Verificar si las variables de email están configuradas
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.log("📨 [SIMULADO] Variables de email no configuradas");
    console.log("📨 [SIMULADO] Enviar citación a:", to);
    console.log("👤 Apoderado:", apoderado);
    console.log("👤 Estudiante:", estudiante);
    console.log("📅 Fecha:", fecha, "| ⏰ Hora:", hora);
    console.log("📍 Lugar:", lugar);
    console.log("📌 Motivo:", motivo);
    console.log("👨‍⚕️ Profesional:", profesional);
    return;
  }

  if (process.env.NODE_ENV === "development") {
    console.log("📨 [SIMULADO] Enviar citación a:", to);
    console.log("👤 Apoderado:", apoderado);
    console.log("👤 Estudiante:", estudiante);
    console.log("📅 Fecha:", fecha, "| ⏰ Hora:", hora);
    console.log("📍 Lugar:", lugar);
    console.log("📌 Motivo:", motivo);
    console.log("👨‍⚕️ Profesional:", profesional);
    console.log("💡 Para enviar emails reales, cambia NODE_ENV=production");
    return;
  }

  const transporter = nodemailer.createTransporter({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || "587"),
    secure: process.env.MAIL_SECURE === "true",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"SIGO - Comunicación Familiar" <${process.env.MAIL_USER}>`,
    to,
    subject: `📅 Citación a Reunión - ${estudiante}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #0e1a33; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">📅 Citación a Reunión</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Sistema SIGO - Liceo Técnico</p>
        </div>
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Estimado/a ${apoderado}</h2>
          
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            Le solicitamos su presencia para una reunión sobre el desempeño académico de su pupilo/a:
          </p>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;">
            <h3 style="color: #333; margin-bottom: 15px;">👤 Información del Estudiante</h3>
            <p style="color: #666; margin: 5px 0;"><strong>Nombre:</strong> ${estudiante}</p>
          </div>

          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1976d2; margin-bottom: 15px;">📅 Detalles de la Reunión</h3>
            <p style="color: #333; margin: 5px 0;"><strong>📅 Fecha:</strong> ${fecha}</p>
            <p style="color: #333; margin: 5px 0;"><strong>⏰ Hora:</strong> ${hora}</p>
            <p style="color: #333; margin: 5px 0;"><strong>📍 Lugar:</strong> ${lugar}</p>
            <p style="color: #333; margin: 5px 0;"><strong>👨‍⚕️ Profesional:</strong> ${profesional}</p>
            <p style="color: #333; margin: 5px 0;"><strong>📌 Motivo:</strong> ${motivo}</p>
          </div>

          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h4 style="color: #856404; margin-bottom: 10px;">📋 Importante:</h4>
            <ul style="color: #856404; margin: 0; padding-left: 20px;">
              <li>Por favor confirme su asistencia</li>
              <li>Llegue 5 minutos antes de la hora acordada</li>
              <li>Traiga su cédula de identidad</li>
              <li>En caso de no poder asistir, contacte con anticipación</li>
            </ul>
          </div>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
            Sistema SIGO - Liceo Técnico<br>
            Este mensaje fue enviado automáticamente
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Citación enviada a: ${to} (${apoderado})`);
  } catch (error) {
    console.error("❌ Error enviando citación:", error);
    throw error;
  }
};

const enviarTestVocacionalQR = async ({ to, estudiante, testType, qrCodeUrl, testUrl }) => {
  // Verificar si las variables de email están configuradas
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.log("📨 [SIMULADO] Variables de email no configuradas");
    console.log("📨 [SIMULADO] Enviar test vocacional a:", to);
    console.log("👤 Estudiante:", estudiante.nombre, estudiante.apellido);
    console.log("🧪 Test:", testType);
    console.log("🔗 URL:", testUrl);
    return;
  }

  if (process.env.NODE_ENV === "development") {
    console.log("📨 [SIMULADO] Enviar test vocacional a:", to);
    console.log("👤 Estudiante:", estudiante.nombre, estudiante.apellido);
    console.log("🧪 Test:", testType);
    console.log("🔗 URL:", testUrl);
    console.log("💡 Para enviar emails reales, cambia NODE_ENV=production");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || "587"),
    secure: process.env.MAIL_SECURE === "true",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const testNames = {
    kuder: "Test de Intereses Vocacionales (Kuder)",
    holland: "Test de Personalidad Vocacional (Holland)",
    aptitudes: "Test de Aptitudes Vocacionales"
  };

  const mailOptions = {
    from: `"SIGO - Tests Vocacionales" <${process.env.MAIL_USER}>`,
    to,
    subject: `🧪 ${testNames[testType]} - ${estudiante.nombre} ${estudiante.apellido}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #0e1a33; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">🧪 Test Vocacional</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">${testNames[testType]}</p>
        </div>
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">👤 Estudiante: ${estudiante.nombre} ${estudiante.apellido}</h2>
          ${estudiante.curso ? `<p style="color: #666; margin-bottom: 20px;"><strong>📚 Curso:</strong> ${estudiante.curso}</p>` : ''}
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px solid #e9ecef;">
            <h3 style="color: #333; margin-bottom: 15px;">📱 Código QR para acceso móvil</h3>
            <div style="display: inline-block; padding: 10px; background: #f8f9fa; border-radius: 8px; margin: 10px 0;">
              <img src="${qrCodeUrl}" alt="Código QR" style="max-width: 200px; height: 200px; width: 200px; border-radius: 4px; display: block;">
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 10px;">
              Escanea este código con tu celular para acceder al test
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 5px;">
              Si no puedes ver el QR, usa el enlace directo de abajo
            </p>
          </div>

          <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1976d2; margin-bottom: 10px;">🔗 Enlace directo</h3>
            <p style="color: #333; margin-bottom: 10px;">También puedes acceder directamente desde este enlace:</p>
            <a href="${testUrl}" style="color: #1976d2; text-decoration: none; word-break: break-all; font-size: 14px;">
              ${testUrl}
            </a>
          </div>

          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h4 style="color: #856404; margin-bottom: 10px;">📋 Instrucciones:</h4>
            <ol style="color: #856404; margin: 0; padding-left: 20px;">
              <li>Escanea el código QR con tu celular</li>
              <li>O haz clic en el enlace directo</li>
              <li>Completa el test con calma</li>
              <li>Los resultados se guardarán automáticamente</li>
            </ol>
          </div>

          <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #17a2b8;">
            <p style="color: #0c5460; margin: 0; font-size: 14px;">
              <strong>⏰ Tiempo estimado:</strong> 15-30 minutos<br>
              <strong>📱 Dispositivo recomendado:</strong> Celular o tablet<br>
              <strong>🌐 Conexión:</strong> Requiere internet
            </p>
          </div>

          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #dee2e6;">
            <h4 style="color: #495057; margin-bottom: 10px; font-size: 16px;">📋 Información del Test</h4>
            <p style="color: #6c757d; margin: 5px 0; font-size: 14px;">
              <strong>Estudiante:</strong> ${estudiante.nombre} ${estudiante.apellido}
            </p>
            <p style="color: #6c757d; margin: 5px 0; font-size: 14px;">
              <strong>Tipo de Test:</strong> ${testNames[testType]}
            </p>
            <p style="color: #6c757d; margin: 5px 0; font-size: 14px;">
              <strong>URL del Test:</strong> ${testUrl}
            </p>
          </div>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
            Sistema SIGO - Liceo Técnico<br>
            Este mensaje fue enviado automáticamente
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Test vocacional enviado a: ${to} (${testType})`);
  } catch (error) {
    console.error("❌ Error enviando test vocacional:", error);
    throw error;
  }
};

module.exports = { 
  enviarCorreoAgenda, 
  enviarCodigoRecuperacion, 
  enviarTestVocacionalQR,
  enviarCitacionReunion
};
