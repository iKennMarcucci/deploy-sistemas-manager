# Script para manejar contenedores Docker del Sistema Manager
# Uso: .\docker-scripts.ps1 [comando]

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("dev", "prod", "stop", "logs", "clean")]
    [string]$Action
)

switch ($Action) {
    "dev" {
        Write-Host "🚀 Iniciando entorno de desarrollo..." -ForegroundColor Green
        Write-Host "URL: http://localhost:5173" -ForegroundColor Cyan
        docker-compose --profile dev up --build
    }
    "prod" {
        Write-Host "🏭 Iniciando entorno de producción..." -ForegroundColor Green
        Write-Host "URL: http://localhost" -ForegroundColor Cyan
        docker-compose --profile prod up --build
    }
    "stop" {
        Write-Host "⏹️ Deteniendo todos los servicios..." -ForegroundColor Yellow
        docker-compose --profile dev down
        docker-compose --profile prod down
    }
    "logs" {
        Write-Host "📋 Mostrando logs..." -ForegroundColor Blue
        $profile = Read-Host "¿Qué perfil? (dev/prod)"
        docker-compose --profile $profile logs -f
    }
    "clean" {
        Write-Host "🧹 Limpiando imágenes y contenedores..." -ForegroundColor Red
        docker-compose down -v
        docker system prune -f
        Write-Host "✅ Limpieza completada" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "📝 Comandos disponibles:"
Write-Host "  .\docker-scripts.ps1 dev    - Entorno desarrollo"
Write-Host "  .\docker-scripts.ps1 prod   - Entorno producción"
Write-Host "  .\docker-scripts.ps1 stop   - Detener servicios"
Write-Host "  .\docker-scripts.ps1 logs   - Ver logs"
Write-Host "  .\docker-scripts.ps1 clean  - Limpiar Docker"
