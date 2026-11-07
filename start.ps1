$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot
Set-Location $Root

function Test-LocalPort {
    param([int]$Port)
    try {
        $client = New-Object System.Net.Sockets.TcpClient
        $iar = $client.BeginConnect("127.0.0.1", $Port, $null, $null)
        $ok = $iar.AsyncWaitHandle.WaitOne(400)
        if ($ok -and $client.Connected) {
            $client.EndConnect($iar)
            $client.Close()
            return $true
        }
        $client.Close()
        return $false
    } catch {
        return $false
    }
}

Write-Host "=== Loyalty app start ==="

$env:COMPOSE_PROJECT_NAME = "loyalty"
$postgresUp = $false
try {
    docker info | Out-Null
    Write-Host "Starting PostgreSQL..."
    docker compose -f "$Root\docker-compose.yml" up -d postgres
    $postgresUp = $true
} catch {
    Write-Host "Docker is not available, checking port 5433..."
}

$ready = $false
if ($postgresUp) {
    Write-Host "Waiting for database..."
    for ($i = 0; $i -lt 30; $i++) {
        $health = ""
        try { $health = (docker inspect --format "{{.State.Health.Status}}" loyalty-postgres 2>$null) } catch { }
            if ($health -eq "healthy" -or (Test-LocalPort 5433)) {
            $ready = $true
            break
        }
        Start-Sleep -Seconds 2
    }
    if (-not $ready) {
        throw "PostgreSQL did not start. Open Docker Desktop and try again."
    }
    Write-Host "PostgreSQL is ready"
} elseif (Test-LocalPort 5433) {
    Write-Host "Using PostgreSQL on port 5433"
} else {
    throw "PostgreSQL is not running. Start Docker Desktop and try again."
}

if (-not (Test-Path "$Root\node_modules")) {
    Write-Host "Installing npm packages..."
    npm install
}

Write-Host "Starting backend and frontend windows..."
Start-Process -FilePath "cmd.exe" -ArgumentList "/k", "title Loyalty backend && cd /d `"$Root\backend`" && mvn spring-boot:run"
Start-Process -FilePath "cmd.exe" -ArgumentList "/k", "title Loyalty frontend && cd /d `"$Root`" && npm run dev"

Write-Host ""
Write-Host "UI:       http://localhost:5173"
Write-Host "API:      http://localhost:8090"
Write-Host "Swagger:  http://localhost:8090/swagger-ui.html"
Write-Host "Login:    i.belova@loyalty.local / demo1234"
Write-Host "Stop:     .\stop.cmd"
