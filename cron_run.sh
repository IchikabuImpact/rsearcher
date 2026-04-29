#!/bin/bash

# ==========================================
# WEB SEARCH自動化 cron 実行用スクリプト
# ==========================================

# 0〜1時間（3600秒）の間でランダムに待機
RANDOM_DELAY=$((RANDOM % 3600))
echo "$(date): ⏳ Waiting for ${RANDOM_DELAY} seconds before execution..." >> /home/ichikabu/projects/rpointwoker/cron.log
sleep ${RANDOM_DELAY}

# プロジェクトディレクトリへ移動
cd /home/ichikabu/projects/rpointwoker

# 環境変数の設定 (WSLG / Chrome 実行に必要)
export DISPLAY=:0
export WAYLAND_DISPLAY=wayland-0
export XDG_RUNTIME_DIR=/run/user/1000
export PATH="/home/ichikabu/opt/chrome-for-testing/147/chrome-linux64:/home/ichikabu/opt/chrome-for-testing/147/chromedriver-linux64:$PATH"

# Node.js v24 の絶対パスを指定して実行
# 実行ログは cron.log に追記されます
/home/ichikabu/.nvm/versions/node/v24.13.0/bin/node kuji-login.js >> cron.log 2>&1
