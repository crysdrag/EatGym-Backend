@echo off
chcp 65001 > nul
echo ==========================================
echo    EatGym - Chay Local tren PC Windows
echo ==========================================
start "EatGym Ngrok" cmd /k "ngrok.exe http 3000 --domain=kindly-absolve-concur.ngrok-free.dev"
timeout /t 2 > nul
start "EatGym API Server" cmd /k "node src/server.js"
echo Backend va Ngrok da duoc khoi dong trong 2 cua so rieng!
