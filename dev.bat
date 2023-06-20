@echo off

:: Runs development environment

:: Runs live-server on specific port, opens browser
start cmd /k yarn "run-live-server"

:: Runs tailwind watcher
yarn "run-tailwind"
