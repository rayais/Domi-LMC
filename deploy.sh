#!/bin/bash
set -e

echo "=== Domiciliation + LMC Deployment ==="

# 1. Update system
echo "[1/7] Updating system..."
apt update -y && apt upgrade -y

# 2. Install Node.js 20.x
echo "[2/7] Installing Node.js..."
if ! command -v node &> /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt install -y nodejs
fi
echo "Node: $(node -v) | npm: $(npm -v)"

# 3. Install Nginx
echo "[3/7] Installing Nginx..."
if ! command -v nginx &> /dev/null; then
  apt install -y nginx
fi
systemctl enable nginx
systemctl start nginx

# 4. Install PM2
echo "[4/7] Installing PM2..."
npm install -g pm2

# 5. Clone repo
echo "[5/7] Cloning repo..."
cd /opt
if [ -d "Domi-LMC" ]; then
  cd Domi-LMC && git pull
else
  git clone https://github.com/rayais/Domi-LMC.git
  cd Domi-LMC
fi

# 6. Install dependencies & build
echo "[6/7] Installing dependencies & building..."
cd back && npm install --production && cd ..
cd front && npm install && npm run build && cd ..
cd front-lmc && npm install && npm run build && cd ..

# 7. Configure Nginx
echo "[7/7] Configuring Nginx..."

# === Domiciliation site (port 80) ===
cat > /etc/nginx/sites-available/domiciliation <<'NGINX'
server {
    listen 80;
    server_name _;

    root /opt/Domi-LMC/front/dist;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location ~ ^/(articles|article|login|about|contact|extras|extra|stats|theme|change-password|hero-slides|messages|message|uploads) {
        proxy_pass http://127.0.0.1:4911$request_uri;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
NGINX

# === LMC site (port 8080) ===
cat > /etc/nginx/sites-available/lmc <<'NGINX'
server {
    listen 8080;
    server_name _;

    root /opt/Domi-LMC/front-lmc/dist;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy (LMC routes + auth)
    location ~ ^/(lmc|login|change-password|uploads) {
        proxy_pass http://127.0.0.1:4911$request_uri;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/domiciliation /etc/nginx/sites-enabled/domiciliation
ln -sf /etc/nginx/sites-available/lmc /etc/nginx/sites-enabled/lmc
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# Start backend
cd /opt/Domi-LMC/back
pm2 delete domiciliation 2>/dev/null || true
PORT=4911 pm2 start server.js --name domiciliation
pm2 save
pm2 startup

echo ""
echo "=== Deployment Complete ==="
echo "Domiciliation:  http://102.204.206.206/"
echo "LMC:            http://102.204.206.206:8080/"
echo "Admin GSD:      http://102.204.206.206/admin/"
echo "Admin LMC:      http://102.204.206.206:8080/admin"
echo "Backend API:    http://102.204.206.206:4911/"
