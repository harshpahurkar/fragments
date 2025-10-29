<#
scripts/run_from_hub.ps1
Pulls the image from Docker Hub for user harshpahurkar and runs it detached mapping host port -> container port.

Usage (PowerShell):
  ./scripts/run_from_hub.ps1 -HostPort 5555 -ContainerPort 8080 -Tag lab-6
#>

param(
    [int]$HostPort = 5555,
    [int]$ContainerPort = 8080,
    [string]$DockerHubUser = "harshpahurkar",
    [string]$ImageRepo = "fragments",
    [string]$Tag = "lab-6"
)

$Image = "${DockerHubUser}/${ImageRepo}:${Tag}"

Write-Host "Pulling image $Image" -ForegroundColor Cyan
docker pull $Image
if ($LASTEXITCODE -ne 0) { Write-Error "docker pull failed"; exit $LASTEXITCODE }

Write-Host "Running container detached: host $HostPort -> container $ContainerPort" -ForegroundColor Cyan
docker run --rm --name fragments --env-file env.jest -e "LOG_LEVEL=debug" -p ${HostPort}:${ContainerPort} -d $Image
if ($LASTEXITCODE -ne 0) { Write-Error "docker run failed"; exit $LASTEXITCODE }

Write-Host "Done. To view logs: docker logs --tail 200 fragments" -ForegroundColor Yellow
