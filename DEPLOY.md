# Deploying to EC2 (manual)

This file documents a minimal manual deployment of the fragments service to an AWS EC2 instance.

1. Provision an EC2 instance (Amazon Linux 2 / Ubuntu) and SSH into it.
2. Install Node.js (v18+) and Git.
3. Clone this repo and install dependencies:

```bash
git clone <repo-url>
cd fragments
npm ci
```

4. Create an `.env` file with required environment variables (see `.env.example`).

5. Start the service using systemd (recommended) or PM2. Example systemd unit:

```ini
[Unit]
Description=fragments service
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/fragments
ExecStart=/usr/bin/node src/index.js
Restart=on-failure
Environment=NODE_ENV=production
EnvironmentFile=/home/ec2-user/fragments/.env

[Install]
WantedBy=multi-user.target
```

6. Configure your security group to allow inbound traffic on the port (default 8080) and optionally configure a reverse proxy (nginx) and TLS.
