@echo off
chcp 65001 > nul
title Melodia CCB - Gerador de Executavel Windows (.EXE)
color 0b

echo =====================================================================
echo       MELODIA CCB - GERADOR AUTOMATICO DO EXECUTAVEL (.EXE)
echo       CCB Jardim Maria Rosa - Gestao Pedagogica e Orquestral
echo =====================================================================
echo.

:: 1. Verificar instalacao do Node.js
echo [1/4] Verificando se o Node.js esta instalado no seu computador...
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0c
    echo.
    echo [ERRO] O Node.js nao foi encontrado no seu computador!
    echo Por favor, instale o Node.js gratuito baixando em: https://nodejs.org
    echo Apos instalar o Node.js, execute este arquivo novamente.
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
echo [OK] Node.js detectado com sucesso: %NODE_VER%
echo.

:: 2. Instalar dependencias
echo [2/4] Instalando dependencias necessarias do sistema...
call npm install
if %errorlevel% neq 0 (
    color 0c
    echo.
    echo [AVISO] Houve um problema ao baixar pacotes. Tentando continuar...
    echo.
)
echo [OK] Dependencias prontas.
echo.

:: 3. Compilar interface React e empacotar com Electron
echo [3/4] Compilando e gerando o arquivo executavel (.exe) para Windows...
echo Isso pode levar de 1 a 2 minutos na primeira vez. Por favor, aguarde...
call npm run build:exe
if %errorlevel% neq 0 (
    color 0c
    echo.
    echo [ERRO] Ocorreu uma falha ao gerar o executavel (.exe).
    echo Verifique as mensagens de erro acima.
    echo.
    pause
    exit /b 1
)

:: 4. Finalizacao e abertura da pasta
color 0a
echo.
echo =====================================================================
echo [SUCESSO!] O EXECUTAVEL (.EXE) FOI GERADO COM SUCESSO!
echo =====================================================================
echo.
echo Os arquivos gerados estao na pasta: \dist_electron\
echo.
echo 1. "Melodia CCB Setup 1.0.0.exe" -> Instalador completo para Windows
echo 2. "Melodia CCB 1.0.0.exe"       -> Versao Portatil (abre direto sem instalar)
echo.
echo Abrindo a pasta no Windows Explorer agora...
explorer "dist_electron"
echo.
pause
