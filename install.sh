#!/usr/bin/env zsh

# Cyber Kavach One-Line Deploy Script
# Run with: curl -sL <URL> | zsh

set -e

# Colors for terminal output
GREEN='\03---[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================================${NC}"
echo -e "${GREEN}🛡️  Welcome to the Cyber Kavach Installation Wizard 🛡️${NC}"
echo -e "${BLUE}================================================================${NC}"

# 1. Prompt for Email Configuration
echo ""
echo -e "Cyber Kavach sends real-time threat alerts directly to your inbox."
read -p "Enter your alert notification email: " ALERT_EMAIL </dev/tty

if [ -z "$ALERT_EMAIL" ]; then
    echo -e "${RED}Error: Email cannot be empty. Installation aborted.${NC}"
    exit 1
fi

# 2. Check for dependencies (Docker & Git)
echo -e "\n${BLUE}[*] Checking system requirements...${NC}"
if ! command -v git &> /dev/null; then
    echo -e "${RED}Git is not installed. Please install Git first.${NC}"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo -e "${BLUE}[*] Docker not found. Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    rm get-docker.sh
fi

# 3. Clone Repository
echo -e "\n${BLUE}[*] Downloading Cyber Kavach...${NC}"
# Replace this with your actual GitHub repository URL!
REPO_URL="https://github.com/keerthi-180205/cyber-kavach.git"
INSTALL_DIR="/opt/cyber-kavach"

if [ -d "$INSTALL_DIR" ]; then
    echo -e "${BLUE}[*] Directory $INSTALL_DIR already exists. Updating...${NC}"
    cd $INSTALL_DIR
    sudo git pull
else
    sudo git clone $REPO_URL $INSTALL_DIR
    cd $INSTALL_DIR
fi

# 4. Generate Configuration
echo -e "\n${BLUE}[*] Generating secure configuration...${NC}"
sudo chmod -R 777 $INSTALL_DIR  # Ensure the installer has access
cat <<EOF > .env
ALERT_RECEIVER_EMAIL=$ALERT_EMAIL
# Add other demo environment variables you might need here
DEMO_MODE=false
EOF

# 5. Boot the system
echo -e "\n${BLUE}[*] Booting Cyber Kavach platform via Docker...${NC}"
sudo docker compose down 2>/dev/null || true
sudo docker compose up -d --build

# 6. Success
echo -e "\n${BLUE}================================================================${NC}"
echo -e "${GREEN}🎉 Cyber Kavach successfully installed and active! 🎉${NC}"
echo -e "${GREEN}👉 View your live dashboard at http://$(curl -s ifconfig.me):3000${NC}"
echo -e "${BLUE}================================================================${NC}"
