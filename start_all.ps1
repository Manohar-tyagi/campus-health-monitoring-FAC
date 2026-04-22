# Health Command Center - Full Stack Startup Script
# Run this from the root directory (C:\Antigravity\health-dashboard)

Write-Host "--- INITIALIZING EPIDEMIOLOGICAL COMMAND CENTER ---" -ForegroundColor Gold

# 1. Install Backend Dependencies
Write-Host "[1/3] Installing Backend Dependencies..." -ForegroundColor Cyan
cd server
cmd /c "npm install"
cd ..

# 2. Install Frontend Dependencies (axios, socket.io-client)
Write-Host "[2/3] Installing Frontend Dependencies..." -ForegroundColor Cyan
cmd /c "npm install axios socket.io-client"

# 3. Start Backend & Frontend
Write-Host "[3/3] Launching Servers..." -ForegroundColor Green
Write-Host "Backend will run on http://localhost:3001"
Write-Host "Frontend will run on http://localhost:5173"

# Open new windows for servers
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; node index.js"
npm run dev
