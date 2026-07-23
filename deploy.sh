#!/bin/bash
# ==============================================================================
# AI-247 EXECUTIVE ASSISTANT - FREE VPS 24/7 DEPLOYMENT AUTOMATION
# Supports: Oracle Cloud Always Free (ARM Ampere / 24GB RAM), GCP Free Tier,
#           Fly.io, Railway, Render, Cloudflare Tunnels
# ==============================================================================

set -e

echo "🚀 Starting AI-247 Executive Assistant VPS Installer..."

# Color Codes
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. System Updates & Docker Check
echo -e "${CYAN}[1/5] Updating OS packages & checking Docker engine...${NC}"
sudo apt-get update -y && sudo apt-get upgrade -y
sudo apt-get install -y curl git ufw unzip fail2ban ca-certificates gnupg

if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Installing Docker CE Engine...${NC}"
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker $USER
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}Installing Docker Compose CLI Plugin...${NC}"
    sudo apt-get install -y docker-compose-plugin
fi

# 2. Setup Firewall Rules (UFW)
echo -e "${CYAN}[2/5] Configuring security firewall (Ports 22, 80, 443, 3000)...${NC}"
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw --force enable

# 3. Clone / Pull Latest Application Code
echo -e "${CYAN}[3/5] Setting up AI-247 production workspace...${NC}"
WORKDIR="/opt/ai247-assistant"
if [ ! -d "$WORKDIR" ]; then
    sudo mkdir -p $WORKDIR
    sudo chown -R $USER:$USER $WORKDIR
fi

# Create .env if missing
if [ ! -f "$WORKDIR/.env" ]; then
    echo -e "${YELLOW}Creating default .env configuration file...${NC}"
    cat <<EOT > $WORKDIR/.env
NODE_ENV=production
PORT=3000
GEMINI_API_KEY=${GEMINI_API_KEY:-""}
OPENROUTER_API_KEY=${OPENROUTER_API_KEY:-""}
META_ACCESS_TOKEN=${META_ACCESS_TOKEN:-""}
META_INSTAGRAM_ACCOUNT_ID=${META_INSTAGRAM_ACCOUNT_ID:-""}
EOT
fi

# 4. Build Docker Container Image
echo -e "${CYAN}[4/5] Building Docker container & starting service...${NC}"
cd $WORKDIR
docker compose down || true
docker compose build --no-cache
docker compose up -d

# 5. Health Check Verification
echo -e "${CYAN}[5/5] Performing live container health check...${NC}"
sleep 5

if curl -s http://localhost:3000/api/health | grep -q "ok"; then
    echo -e "${GREEN}=====================================================${NC}"
    echo -e "${GREEN} SUCCESS! AI-247 Executive Assistant is RUNNING 24/7! ${NC}"
    echo -e "${GREEN} Local Endpoint: http://localhost:3000              ${NC}"
    echo -e "${GREEN} Health Check:  http://localhost:3000/api/health    ${NC}"
    echo -e "${GREEN}=====================================================${NC}"
else
    echo -e "${RED}Warning: Container launched but health check pending. Check 'docker logs ai247-assistant'.${NC}"
fi
