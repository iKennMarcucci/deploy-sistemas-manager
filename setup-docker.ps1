# Script de configuración inicial para Docker
# Ejecuta este script la primera vez que configures el proyecto

Write-Host "🔧 Configuración inicial de Docker para Sistemas Manager" -ForegroundColor Cyan
Write-Host ""

# Verificar si existe .env.docker
if (Test-Path ".env.docker") {
    Write-Host "⚠️  El archivo .env.docker ya existe." -ForegroundColor Yellow
    $response = Read-Host "¿Deseas sobrescribirlo? (s/N)"
    if ($response -ne "s" -and $response -ne "S") {
        Write-Host "❌ Configuración cancelada." -ForegroundColor Red
        exit
    }
}

# Copiar archivo de ejemplo
if (Test-Path ".env.docker.example") {
    Copy-Item ".env.docker.example" ".env.docker"
    Write-Host "✅ Archivo .env.docker creado desde .env.docker.example" -ForegroundColor Green
} else {
    Write-Host "❌ Error: No se encontró .env.docker.example" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📝 Pasos siguientes:" -ForegroundColor Yellow
Write-Host "1. Edita el archivo .env.docker con tus valores reales"
Write-Host "2. Ejecuta: .\docker-scripts.ps1 dev"
Write-Host ""
Write-Host "🔐 IMPORTANTE: El archivo .env.docker contiene información sensible" -ForegroundColor Red
Write-Host "   NO lo subas a Git (ya está en .gitignore)" -ForegroundColor Red
Write-Host ""

# Preguntar si quiere abrir el archivo para editar
$openFile = Read-Host "¿Deseas abrir .env.docker para editarlo ahora? (s/N)"
if ($openFile -eq "s" -or $openFile -eq "S") {
    if (Get-Command "code" -ErrorAction SilentlyContinue) {
        code .env.docker
        Write-Host "📝 Archivo abierto en VS Code" -ForegroundColor Green
    } else {
        notepad .env.docker
        Write-Host "📝 Archivo abierto en Notepad" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "🚀 Configuración completada. ¡Listo para usar Docker!" -ForegroundColor Green
