#!/bin/bash

# Script de instalación rápida para Sistema de Gestión de Bebidas
# Linux/Mac Shell Script

echo "========================================"
echo "🚀 SISTEMA DE GESTIÓN DE BEBIDAS"
echo "========================================"
echo

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar si Node.js está instalado
if ! command_exists node; then
    echo "❌ Node.js no está instalado."
    echo "Por favor, instale Node.js desde: https://nodejs.org/"
    echo "O use un gestor de versiones como nvm: https://github.com/nvm-sh/nvm"
    echo
    exit 1
fi

echo "✅ Node.js encontrado"
node --version
echo

# Verificar si npm está instalado
if ! command_exists npm; then
    echo "❌ npm no está instalado."
    echo "Por favor, reinstale Node.js o instale npm por separado."
    echo
    exit 1
fi

echo "✅ npm encontrado"
npm --version
echo

# Instalar dependencias
echo "📦 Instalando dependencias..."
echo
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error instalando dependencias."
    echo
    exit 1
fi

echo "✅ Dependencias instaladas exitosamente"
echo

# Crear directorios necesarios
mkdir -p logs backups uploads

echo "✅ Directorios creados"
echo

# Copiar archivo de configuración de entorno si no existe
if [ ! -f .env ]; then
    echo "📄 Creando archivo de configuración..."
    cp .env.example .env
    echo "✅ Archivo .env creado"
else
    echo "✅ Archivo .env ya existe"
fi
echo

# Hacer ejecutable el script de instalación
chmod +x install.sh

# Mostrar información de uso
echo "========================================"
echo "✅ INSTALACIÓN COMPLETADA"
echo "========================================"
echo
echo "🚀 Para iniciar el sistema:"
echo
echo "    npm start"
echo
echo "📱 El sistema estará disponible en:"
echo "    http://localhost:3000"
echo
echo "🔑 Credenciales de acceso:"
echo "    Usuario: admin"
echo "    Contraseña: admin123"
echo
echo "📄 Ver README.md para más información"
echo
echo "🛠️ Para desarrollo con auto-reload:"
echo "    npm run dev"
echo

# Preguntar si desea iniciar el servidor ahora
read -p "¿Desea iniciar el servidor ahora? (s/n): " startNow

echo
if [ "$startNow" = "s" ] || [ "$startNow" = "S" ]; then
    echo "🚀 Iniciando servidor..."
    npm start
else
    echo "✅ Instalación completada. Puede iniciar el servidor cuando lo desee."
fi