# Dockerfile para SIGO Frontend
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json del frontend
COPY sigo-frontend/package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código del frontend
COPY sigo-frontend/ .

# Construir la aplicación
RUN npm run build

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
