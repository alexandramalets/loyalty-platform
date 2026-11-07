@echo off
cd /d "%~dp0"
set COMPOSE_PROJECT_NAME=loyalty
echo Stopping frontend, backend and PostgreSQL...
for /f "tokens=5" %%P in ('netstat -ano ^| findstr ":5173" ^| findstr "LISTENING"') do taskkill /PID %%P /F >nul 2>&1
for /f "tokens=5" %%P in ('netstat -ano ^| findstr ":8090" ^| findstr "LISTENING"') do taskkill /PID %%P /F >nul 2>&1
docker compose -f "%~dp0docker-compose.yml" stop postgres >nul 2>&1
echo Done.
