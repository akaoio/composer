#!/bin/sh
# @akaoio/composer - Stacker Framework Loader Integration
# Redirects to main Stacker cortex loader

# Main Stacker directory
MAIN_STACKER_DIR="/home/x/core/projects/stacker"

# Verify and source main loader
if [ ! -f "$MAIN_STACKER_DIR/stacker-loader.sh" ]; then
    echo "FATAL: Main Stacker loader not found at $MAIN_STACKER_DIR" >&2
    exit 1
fi

# Source the main Stacker loader
. "$MAIN_STACKER_DIR/stacker-loader.sh" || {
    echo "FATAL: Cannot load main Stacker loader" >&2
    exit 1
}

# Composer-specific module loading can be added here if needed
# All core module loading functionality is now available through the main cortex