@echo off
REM Script de instalación rápida para Sistema de Gestión de Bebidas
REM Windows Batch File

echo ========================================
echo 🚀 SISTEMA DE GESTIÓN DE BEBIDAS
echo ========================================
echo.

REM Verificar si Node.js está instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado.
    echo Por favor, instale Node.js desde: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
node --version
echo.

REM Verificar si npm está instalado
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm no está instalado.
    echo Por favor, reinstale Node.js.
    echo.
    pause
    exit /b 1
)

echo ✅ npm encontrado
npm --version
echo.

REM Instalar dependencias
echo 📦 Instalando dependencias...
echo.
call npm install

if %errorlevel% neq 0 (
    echo ❌ Error instalando dependencias.
    echo.
    pause
    exit /b 1
)

echo ✅ Dependencias instaladas exitosamente
echo.

REM Crear directorios necesarios
if not exist logs mkdir logs
if not exist backups mkdir backups
if not exist uploads mkdir uploads

echo ✅ Directorios creados
echo.

REM Copiar archivo de configuración de entorno si no existe
if not exist .env (
    echo 📄 Creando archivo de configuración...
    copy .env.example .env >nul
    echo ✅ Archivo .env creado
) else (
    echo ✅ Archivo .env ya existe
)
echo.

REM Mostrar información de uso
echo ========================================
echo ✅ INSTALACIÓN COMPLETADA
echo ========================================
echo.
echo 🚀 Para iniciar el sistema:
echo.
echo    npm start
echo.
echo 📱 El sistema estará disponible en:
echo    http://localhost:3000
echo.
echo 🔑 Credenciales de acceso:
echo    Usuario: admin
echo    Contraseña: admin123
echo.
echo 📄 Ver README.md para más información
echo.
echo 🛠️ Para desarrollo con auto-reload:
echo    npm run dev
echo.

REM Preguntar si desea iniciar el servidor ahora
set /p startNow=¿Desea iniciar el servidor ahora? (s/n): 
if /i "%startNow%"=="s" (
    echo.
    echo 🚀 Iniciando servidor...
    npm start
) else (
    echo.
    echo ✅ Instalación completada. Puede iniciar el servidor cuando lo desee.
    pause
)