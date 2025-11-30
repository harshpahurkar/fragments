# Lab 9 Screenshot Replication Guide
## Complete Steps to Capture Required Screenshots

---

## ✅ VERIFICATION: Everything is Complete

### Implemented Features:
- ✅ S3 AWS adapter (`src/model/data/aws/`)
- ✅ DELETE route (`src/routes/api/delete.js`) with S3 integration
- ✅ Integration test (`tests/integration/lab-9-s3.hurl`)
- ✅ LocalStack docker-compose setup
- ✅ ECS deployment with S3 bucket configuration
- ✅ Task Role ARN configured in `fragments-definition.json`

---

## 📸 REQUIRED SCREENSHOTS (4 Total)

### Screenshot 1: Hurl Integration Test Passing with LocalStack
**What to show**: Terminal running the Hurl test successfully against LocalStack

**Steps**:
1. Open **3 terminal windows** in VS Code (split terminals)

2. **Terminal 1** - Start LocalStack and services:
   ```powershell
   cd C:\Users\Harsh\Desktop\Semester 6\CCP554\fragments
   docker compose up --build -d
   ```
   Wait for containers to start (~10 seconds)

3. **Terminal 2** - Run the setup script (creates S3 bucket in LocalStack):
   ```bash
   bash ./scripts/local-aws-setup.sh
   ```
   *(If you don't have bash, skip this and the bucket should auto-create)*

4. **Terminal 3** - Run the Hurl integration test:
   ```powershell
   npm run test:integration
   ```

5. **Screenshot Capture**:
   - Show **all 3 terminals** visible in the screenshot
   - Terminal 1: docker compose logs (showing containers running)
   - Terminal 2: setup script output (or skip if not available)
   - Terminal 3: **Hurl test output showing SUCCESS**
   - The output should show:
     ```
     tests/integration/lab-9-s3.hurl: RUNNING [1/1]
     tests/integration/lab-9-s3.hurl: SUCCESS
     Executed:  1
     Succeeded: 1 (100.0%)
     Failed:    0 (0.0%)
     ```

6. **Clean up** (after screenshot):
   ```powershell
   docker compose down
   ```

---

### Screenshot 2: fragments-ui Creating Fragment (Network Tab)
**What to show**: Browser showing fragments-ui creating a fragment using your ECS deployment

**Prerequisites**:
- Your ECS service must be running with the latest image
- Get your ECS Load Balancer URL from AWS Console

**Steps**:

1. **Get your ECS Load Balancer URL**:
   - Go to AWS Console → EC2 → Load Balancers
   - Find your fragments load balancer
   - Copy the **DNS name** (looks like: `fragments-lb-XXXXXXXX.us-east-1.elb.amazonaws.com`)

2. **Configure fragments-ui**:
   - Open your `fragments-ui` project
   - Edit the `.env` file (or wherever `API_URL` is set)
   - Set: `API_URL=http://YOUR-LOAD-BALANCER-DNS-NAME`
   - Example: `API_URL=http://fragments-lb-123456.us-east-1.elb.amazonaws.com`

3. **Start fragments-ui**:
   ```powershell
   cd path\to\fragments-ui
   npm start
   ```

4. **Open Browser with DevTools**:
   - Open Chrome/Edge
   - Press **F12** to open DevTools
   - Click the **Network** tab
   - Check "Preserve log" checkbox

5. **Create a Fragment**:
   - In the fragments-ui app, log in (if needed)
   - Create a new text fragment (type some text)
   - Click "Create Fragment" or "Submit"

6. **Screenshot Capture**:
   - Show the **browser window with**:
     - fragments-ui page visible (showing the fragment was created)
     - **Network tab open** at the bottom/side
     - Network requests showing **POST to your ECS Load Balancer URL**
   - Make sure the URL in the Network tab clearly shows your ECS endpoint (not localhost)
   - Highlight or point to the POST request that created the fragment

---

### Screenshot 3: AWS S3 Console Showing Fragment Object
**What to show**: AWS S3 Console displaying the fragment you just created as an object

**Steps**:

1. **Open AWS Console**:
   - Go to AWS Academy → Learner Lab → Start Lab
   - Click "AWS" to open AWS Console

2. **Navigate to S3**:
   - Search for "S3" in the services search bar
   - Click "S3" to open the S3 Console

3. **Open Your Bucket**:
   - Click on your bucket name (e.g., `harshpahurkar-fragments` or whatever you named it)
   - You should see folders/objects with names like:
     ```
     63258595765642a14e8a725a22b18eab2ae02882a1e13525c6f500532eaa31f5/
     ```
     (This is a hashed owner ID)

4. **Navigate to Fragment Object**:
   - Click on the owner folder (the long hash string)
   - You should see one or more objects with UUIDs as names:
     ```
     524RQdhMzifPRhlKI1G-V
     a1b2c3d4-e5f6-7890-abcd-ef1234567890
     ```
     (These are fragment IDs)

5. **Screenshot Capture**:
   - Show the **S3 Console** with:
     - Bucket name visible at top
     - Object list showing the fragment object(s)
     - At least one object key visible (ownerId/fragmentId format)
     - Optionally click on an object to show details (size, last modified, etc.)
   - The screenshot should clearly prove the fragment data is stored in S3

**Alternative if no objects visible**:
- Repeat Screenshot 2 steps to create another fragment
- Refresh the S3 Console page
- The new object should appear

---

### Screenshot 4: Link to Completed Integration Test
**What to show**: GitHub repository page showing your `tests/integration/lab-9-s3.hurl` file

**Steps**:

1. **Commit and Push** (if not already done):
   ```powershell
   cd C:\Users\Harsh\Desktop\Semester 6\CCP554\fragments
   git add tests/integration/lab-9-s3.hurl
   git commit -m "Add Lab 9 S3 integration test"
   git push origin main
   ```

2. **Navigate to File on GitHub**:
   - Go to: https://github.com/harshpahurkar/fragments
   - Click on `tests/` folder
   - Click on `integration/` folder
   - Click on `lab-9-s3.hurl` file

3. **Screenshot Capture**:
   - Show the **GitHub page** displaying the file contents
   - URL should be visible: `github.com/harshpahurkar/fragments/blob/main/tests/integration/lab-9-s3.hurl`
   - File contents should be fully visible showing all test steps

**OR** - Just submit the GitHub URL link (no screenshot needed):
```
https://github.com/harshpahurkar/fragments/blob/main/tests/integration/lab-9-s3.hurl
```

---

## 🎯 QUICK CHECKLIST

Before taking screenshots, verify:

- [ ] Docker Desktop is running
- [ ] AWS Learner Lab is started
- [ ] ECS service is deployed and running (check AWS Console → ECS)
- [ ] S3 bucket exists (check AWS Console → S3)
- [ ] fragments-ui is configured with ECS Load Balancer URL
- [ ] All code is committed to GitHub

---

## 🚀 QUICK SCREENSHOT SESSION (30 minutes)

### Order of Operations:
1. **Screenshot 4** (5 min) - Push code to GitHub, capture GitHub file link
2. **Screenshot 1** (10 min) - Start LocalStack, run Hurl tests
3. **Screenshot 2 & 3** (15 min) - Use fragments-ui to create fragment, capture Network tab AND S3 Console

**Pro Tip**: Take Screenshot 2 and 3 in sequence without closing windows - create the fragment, screenshot the Network tab, then immediately switch to AWS S3 Console and screenshot the object.

---

## ⚠️ TROUBLESHOOTING

### If Hurl test fails:
```powershell
# Check if containers are running
docker ps

# Check logs
docker logs <fragments-container-id>

# Restart containers
docker compose down
docker compose up --build -d
```

### If S3 Console shows no objects:
- Create another fragment using fragments-ui
- Refresh the S3 Console page
- Check the correct bucket (your named bucket, not someone else's)
- Verify ECS service is actually running (AWS Console → ECS)

### If fragments-ui can't connect to ECS:
- Verify Load Balancer DNS name is correct
- Check security group allows HTTP traffic on port 80
- Verify ECS tasks are running (AWS Console → ECS → Clusters → Tasks)
- Check the Network tab for CORS errors

---

## 📋 SUBMISSION CHECKLIST

Submit to Blackboard:
- [ ] Screenshot 1: Hurl test passing with LocalStack
- [ ] Screenshot 2: fragments-ui Network tab showing ECS endpoint
- [ ] Screenshot 3: AWS S3 Console showing fragment object
- [ ] Link to GitHub: `tests/integration/lab-9-s3.hurl`

**Optional but helpful**: Add a text file with:
- Your GitHub repo URL
- Your ECS Load Balancer URL
- Your S3 bucket name
- Any notes about your implementation
