#!/bin/bash
set -euo pipefail

APP_DIR="/home/opc/.openclaw/workspace/openclaw-landing"
WEB_ROOT="/usr/share/nginx/html"
CONF="/etc/nginx/conf.d/openclaw.conf"
DOMAIN="openclaw.gootube.online"
CERT_DIR="/etc/nginx/ssl"

cd "$APP_DIR"
npm run build

sudo rsync -av --delete dist/ "$WEB_ROOT/"

sudo tee "$CONF" >/dev/null <<'EOF'
server {
    listen 80;
    server_name openclaw.gootube.online;

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name openclaw.gootube.online;

    ssl_certificate /etc/nginx/ssl/openclaw.gootube.online.fullchain.crt;
    ssl_certificate_key /etc/nginx/ssl/openclaw.gootube.online.key;

    root /usr/share/nginx/html;
    index index.html;

    location = /status.json {
        default_type application/json;
        add_header Cache-Control "no-store";
        try_files $uri =404;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

sudo nginx -t
sudo systemctl reload nginx

echo
echo "Deploy complete: https://$DOMAIN/"
