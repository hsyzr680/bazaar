@echo off
chcp 65001 >nul
echo ========================================
echo    نور بازار - Noor Bazaar
echo ========================================
echo.

cd /d "%~dp0"

if not exist "node_modules" (
    echo تثبيت الحزم...
    call npm install
    call npm install --prefix client
    call npm install --prefix server
    echo.
)

echo [1/2] تشغيل السيرفر على المنفذ 3000...
start "Noor Bazaar Server" cmd /k "cd /d "%~dp0server" && node server.js"

timeout /t 3 /nobreak >nul

echo [2/2] تشغيل الواجهة على المنفذ 5173...
start "Noor Bazaar Client" cmd /k "cd /d "%~dp0client" && npm run dev"

timeout /t 5 /nobreak >nul
echo.
echo ========================================
echo   افتح المتصفح واكتب في شريط العنوان:
echo   http://localhost:5173
echo ========================================
echo.
echo (لا تغلق نوافذ الـ cmd التي فتحت)
echo.
pause
