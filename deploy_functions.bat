@echo off
chcp 65001 >nul
echo =========================================================================
echo  BLEACH RPG - DEPLOY AUTOMATIZADO DAS CLOUD FUNCTIONS & SEGURANCA IA
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
echo [3/3] Fazendo deploy das Cloud Functions (Proxy IA Seguro + Limpeza Madrugada) e Regras...
cmd.exe /c "npx firebase-tools deploy --only functions,database"

echo.
echo =========================================================================
echo  DEPLOY CONCLUIDO COM SUCESSO!
echo  1. Proxy de IA Seguro: ATIVO (Gera Shikai/Bankai para todos os aparelhos sem expor sua chave).
echo  2. Limpeza Agendada das 03:00: ATIVA.
echo  3. Regras de Seguranca: Chave Secreta PROTEGIDA no Realtime Database.
echo =========================================================================
pause

