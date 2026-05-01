#!/bin/bash
set -euo pipefail

# ==========================================
# WEB SEARCH自動化 cron 実行用スクリプト
# ==========================================

PROJECT_DIR="/home/ichikabu/projects/rpointwoker"
LOG_FILE="${PROJECT_DIR}/cron.log"
NODE_BIN="/home/ichikabu/.nvm/versions/node/v24.13.0/bin/node"
ENTRYPOINT="run-rakuten-web-search.js"

# 0〜1時間（3600秒）の間でランダムに待機
RANDOM_DELAY=$((RANDOM % 3600))
echo "$(date): ⏳ Waiting for ${RANDOM_DELAY} seconds before execution..." >> "${LOG_FILE}"
sleep "${RANDOM_DELAY}"

# プロジェクトディレクトリへ移動
cd "${PROJECT_DIR}"

# 環境変数の設定 (WSLG / Chrome 実行に必要)
export DISPLAY=:0
export WAYLAND_DISPLAY=wayland-0
export XDG_RUNTIME_DIR=/run/user/1000
export PATH="/home/ichikabu/opt/chrome-for-testing/147/chrome-linux64:/home/ichikabu/opt/chrome-for-testing/147/chromedriver-linux64:${PATH}"

# 実行ログは cron.log に追記
"${NODE_BIN}" "${ENTRYPOINT}" >> "${LOG_FILE}" 2>&1
