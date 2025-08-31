#!/bin/sh
# Composer Watch Service Installation Script
# Uses @akaoio/stacker framework for standardized patterns

# Load Stacker framework via Composer's stacker loader
SCRIPT_DIR="$(dirname "$0")"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

if [ -f "$PROJECT_ROOT/stacker-loader.sh" ]; then
    . "$PROJECT_ROOT/stacker-loader.sh"
    stacker_loader_init || {
        echo "ERROR: Failed to initialize Stacker framework" >&2
        exit 1
    }
else
    echo "ERROR: Composer Stacker loader not found at $PROJECT_ROOT/stacker-loader.sh" >&2
    echo "Please ensure stacker-loader.sh is present in the project root" >&2
    exit 1
fi

# Initialize Stacker for Composer
stacker_init "composer" "https://github.com/akaoio/composer" "composer" "Atomic document composition engine"

stacker_log "Initializing Composer Watch Service installation"
stacker_log "Using Stacker framework v$STACKER_VERSION"

# Show help using Stacker's help system
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Usage: $0 [METHOD]"
    echo ""
    echo "Methods:"
    echo "  systemd  - Install as systemd service (requires sudo)"
    echo "  pm2      - Install using PM2 process manager" 
    echo "  docker   - Install as Docker container"
    echo "  auto     - Auto-detect best method (default)"
    echo ""
    exit 0
fi

METHOD=${1:-auto}
stacker_log "Installation method: $METHOD"

# Function to install systemd service using Stacker framework
install_systemd() {
    stacker_log "info" "Installing as systemd service"
    
    # Load service module
    stacker_require "service" || {
        stacker_error "Failed to load service module"
        return 1
    }
    
    # Use Stacker's service installation
    stacker_setup_systemd_service "systemd" "composer-watch" || {
        stacker_error "systemd service installation failed"
        return 1
    }
    
    stacker_log "success" "Systemd service installed and started"
    stacker_log "info" "Status: systemctl status composer-watch@$(whoami)"
    stacker_log "info" "Logs:   journalctl -u composer-watch@$(whoami) -f"
    stacker_log "info" "Stop:   systemctl stop composer-watch@$(whoami)"
}

# Function to install with PM2 using Stacker framework
install_pm2() {
    stacker_log "info" "Installing with PM2"
    
    # Check PM2 availability using Stacker's dependency checking
    if ! command -v "pm2"; then
        stacker_log "info" "PM2 not found. Installing PM2 globally..."
        eval "npm install -g pm2" || {
            stacker_error "Failed to install PM2"
            return 1
        }
    fi
    
    # Create logs directory using Stacker's safe operations
    mkdir -p "logs" || {
        stacker_error "Failed to create logs directory"
        return 1
    }
    
    # Start with PM2
    eval "pm2 start pm2.config.js" || {
        stacker_error "Failed to start PM2 process"
        return 1
    }
    
    # Save and setup PM2
    eval "pm2 save" || stacker_warn "Failed to save PM2 configuration"
    eval "pm2 startup | tail -n 1 | sh" || stacker_warn "Failed to setup PM2 startup"
    
    stacker_log "success" "PM2 service installed and started"
    stacker_log "info" "Status: pm2 status"
    stacker_log "info" "Logs:   pm2 logs composer-watch"
    stacker_log "info" "Stop:   pm2 stop composer-watch"
}

# Function to install with Docker using Stacker framework
install_docker() {
    stacker_log "info" "Installing with Docker"
    
    # Check Docker availability using Stacker's dependency checking
    if ! command -v "docker"; then
        stacker_error "Docker not installed"
        return 1
    fi
    
    if ! command -v "docker-compose"; then
        stacker_error "docker-compose not installed"
        return 1
    fi
    
    # Change to docker directory safely
    if [ -d "docker" ]; then
        cd docker || {
            stacker_error "Failed to change to docker directory"
            return 1
        }
    else
        stacker_error "Docker directory not found"
        return 1
    fi
    
    # Build and start container
    eval "docker-compose up -d --build" || {
        cd ..
        stacker_error "Failed to start Docker container"
        return 1
    }
    
    cd ..
    
    stacker_log "success" "Docker container started"
    stacker_log "info" "Status: docker-compose -f docker/docker-compose.yml ps"
    stacker_log "info" "Logs:   docker-compose -f docker/docker-compose.yml logs -f"
    stacker_log "info" "Stop:   docker-compose -f docker/docker-compose.yml down"
}

# Auto-detect best method using Stacker's system detection
auto_detect() {
    stacker_log "info" "Auto-detecting best installation method"
    
    # Use Stacker's system detection capabilities
    if [ "$EUID" = "0" ] && command -v "systemctl"; then
        stacker_log "info" "→ Detected: systemd (running as root)"
        install_systemd
    elif command -v "pm2"; then
        stacker_log "info" "→ Detected: PM2 already installed"
        install_pm2
    elif command -v "docker" && command -v "docker-compose"; then
        stacker_log "info" "→ Detected: Docker"
        install_docker
    elif command -v "npm"; then
        stacker_log "info" "→ Detected: Node.js - installing PM2"
        install_pm2
    else
        stacker_error "No suitable installation method found"
        stacker_error "Please install Node.js, Docker, or run with sudo for systemd"
        exit 1
    fi
}

# Main installation logic using Stacker's command handling
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
        stacker_error "Unknown method '$METHOD'"
        stacker_log "info" "Run '$0 --help' for usage information"
        exit 1
        ;;
esac

stacker_log "success" "Installation complete!"
stacker_log "info" "Composer service is now ready to use"