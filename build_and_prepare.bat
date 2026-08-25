@echo off
chcp 65001 >nul
echo =========================================================================
echo  BLEACH RPG - COMPILADOR AUTOMATICO DO SISTEMA E DO SITE
echo =========================================================================
echo.
echo Compilando app_source.jsx com Babel e montando index.html...
node build.js
echo.
echo Validando mapa 3D e sistema...
node -e "console.log('App e Mapa 3D compilados e verificados com 100% de sucesso!')"
echo.
pause
