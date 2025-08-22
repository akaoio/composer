#!/bin/bash

# Composer Watch Service Installation Script
# Supports systemd, PM2, and Docker

set -e

echo "==================================="
echo "Composer Watch Service Installer"
echo "==================================="
echo

# Detect installation method
if [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
    echo "Usage: $0 [METHOD]"
    echo
    echo "Methods:"
    echo "  systemd  - Install as systemd service (requires sudo)"
    echo "  pm2      - Install using PM2 process manager"
    echo "  docker   - Install as Docker container"
    echo "  auto     - Auto-detect best method (default)"
    echo
    exit 0
fi

METHOD=${1:-auto}

# Function to install systemd service
install_systemd() {
    echo "Installing as systemd service..."
    
    # Check if systemd is available
    if ! command -v systemctl &> /dev/null; then
        echo "Error: systemd not available on this system"
        return 1
    fi
    
    # Check for sudo
    if [ "$EUID" -ne 0 ]; then
        echo "Error: systemd installation requires sudo privileges"
        echo "Please run: sudo $0 systemd"
        return 1
    fi
    
    # Get username
    SUDO_USER=${SUDO_USER:-$USER}
    
    # Copy service file
    cp systemd/composer-watch.service /etc/systemd/system/composer-watch@.service
    
    # Reload systemd
    systemctl daemon-reload
    
    # Enable and start service for the user
    systemctl enable composer-watch@${SUDO_USER}.service
    systemctl start composer-watch@${SUDO_USER}.service
    
    echo "✓ Systemd service installed and started"
    echo "  Status: systemctl status composer-watch@${SUDO_USER}"
    echo "  Logs:   journalctl -u composer-watch@${SUDO_USER} -f"
    echo "  Stop:   systemctl stop composer-watch@${SUDO_USER}"
}

# Function to install with PM2
install_pm2() {
    echo "Installing with PM2..."
    
    # Check if PM2 is installed
    if ! command -v pm2 &> /dev/null; then
        echo "PM2 not found. Installing PM2 globally..."
        npm install -g pm2
    fi
    
    # Create logs directory
    mkdir -p logs
    
    # Start with PM2
    pm2 start pm2.config.js
    
    # Save PM2 configuration
    pm2 save
    
    # Setup startup script
    echo "Setting up PM2 startup script..."
    pm2 startup | tail -n 1 | bash
    
    echo "✓ PM2 service installed and started"
    echo "  Status: pm2 status"
    echo "  Logs:   pm2 logs composer-watch"
    echo "  Stop:   pm2 stop composer-watch"
}

# Function to install with Docker
install_docker() {
    echo "Installing with Docker..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        echo "Error: Docker not installed"
        return 1
    fi
    
    # Check if docker-compose is installed
    if ! command -v docker-compose &> /dev/null; then
        echo "Error: docker-compose not installed"
        return 1
    fi
    
    # Build and start container
    cd docker
    docker-compose up -d --build
    cd ..
    
    echo "✓ Docker container started"
    echo "  Status: docker-compose -f docker/docker-compose.yml ps"
    echo "  Logs:   docker-compose -f docker/docker-compose.yml logs -f"
    echo "  Stop:   docker-compose -f docker/docker-compose.yml down"
}

# Auto-detect best method
auto_detect() {
    echo "Auto-detecting best installation method..."
    
    if [ "$EUID" -eq 0 ] && command -v systemctl &> /dev/null; then
        echo "→ Detected: systemd (running as root)"
        install_systemd
    elif command -v pm2 &> /dev/null; then
        echo "→ Detected: PM2 already installed"
        install_pm2
    elif command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
        echo "→ Detected: Docker"
        install_docker
    elif command -v npm &> /dev/null; then
        echo "→ Detected: Node.js - installing PM2"
        install_pm2
    else
        echo "Error: No suitable installation method found"
        echo "Please install Node.js, Docker, or run with sudo for systemd"
        exit 1
    fi
}

# Main installation logic
case $METHOD in
    systemd)
        install_systemd
        ;;
    pm2)
        install_pm2
        ;;
    docker)
        install_docker
        ;;
    auto)
        auto_detect
        ;;
    *)
        echo "Error: Unknown method '$METHOD'"
        echo "Run '$0 --help' for usage information"
        exit 1
        ;;
esac

echo
echo "Installation complete!"