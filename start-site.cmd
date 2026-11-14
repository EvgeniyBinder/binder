@echo off
chcp 65001 >nul
title AURUM — локальный сервер
cd /d "%~dp0app"
echo Запуск AURUM...
echo Не закрывайте это окно, пока пользуетесь сайтом.
start "" powershell.exe -NoProfile -Command "Start-Sleep -Seconds 3; Start-Process 'http://127.0.0.1:3000/'"
npm run dev -- --host 127.0.0.1 --port 3000 --strictPort
echo.
echo Сервер остановлен.
pause
