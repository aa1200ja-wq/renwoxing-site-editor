@echo off
chcp 65001 >nul
title Renwoxing Local Check
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-local.ps1"
pause
