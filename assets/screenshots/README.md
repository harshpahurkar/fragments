Place your submission screenshots in this folder and name them exactly as referenced in `LAB_SUBMISSION.md`.

Required filenames (7 screenshots total):

1. **screenshot1-hadolint.png** - Hadolint Dockerfile validation output (clean, 0 errors)
2. **screenshot2-ci-workflow.png** - GitHub Actions CI workflow showing all 4 jobs passing
3. **screenshot3-dockerhub-tags.png** - Docker Hub repository showing published tags
4. **screenshot4-cd-workflow.png** - GitHub Actions CD workflow triggered by tag push
5. **screenshot5-ecr-repository.png** - AWS ECR console showing repository and image tags
6. **screenshot6-local-run.png** - Local machine docker run, logs, and curl showing X-App-Version header
7. **screenshot7-ec2-run.png** - EC2 instance docker pull from ECR, run, and curl showing X-App-Version header

How to add and commit screenshots:

```bash
mkdir -p assets/screenshots
# copy your PNG/JPG files into assets/screenshots/
# then commit
git add assets/screenshots/*
git commit -m "Add lab submission screenshots"
git push origin main
```

After pushing, open `LAB_SUBMISSION.md` on GitHub to confirm images render inline.
