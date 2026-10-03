@echo off
setlocal

cd /d "%~dp0"

if exist "%~dp0mvnw.cmd" (
    call "%~dp0mvnw.cmd" spring-boot:run
    exit /b %errorlevel%
)

where mvn.cmd >nul 2>&1
if not errorlevel 1 (
    call mvn.cmd spring-boot:run
    exit /b %errorlevel%
)

if exist "%TEMP%\apache-maven-3.9.10\bin\mvn.cmd" (
    call "%TEMP%\apache-maven-3.9.10\bin\mvn.cmd" spring-boot:run
    exit /b %errorlevel%
)

echo Maven was not found.
echo Install Maven 3.8 or newer, or add Maven to PATH, then run this file again.
exit /b 1