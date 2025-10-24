# PowerShell script to restart Django backend server

Write-Host "Stopping Django server on port 8000..." -ForegroundColor Yellow

# Find and kill processes on port 8000
$processes = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

if ($processes) {
    foreach ($pid in $processes) {
        Write-Host "Stopping process $pid..." -ForegroundColor Yellow
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
    Write-Host "Django server stopped." -ForegroundColor Green
} else {
    Write-Host "No Django server found running on port 8000." -ForegroundColor Cyan
}

Write-Host "`nStarting Django server..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\backend"

# Start Django server in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python manage.py runserver"

Write-Host "Django server starting in new window..." -ForegroundColor Green
Write-Host "The fix has been applied. Please test score submission in your browser." -ForegroundColor Cyan
