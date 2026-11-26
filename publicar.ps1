# Publica el sitio en un paso: sube el código a GitHub, compila, copia el
# resultado al repositorio de despliegue y hace push al servidor, que actualiza
# el sitio al recibirlo.
#   .\publicar.ps1 "qué cambió"
# Antes hay que tener el cambio con commit: el script no hace commits del código.
param(
  [Parameter(Mandatory = $true)][string]$Mensaje,
  # Carpeta del repositorio de despliegue (su remoto es el Git del hosting).
  [string]$Despliegue = (Join-Path (Split-Path $PSScriptRoot -Parent) 'portafolio-web-deploy')
)
$ErrorActionPreference = 'Stop'

if (-not (Test-Path (Join-Path $Despliegue '.git'))) { throw "No encuentro el repositorio de despliegue en $Despliegue" }

# Solo se publica lo que ya quedó en el historial.
$pendiente = git -C $PSScriptRoot status --porcelain
if ($pendiente) { throw "Hay cambios sin commit en el código. Haz el commit primero:`n$($pendiente -join "`n")" }

Push-Location $PSScriptRoot
try {
  npx astro build
  if ($LASTEXITCODE -ne 0) { throw 'La compilación falló: no se publica nada.' }
} finally { Pop-Location }

# El código, a GitHub.
git -C $PSScriptRoot push --set-upstream origin HEAD
if ($LASTEXITCODE -ne 0) { throw 'El push del código a GitHub falló: no se publica nada.' }

# Espejo de dist en el repositorio de despliegue, sin tocar su carpeta .git.
robocopy (Join-Path $PSScriptRoot 'dist') $Despliegue /MIR /XD .git /NFL /NDL /NJH /NJS /NP | Out-Null
if ($LASTEXITCODE -ge 8) { throw "La copia falló (robocopy $LASTEXITCODE)." }

git -C $Despliegue add --all .
git -C $Despliegue diff --cached --quiet
if ($LASTEXITCODE -eq 0) { Write-Host 'Código en GitHub. El sitio compilado es igual al publicado: nada que desplegar.'; exit 0 }
git -C $Despliegue commit -q -m "deploy: $Mensaje"
git -C $Despliegue push
if ($LASTEXITCODE -ne 0) { throw 'El push al servidor falló: el sitio en línea no cambió.' }
Write-Host 'Publicado: código en GitHub y sitio actualizado.'
