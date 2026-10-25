#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p audio
python3 - <<'PY' | while IFS=$'\t' read -r id text; do
import json
with open('data/script.json') as f:
    data = json.load(f)
for line in data['lines']:
    print(line['id'] + '\t' + line['text'])
for word in sorted(set(data['vocab'].values())):
    print('vocab_' + word + '\t' + word)
PY
  espeak-ng -v la -s 140 --stdout "$text" | ffmpeg -hide_banner -loglevel error -y -i - -codec:a libmp3lame -q:a 6 "audio/$id.mp3"
done
