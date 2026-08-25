@echo off
chcp 65001 >nul
echo =========================================================================
echo  BLEACH RPG - DEPLOY AUTOMATIZADO DAS CLOUD FUNCTIONS (FIREBASE)
echo =========================================================================
echo.

echo [1/3] Verificando autenticação no Firebase...
cmd.exe /c "npx firebase-tools login"

echo.
echo [2/3] Instalando dependencias de functions...
cd functions
cmd.exe /c "npm install"
cd ..

echo.
echo [3/3] Fazendo deploy da Cloud Function agendada (03:00 da madrugada)...
cmd.exe /c "npx firebase-tools deploy --only functions"

echo.
echo =========================================================================
echo  DEPLOY CONCLUIDO! A limpeza agendada das 03:00 esta ATIVA no Firebase.
echo =========================================================================
pause
