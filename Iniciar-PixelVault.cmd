@echo off
setlocal
cd /d "%~dp0"
title PixelVault
echo PixelVault - iniciando API e aplicativo web...
where node >nul 2>nul
if errorlevel 1 goto :node_missing
node -e "const [major,minor]=process.versions.node.split('.').map(Number); if(major<22 || (major===22 && minor<13)) process.exit(1)"
if errorlevel 1 goto :node_missing
where npm >nul 2>nul
if errorlevel 1 goto :node_missing
if not exist "node_modules\expo\bin\cli" (
  echo Instalando dependencias. Aguarde...
  call npm ci
  if errorlevel 1 goto :failed
)
node scripts\start-local.mjs %*
if errorlevel 1 goto :failed
exit /b 0

:node_missing
echo Instale Node.js 22.13 ou superior com npm e abra novamente este arquivo.
echo Download: https://nodejs.org/en/download
goto :failed

:failed
echo.
echo Nao foi possivel iniciar. Confira a mensagem acima.
echo Guia: documentos\PixelVault_Como_Executar.md
pause
exit /b 1
