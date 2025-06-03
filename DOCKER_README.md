# Docker Setup para Sistemas Manager

Este proyecto incluye una configuración completa de Docker para desarrollo y producción.

## Archivos de Docker

- `Dockerfile`: Configuración multi-stage para desarrollo y producción
- `.dockerignore`: Archivos y carpetas excluidos del contexto de Docker
- `docker-compose.yml`: Orquestación de servicios con perfiles
- `nginx.conf`: Configuración optimizada de Nginx para SPA

## Comandos de Docker

### Desarrollo

```bash
# Construir y ejecutar en modo desarrollo
docker-compose --profile dev up --build

# Ejecutar en segundo plano
docker-compose --profile dev up -d --build

# Ver logs
docker-compose --profile dev logs -f
```

### Producción

```bash
# Construir y ejecutar en modo producción
docker-compose --profile prod up --build

# Ejecutar en segundo plano
docker-compose --profile prod up -d --build
```

### Comandos Docker directo

```bash
# Desarrollo
docker build --target development -t sistemas-manager:dev .
docker run -p 5173:5173 -v ${PWD}:/app -v /app/node_modules sistemas-manager:dev

# Producción
docker build --target production -t sistemas-manager:prod .
docker run -p 80:80 sistemas-manager:prod
```

## URLs de Acceso

- **Desarrollo**: http://localhost:5173
- **Producción**: http://localhost

## Características

### Desarrollo

- Hot reload habilitado
- Volúmenes montados para cambios en tiempo real
- Puerto 5173 expuesto

### Producción

- Aplicación construida y optimizada
- Servida con Nginx
- Configuración SPA para React Router
- Headers de seguridad
- Compresión gzip
- Caché optimizado para recursos estáticos

## Variables de Entorno

### 🔧 Configuración Inicial (OBLIGATORIO)

**Antes de ejecutar Docker, debes configurar las variables de entorno:**

1. **Copia el archivo de ejemplo:**

   ```powershell
   Copy-Item .env.docker.example .env.docker
   ```

2. **Edita `.env.docker` con tus valores reales:**

   ```bash
   # DESARROLLO
   VITE_BACKEND_URL=http://localhost:8080
   VITE_MOODLE_URL=https://tu-moodle-real.com/webservice/rest/server.php
   VITE_MOODLE_TOKEN=tu_token_moodle_real

   # PRODUCCIÓN
   VITE_BACKEND_URL_PROD=https://tu-backend-produccion.com
   VITE_MOODLE_URL_PROD=https://tu-moodle-real.com/webservice/rest/server.php
   VITE_MOODLE_TOKEN_PROD=tu_token_moodle_produccion
   ```

### 🛡️ Seguridad

- ✅ El archivo `.env.docker` está en `.gitignore` (no se sube a Git)
- ✅ Los tokens sensibles están protegidos
- ✅ Usa `.env.docker.example` para compartir la estructura con otros desarrolladores

### ⚠️ Importante

- **NUNCA** commits el archivo `.env.docker`
- **SIEMPRE** usa `.env.docker.example` para documentar qué variables necesitas

## Parar Servicios

```bash
# Parar servicios de desarrollo
docker-compose --profile dev down

# Parar servicios de producción
docker-compose --profile prod down

# Parar todos los servicios y limpiar volúmenes
docker-compose down -v
```

## Limpiar Imágenes

```bash
# Limpiar imágenes no utilizadas
docker image prune

# Limpiar todo (cuidado, esto eliminará todas las imágenes no utilizadas)
docker system prune -a
```
