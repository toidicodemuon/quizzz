@echo off
setlocal
set "APP_DIR=%~dp0"
cd /d "%APP_DIR%"

if not exist "package.json" (
  echo package.json not found in %CD%
  exit /b 1
)

if not exist "node_modules" (
  echo Installing dependencies...
  npm install --omit=dev
  if errorlevel 1 exit /b 1
)

set "NODE_ENV=production"
set "LICENSE_PATH=%APP_DIR%license\\license.json"
set "LICENSE_PUBLIC_KEY_PATH=%APP_DIR%license\\public.pem"

node src\\index.js
endlocal
