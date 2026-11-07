#!/usr/bin/env bash
# Xuất PDF từ slide HTML bằng Chrome headless (chạy trong WSL hoặc Git Bash)
set -e
cd "$(dirname "$0")"
CH="${CHROME:-/mnt/c/Program Files/Google/Chrome/Application/chrome.exe}"
[ -x "$CH" ] || CH="/c/Program Files/Google/Chrome/Application/chrome.exe"
if command -v wslpath >/dev/null; then ROOT=$(wslpath -w "$PWD" | sed 's#\\#/#g'); else ROOT=$(pwd -W 2>/dev/null || pwd); fi
"$CH" --headless=new --disable-gpu --no-pdf-header-footer --allow-file-access-from-files \
  --virtual-time-budget=15000 --run-all-compositor-stages-before-draw \
  --print-to-pdf="$ROOT/Slides_Pitch_MilkLoop.pdf" "file:///$ROOT/slides/index.html?print-pdf"
