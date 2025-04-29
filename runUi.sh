#! /bin/bash

# Run ngencerf_ui application
# - Check the current node version against the required version in .nvmrc.
# - If there's a mismatch, switch node versions using nvm and reinstalls dependencies.
# - Generates Git information using generate_git_info.sh.
# - Starts the ngencerf_ui application with npm.

# ngencerf_ui root directory
ngencerf_ui="$(dirname "$(realpath "${BASH_SOURCE[0]}")")"

# Source the generate_git_info.sh script to use its functions
source "$ngencerf_ui/generate_git_info.sh"

# get required node version from .nvmrc
REQUIRED_NODE_VERSION=$(cat "$ngencerf_ui/.nvmrc")

# get current node version
CURRENT_NODE_VERSION=$(node -v | sed 's/v//')

# check if current node version is the same as required node version
if [[ "$CURRENT_NODE_VERSION" != "$REQUIRED_NODE_VERSION" ]]; then
    echo "Current Node version: $CURRENT_NODE_VERSION"
    echo "Required Node version: $REQUIRED_NODE_VERSION"

    # if $NVM_DIR is not set, try to set it
    if [ -z "$NVM_DIR" ]; then
        echo "NVM_DIR is not set. Attempting to load nvm..."
        export NVM_DIR="$HOME/.nvm"
    fi

    # check if nvm is installed
    if [ ! -s "$NVM_DIR/nvm.sh" ]; then
        echo "nvm is not installed. Please install nvm to use the correct Node version."
        exit 1
    fi

    # load nvm
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"                   # This loads nvm
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # This loads nvm bash_completion

    echo "Switching Node version with nvm..."
    nvm install "$REQUIRED_NODE_VERSION"

    echo "Cleaning up old dependencies if any..."
    rm -rf "$ngencerf_ui/node_modules" "$ngencerf_ui/package-lock.json"

    echo "(Re)installing dependencies..."
    cd "$ngencerf_ui"
    npm install
fi

# check if node_modules or package-lock.json is missing
if [ ! -d "$ngencerf_ui/node_modules" ] || [ ! -f "$ngencerf_ui/package-lock.json" ]; then
    echo "node_modules or package-lock.json not found. installing dependencies..."
    cd "$ngencerf_ui"
    npm install
fi

generate_git_info
echo

echo 'running...'
npm run dev
echo
