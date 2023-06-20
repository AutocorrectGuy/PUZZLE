@echo off

:: Runs development environment

:: Runs live-server on specific port, opens browser
start cmd /k npm run "run-live-server"

:: Runs tailwind watcher
npm run "run-tailwind"
