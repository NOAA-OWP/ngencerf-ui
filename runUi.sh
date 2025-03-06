#! /bin/bash

ngencerf_ui="$(dirname "$(realpath "${BASH_SOURCE[0]}")")"
echo $ngencerf_ui


# Function to generate git_info.properties
# Should parallel similar functionality in the Dockerfile
generate_git_info() {
  GIT_INFO_PATH=$ngencerf_ui/assets/git_info.json
    echo "Generating git_info.json..."
    jq -n \
        --arg commit_hash "$(git rev-parse HEAD)" \
        --arg branch "$(git rev-parse --abbrev-ref HEAD)" \
        --arg tags "$(git tag --points-at HEAD | tr '\n' ' ')" \
        --arg author "$(git log -1 --pretty=format:'%an')" \
        --arg commit_date "$(date -u -d @"$(git log -1 --pretty=format:'%ct')" +'%Y-%m-%d %H:%M:%S UTC')" \
        --arg message "$(git log -1 --pretty=format:'%s' | tr '\n' ';')" \
        --arg build_date "$(date -u +'%Y-%m-%d %H:%M:%S UTC')" \
        '{"ngencerf_ui": {commit_hash: $commit_hash, branch: $branch, tags: $tags, author: $author, commit_date: $commit_date, message: $message, build_date: $build_date}}' \
        > "$GIT_INFO_PATH"
    echo "git_info.json created at $GIT_INFO_PATH"
}

generate_git_info
echo

echo 'npm install...'
npm install
echo

echo 'building...'
npm run build
echo

echo 'running...'
node .output/server/index.mjs