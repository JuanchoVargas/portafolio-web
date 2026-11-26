# Publica el sitio: compila, copia el resultado al repositorio de despliegue y
# hace push. El servidor actualiza el sitio al recibir el push.
#   .\publicar.ps1 "qué cambió"
param(
  [Parameter(Mandatory = $true)][string]$Mensaje,
  # Carpeta del repositorio de despliegue (su remoto es el Git del hosting).
  [string]$Despliegue = (Join-Path (Split-Path $PSScriptRoot -Parent) 'portafolio-web-deploy')
)
$ErrorActionPreference = 'Stop'

if (-not (Test-Path (Join-Path $Despliegue '.git'))) { throw "No encuentro el repositorio de despliegue en $Despliegue" }

Push-Location $PSScriptRoot
try {
  npx astro build
  if ($LASTEXITCODE -ne 0) { throw 'La compilación falló: no se publica nada.' }
} finally { Pop-Location }

# Espejo de dist en el repositorio de despliegue, sin tocar su carpeta .git.
robocopy (Join-Path $PSScriptRoot 'dist') $Despliegue /MIR /XD .git /NFL /NDL /NJH /NJS /NP | Out-Null
if ($LASTEXITCODE -ge 8) { throw "La copia falló (robocopy $LASTEXITCODE)." }

git -C $Despliegue add --all .
git -C $Despliegue diff --cached --quiet
if ($LASTEXITCODE -eq 0) { Write-Host 'Nada que publicar: el sitio compilado es igual al publicado.'; exit 0 }
git -C $Despliegue commit -q -m "deploy: $Mensaje"
git -C $Despliegue push
if ($LASTEXITCODE -ne 0) { throw 'El push falló: el sitio en línea no cambió.' }
Write-Host 'Publicado.'
