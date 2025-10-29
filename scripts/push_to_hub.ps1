<#
 scripts/push_to_hub.ps1
 Tag and push the local image to Docker Hub under user harshpahurkar.

 Usage (PowerShell):
   ./scripts/push_to_hub.ps1 -LocalImage fragments:latest -Tag lab-6
#>

param(
    [string]$LocalImage = "fragments:latest",
    [string]$DockerHubUser = "harshpahurkar",
    [string]$Repo = "fragments",
    [string]$Tag = "lab-6"
)

$Remote = "${DockerHubUser}/${Repo}:${Tag}"

Write-Host "Tagging $LocalImage -> $Remote" -ForegroundColor Cyan
docker tag $LocalImage $Remote
if ($LASTEXITCODE -ne 0) { Write-Error "docker tag failed"; exit $LASTEXITCODE }

Write-Host "Logging into Docker Hub (interactive)" -ForegroundColor Cyan
docker login
if ($LASTEXITCODE -ne 0) { Write-Error "docker login failed"; exit $LASTEXITCODE }

Write-Host "Pushing $Remote" -ForegroundColor Cyan
docker push $Remote
if ($LASTEXITCODE -ne 0) { Write-Error "docker push failed"; exit $LASTEXITCODE }

Write-Host "Push complete." -ForegroundColor Green
