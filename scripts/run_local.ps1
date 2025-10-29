<#
scripts/run_local.ps1
PowerShell helper to build the docker image, run it detached with host port 5555 -> container 8080,
perform a health check and print recent logs so you can take screenshots.

Usage (PowerShell):
  ./scripts/run_local.ps1
#>

param(
    [string]$DockerHubUser = "harshpahurkar",
    [string]$ImageRepo = "fragments",
    [string]$ImageTag = "latest",
    [int]$HostPort = 5555,
    [int]$ContainerPort = 8080
)

# Compose full image name from Docker Hub user/repo:tag
$ImageName = "${DockerHubUser}/${ImageRepo}:${ImageTag}"

Write-Host "Building image: $ImageName" -ForegroundColor Cyan
docker build -t $ImageName .
if ($LASTEXITCODE -ne 0) { Write-Error "docker build failed"; exit $LASTEXITCODE }

Write-Host "Running container detached: host $HostPort -> container $ContainerPort" -ForegroundColor Cyan
# Using --rm so the container removes itself when stopped. Adjust if you want persistent container.
docker run --rm --name fragments --env-file env.jest -e "LOG_LEVEL=debug" -p ${HostPort}:${ContainerPort} -d $ImageName
if ($LASTEXITCODE -ne 0) { Write-Error "docker run failed"; exit $LASTEXITCODE }

# Docker prints the container id on success. Wait for the container to appear as running.
Write-Host "Waiting for container to start..." -ForegroundColor Cyan
$started = $false
for ($i = 0; $i -lt 30; $i++) {
    $id = docker ps --filter "name=fragments" --filter "status=running" --format "{{.ID}}"
    if ($id) { $started = $true; break }
    Start-Sleep -Seconds 1
}
if (-not $started) { Write-Error "Container did not start within timeout. Check 'docker ps -a' and `docker logs fragments`."; exit 1 }

Write-Host "Container is running (ID: $id)" -ForegroundColor Green

Write-Host "\nHealth check: http://localhost:$HostPort/" -ForegroundColor Cyan
try {
    # Use Invoke-RestMethod so JSON prints as a PS object
    $resp = Invoke-RestMethod -Uri "http://localhost:$HostPort/" -Method Get -TimeoutSec 10
    Write-Host ("Response (formatted):") -ForegroundColor Green
    $resp | ConvertTo-Json -Depth 6 | Write-Host
} catch {
    Write-Error "Health check failed: $_"
}

Write-Host "\nRecent container logs (last 200 lines):" -ForegroundColor Cyan
# Print recent logs for screenshotting
docker logs --tail 200 fragments

Write-Host "\nTip: To capture logs while curling (see request entries), open another terminal and run: docker logs -f fragments" -ForegroundColor Yellow
Write-Host "When finished, stop container: docker stop fragments" -ForegroundColor Yellow

# End of script
