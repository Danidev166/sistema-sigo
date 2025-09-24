# Dockerfile para el frontend
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Usar nginx para servir la aplicación
FROM nginx:alpine

# Copiar los archivos construidos
COPY --from=0 /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx para SPA
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer puerto 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]