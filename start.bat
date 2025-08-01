@echo off
echo Arret de toutes les instances Node.js existantes...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 >nul

echo Demarrage du bot Moon Shop...
node index.js

pause 