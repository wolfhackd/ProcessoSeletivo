@echo off
REM Installing front-end dependencies...
cd .\Frontend\
bun install

REM Installing back-end dependencies...
cd ..\BackEnd\
bun install

REM Dependencies installed successfully!
pause