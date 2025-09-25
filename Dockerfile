# Dockerfile para SIGO Backend
FROM node:18-alpine

# Actualizado para Render deployment

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY backend/package*.json ./

# Instalar dependencias
RUN npm install --only=production

# Copiar el código del backend
COPY backend/ .

# Exponer el puerto
EXPOSE 3001

# Comando para iniciar la aplicación
CMD ["npm", "start"]
