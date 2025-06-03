# Imagen base de Node.js con Alpine Linux para un tamaño menor
FROM node:18-alpine AS base

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Etapa de desarrollo
FROM base AS development

# Copiar el código fuente
COPY . .

# Exponer el puerto de desarrollo de Vite
EXPOSE 5173

# Comando para ejecutar en modo desarrollo
CMD ["pnpm", "dev", "--host", "0.0.0.0"]

# Etapa de construcción
FROM base AS build

# Argumentos de construcción para variables de entorno
ARG VITE_BACKEND_URL
ARG VITE_MOODLE_URL
ARG VITE_MOODLE_TOKEN

# Establecer las variables de entorno para el build
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_MOODLE_URL=$VITE_MOODLE_URL
ENV VITE_MOODLE_TOKEN=$VITE_MOODLE_TOKEN

# Copiar el código fuente
COPY . .

# Construir la aplicación para producción
RUN pnpm build

# Etapa de producción con Nginx
FROM nginx:alpine AS production

# Copiar los archivos construidos desde la etapa de build
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Comando para ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]
