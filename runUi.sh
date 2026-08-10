#! /bin/bash

# Run ngencerf-ui application
# - Check the current node version against the required version in .nvmrc.
# - If there's a mismatch, switch node versions using nvm and reinstalls dependencies.
# - Generates Git information using generate_git_info.sh.
# - Starts the ngencerf-ui application with npm.

# ngencerf-ui root directory
ngencerf_ui="$(dirname "$(realpath "${BASH_SOURCE[0]}")")"

# Source the generate_git_info.sh script to use its functions
source "$ngencerf_ui/generate_git_info.sh"

# get required node version from .nvmrc
REQUIRED_NODE_VERSION=$(cat "$ngencerf_ui/.nvmrc")

# get current node version
CURRENT_NODE_VERSION=$(node -v | sed 's/v//')

# check if current node version is the same as required node version
if [[ "$CURRENT_NODE_VERSION" != "$REQUIRED_NODE_VERSION" ]]; then
    echo -e "\nCurrent Node version: $CURRENT_NODE_VERSION"
    echo "Required Node version: $REQUIRED_NODE_VERSION"

    # if $NVM_DIR is not set, try to set it
    if [ -z "$NVM_DIR" ]; then
        echo "NVM_DIR is not set. Attempting to load nvm..."
        export NVM_DIR="$HOME/.nvm"

        # check if nvm is installed
        if [ ! -s "$NVM_DIR/nvm.sh" ]; then
            echo -e "nvm is not installed. Follow instructions here: " \
                "https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating"
            exit 1
        fi
    fi

    # load nvm
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

    # load nvm bash_completion
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

    echo -e "\nTemporarily switching Node version to ${REQUIRED_NODE_VERSION} with nvm..."
    nvm install "$REQUIRED_NODE_VERSION"

    echo -e "\nCleaning up old dependencies if any..."
    rm -rf "$ngencerf_ui/node_modules"

    echo -e "\n(Re)installing dependencies..."
    cd "$ngencerf_ui"
    npm ci

    echo -e "\nNode version temporarily switched to ${REQUIRED_NODE_VERSION}"
    echo -e "To avoid re-instsalling this Node version for subsequent runs of runUi.sh, " \
        "issue the following commands from your terminal:"
    echo -e "  nvm install ${REQUIRED_NODE_VERSION}\n  nvm alias default ${REQUIRED_NODE_VERSION}\n"
fi

# check if node_modules is missing
if [ ! -d "$ngencerf_ui/node_modules" ]; then
    echo -e "\nnode_modules not found. installing dependencies..."
    cd "$ngencerf_ui"
    npm ci
fi

generate_git_info
echo

echo 'running ngencerf-ui in dev mode...'
npm run dev
echo
