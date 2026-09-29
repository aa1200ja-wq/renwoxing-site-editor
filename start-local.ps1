$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

Write-Host ""
Write-Host "==============================================="
Write-Host " Renwoxing local editor + Supabase test"
Write-Host " Version: 9084a6ef573ce88b1dcc22ac71caba4442c3e3cc"
Write-Host "==============================================="
Write-Host ""

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js not found. Install Node.js LTS first:"
    Write-Host "https://nodejs.org/"
    exit 1
}
if (-not (Get-Command npm.cmd -ErrorAction SilentlyContinue)) {
    Write-Host "npm not found. Reinstall Node.js LTS."
    exit 1
}

if (-not (Test-Path (Join-Path $Root "node_modules"))) {
    Write-Host "[1/3] First run: installing npm packages..."
    & npm.cmd install
    if ($LASTEXITCODE -ne 0) { throw "npm install failed." }
} else {
    Write-Host "[1/3] node_modules already exists."
}

$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 0)
$listener.Start()
$Port = ([System.Net.IPEndPoint]$listener.LocalEndpoint).Port
$listener.Stop()

Write-Host "[2/3] Free local port selected: $Port"

if (-not (Test-Path (Join-Path $Root "app\site\page.tsx"))) {
    throw "Missing app/site/page.tsx"
}
if (-not (Test-Path (Join-Path $Root "app\editor\page.tsx"))) {
    throw "Missing app/editor/page.tsx"
}

Write-Host "[3/3] Starting Next.js..."
$cmd = "title Renwoxing Local Server - Port $Port && npm run dev -- -p $Port"
Start-Process -FilePath "cmd.exe" -WorkingDirectory $Root -ArgumentList "/k", $cmd

$ready = $false
for ($i = 0; $i -lt 90; $i++) {
    try {
        $client = New-Object System.Net.Sockets.TcpClient
        $client.Connect("127.0.0.1", $Port)
        $client.Close()
        $ready = $true
        break
    } catch {
        Start-Sleep -Seconds 1
    }
}

Write-Host ""
Write-Host "Site   : http://localhost:$Port/site"
Write-Host "Editor : http://localhost:$Port/editor"
Write-Host ""

if ($ready) {
    Start-Process "http://localhost:$Port/site"
    Start-Sleep -Milliseconds 400
    Start-Process "http://localhost:$Port/editor"
} else {
    Write-Host "Server did not become ready within 90 seconds."
    Write-Host "Check the Local Server command window for errors."
}
