Lab 6 - Docker Hub push and optimized images

This file contains the exact commands to build, tag, and push your images to Docker Hub and the steps used for the Dockerfile optimization (lab-6-step-20) and an extra tag for lab-6-step-21.

Assumptions

- Your Docker Hub username: harshpahurkar
- You are running commands from the project root (where Dockerfile is located)
- You have already implemented desired code changes for the assignment requirement (lab-6-step-21). If not, make code changes, commit, and then rebuild/tag.

Commands

1. Build the optimized image (the repository Dockerfile is now multi-stage):

# Build and tag as latest

docker build -t harshpahurkar/fragments:latest .

# Add lab-6 tag (same image)

docker tag harshpahurkar/fragments:latest harshpahurkar/fragments:lab-6

# Add lab-6-step-20 tag (optimized build verification)

docker tag harshpahurkar/fragments:latest harshpahurkar/fragments:lab-6-step-20

# If you implemented a code change for lab-6-step-21, rebuild with a new tag

# (optional - only if you made code changes)

docker build -t harshpahurkar/fragments:lab-6-step-21 .

2. Login & push tags to Docker Hub

docker login

# Push specific tags

docker push harshpahurkar/fragments:latest
docker push harshpahurkar/fragments:lab-6
docker push harshpahurkar/fragments:lab-6-step-20

# If you created lab-6-step-21

docker push harshpahurkar/fragments:lab-6-step-21

3. Verify tags locally and on Docker Hub

docker images | grep fragments

# Visit: https://hub.docker.com/repository/docker/harshpahurkar/fragments/tags

4. Run locally for screenshot (host 5555 -> container 8080)

docker run --rm --name fragments -e "LOG_LEVEL=debug" -p 5555:8080 -d harshpahurkar/fragments:lab-6

# container id printed - screenshot this

docker ps --filter "name=fragments" --format "table {{.ID}} {{.Names}} {{.Status}} {{.Ports}}"
curl http://localhost:5555/
docker logs --tail 200 fragments

5. Run on EC2 for screenshot (host 8080 -> container 8080)

# On EC2

docker pull harshpahurkar/fragments:lab-6
docker run --rm --name fragments -e "LOG_LEVEL=debug" -p 8080:8080 -d harshpahurkar/fragments:lab-6
docker ps
curl -sS http://localhost:8080/
docker logs --tail 200 fragments

Notes

- If your image is private, run `docker login` on the host before `docker pull`.
- If the container exits immediately after `docker run`, run `docker logs fragments` to see why.
- `--rm` removes the container automatically when it stops. Remove `--rm` if you want to inspect after stopping.

That's it — follow these commands and capture the screenshots required by the lab.
