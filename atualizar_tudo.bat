@echo off
chcp 65001 >nul
echo =========================================================================
echo  BLEACH RPG - ATUALIZADOR COMPLETO (SITE + CLOUD FUNCTIONS)
echo =========================================================================
echo.

echo [Passo 1 de 4] Compilando arquivos do sistema (app.js e index.html)...
call node build.js

echo.
echo [Passo 2 de 4] Instalando dependencias de functions...
cd functions
call npm install
cd ..

echo.
echo [Passo 3 de 4] Verificando login no Firebase...
echo Se abrir uma janela no navegador, faca o login na sua conta Google do Firebase.
call npx.cmd firebase-tools login

echo.
echo [Passo 4 de 4] Enviando atualizacoes para o Firebase Hosting e Functions...
call npx.cmd firebase-tools deploy

echo.
echo =========================================================================
echo  ATUALIZACAO CONCLUIDA COM SUCESSO!
echo  1. O site online foi publicado no Firebase Hosting.
echo  2. As Cloud Functions e o Proxy Seguro de IA estao ativos.
echo  3. As regras de seguranca protegem a sua chave.
echo.
echo  Abra o site no navegador, aperte Ctrl + F5 e teste a IA!
echo =========================================================================
echo.
pause
