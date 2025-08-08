param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("prod", "qa")]
    [string]$env
)

# Leer configuración
if (!(Test-Path -Path "deploy.config.json")) {
    Write-Error "No se encontró el archivo deploy.config.json."
    exit 1
}
$config = Get-Content "deploy.config.json" | ConvertFrom-Json

# Detectar si ya estás logueado en OCP
try {
    $ocUser = oc whoami 2>$null
} catch {
    $ocUser = $null
}

if (-not $ocUser) {
    Write-Host "No estás logueado en OpenShift. Ejecutando comando de login del archivo de configuración..."
    Invoke-Expression $config.ocpLoginCmd
    $ocUser = oc whoami 2>$null
    if (-not $ocUser) {
        Write-Error "No se pudo iniciar sesión en OpenShift."
        exit 1
    }
}
Write-Host "Usuario OCP actual: $ocUser"

# Ejecutar scripts de build en WSL para backend y frontend
Write-Host "Ejecutando build de Backend en WSL..."
wsl bash $config.backendScript $env $config.nexusUser $config.nexusPass
if ($LASTEXITCODE -ne 0) {
    Write-Error "Falló el build de Backend."
    exit 1
}
Write-Host "Ejecutando build de Frontend en WSL..."
wsl bash $config.frontendScript $env $config.nexusUser $config.nexusPass
if ($LASTEXITCODE -ne 0) {
    Write-Error "Falló el build de Frontend."
    exit 1
}

# Despliegue en OpenShift
Write-Host "Cambiando a proyecto OCP: $($config.ocpProject)"
oc project $config.ocpProject
Write-Host "Actualizando imagen en deployment: $($config.deploymentName)"
oc set image deployment/$($config.deploymentName) $($config.containerName)=$($config.imageRepo):$env

Write-Host "Despliegue completado para $env" 