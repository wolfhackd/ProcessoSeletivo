@echo off

REM Running front-end...
start cmd /k "cd .\Frontend\ && bun run dev"

REM Running back-end...
start cmd /k "cd .\BackEnd\ && bun index.ts"

pause
