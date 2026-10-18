@echo off
chcp 65001 >nul
cd /d "%~dp0"
where npm >nul 2>nul
if errorlevel 1 (
  echo Brak npm. Zainstaluj Node.js 22 LTS ze strony nodejs.org
  pause
  exit /b 1
)
if not exist node_modules (
  echo Instalacja zaleznosci...
  call npm install
  if errorlevel 1 (
    echo Blad instalacji. Sprawdz polaczenie z internetem.
    pause
    exit /b 1
  )
)
echo Uruchamianie KALTRUCK Studio...
echo Otworz w przegladarce http://localhost:4321
call npm run dev
pause
