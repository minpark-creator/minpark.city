#!/bin/zsh
#
# Re-encode Observations clips for the web.
#
# The recordings come off an iPhone as 4K HLG HDR HEVC in a QuickTime
# container: ~26 Mbps, 34–90 MB for ten seconds, and `video/quicktime`, which
# Firefox frequently refuses to play at all. Nothing on the site shows them
# wider than about 1050 CSS px, so the resolution is the waste — not the codec.
#
# Choices worth keeping:
#   * No tone mapping. ffmpeg has no zscale/libplacebo here, and the plain
#     `tonemap` filter only darkened the picture. Reading the HLG values as-is
#     matches what browsers already show, so colour is left alone.
#   * 1600 wide. At the size it is displayed this is indistinguishable from the
#     4K source; 1920 costs more for no visible gain.
#   * CRF 23 with -maxrate 5M. CRF alone let the leafy, high-motion clips run
#     to 15 Mbps; the cap flattens the whole set to 4.4–5.5 Mbps with no
#     difference on screen.
#   * H.264 High in MP4, +faststart, so every browser can both play it and
#     begin before the file has finished arriving.
#   * -nostdin, or ffmpeg eats the while-loop's input and the batch silently
#     processes only the first entry.
#
# Input:  list.txt, tab-separated: <docId> <slug> <sourceUrl> <assetId>
# Output: final/<slug>.mp4 and poster/<slug>.jpg
# Then:   node scripts/upload-films.mjs <workdir>
#
set -u
export PATH="/opt/homebrew/bin:$PATH"
W="${1:?usage: encode-films.sh <workdir containing list.txt>}"
cd "$W"
mkdir -p src final poster

while IFS=$'\t' read -r docid slug url assetid; do
  [ -z "$slug" ] && continue
  [ -f "src/$slug.mov" ] || curl -sS -o "src/$slug.mov" "$url"

  ffmpeg -nostdin -v error -y -i "src/$slug.mov" \
    -vf "scale=1600:-2:flags=lanczos,format=yuv420p" \
    -c:v libx264 -profile:v high -level 4.1 -preset slow -crf 23 \
    -maxrate 5M -bufsize 10M \
    -color_primaries bt709 -color_trc bt709 -colorspace bt709 \
    -c:a aac -b:a 96k -ac 2 -movflags +faststart \
    "final/$slug.mp4"

  # A still means the first frame is on screen before any video is fetched,
  # which is what lets the players preload nothing.
  ffmpeg -nostdin -v error -y -ss 0.5 -i "src/$slug.mov" \
    -vf "scale=1600:-2:flags=lanczos" -frames:v 1 -q:v 4 \
    "poster/$slug.jpg"

  printf "%-30s %7.1fM -> %6.1fM\n" "$slug" \
    "$(echo "$(stat -f %z src/$slug.mov)/1048576" | bc -l)" \
    "$(echo "$(stat -f %z final/$slug.mp4)/1048576" | bc -l)"
done < list.txt
