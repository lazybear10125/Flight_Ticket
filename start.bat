@echo off
echo ========================================================
echo   KHOI DONG HE THONG BAN VE MAY BAY BAYVIET AIR
echo ========================================================
echo.
echo [1/2] Khoi dong Backend API Server (Port 5000)...
start "BayViet Server" cmd /k "cd server && node index.js"

echo [2/2] Khoi dong Frontend React Client (Port 5173)...
start "BayViet Client" cmd /k "cd client && npm run dev"

echo.
echo Dang mo trinh duyet den http://localhost:5173 ...
timeout /t 3 >nul
start http://localhost:5173
echo.
echo He thong da san sang! Nhan Ctrl+C tai cua so terminal de dung lai.
pause
