#! /bin/bash

ngencerf_ui="$(dirname "$(realpath "${BASH_SOURCE[0]}")")"

# Source the generate_git_info.sh script to use its functions
source "$ngencerf_ui/generate_git_info.sh"

generate_git_info
echo

echo 'running...'
npm run dev
echo
