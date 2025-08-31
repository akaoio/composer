#!/bin/sh
# Composer Installation - Stacker Framework Integration
# Clean single-word naming, unified architecture

set -e

# Ensure Stacker is available
if ! command -v stacker >/dev/null 2>&1; then
    echo "ERROR: Stacker framework required but not found"
    echo "Install: stacker self-install"
    exit 1
fi

# Configure Composer for Stacker installation
export STACKER_SERVICE_TYPE="simple"
export STACKER_TECH_NAME="composer"
export STACKER_REPO_URL="https://github.com/akaoio/composer.git"
export STACKER_MAIN_SCRIPT="composer.sh"
export STACKER_SERVICE_DESCRIPTION="Atomic Documentation Engine"

# Initialize Stacker for Composer
stacker init --template=service --name=composer --repo="$STACKER_REPO_URL"

echo "✅ Composer installation configured via Stacker framework"
echo "Run: stacker install --systemd"