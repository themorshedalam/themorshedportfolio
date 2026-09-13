#!/bin/bash
# Sequential image generation — most reliable, one at a time
set -u
OUT="/home/z/my-project/public/projects"
mkdir -p "$OUT"

gen() {
  local prompt="$1"; local out="$2"
  if [ -f "$out" ] && [ -s "$out" ]; then
    echo "skip $(basename "$out")"
    return 0
  fi
  echo "start $(basename "$out")"
  timeout 200 z-ai image -p "$prompt" -o "$out" -s 1344x768 > /dev/null 2>&1
  if [ -f "$out" ] && [ -s "$out" ]; then
    echo "done $(basename "$out") ($(stat -c%s "$out") bytes)"
    return 0
  else
    echo "FAIL $(basename "$out")"
    return 1
  fi
}

# Hero images first (priority)
gen "elegant couple from behind in luxury hotel interior, grand chandelier, warm golden light, wood lattice, cinematic editorial photography" "$OUT/celebrating-25-years-1.png"
gen "cinematic product launch stage futuristic neon blue amber lighting LED screen smoke haze audience silhouettes" "$OUT/launch-2026-1.png"
gen "luxury resort infinity pool tropical ocean sunset palm trees modern architecture cinematic travel photography" "$OUT/staycation-escapes-1.png"
gen "elegant Ramadan still life ornate golden lantern dates ceramic plate crescent moon warm amber lighting dark background" "$OUT/ramadan-2026-1.png"
gen "cinematic modern luxury SUV on coastal mountain road golden hour dynamic angle reflective body dramatic sky" "$OUT/jetour-1.png"
gen "multiple diverse hands coming together forming heart shape against warm sunset sky community charity emotional cinematic" "$OUT/one-heart-1.png"

# Detail images (secondary)
gen "extreme close-up crystal chandelier warm bokeh lights, luxury anniversary, golden glow, cinematic editorial" "$OUT/celebrating-25-years-2.png"
gen "abstract motion graphics frame glowing geometric shapes dark space blue orange gradient particles 3d render cinematic" "$OUT/launch-2026-2.png"
gen "elegant resort suite interior floor to ceiling windows minimal luxury furniture soft natural light ocean view" "$OUT/staycation-escapes-2.png"
gen "close-up intricate golden arabesque pattern warm bokeh lights Ramadan celebration dark moody luxury ornamental" "$OUT/ramadan-2026-2.png"
gen "macro detail luxury car headlight grille sharp LED light signature dark metallic surface dramatic studio lighting automotive" "$OUT/jetour-2.png"
gen "close-up two hands gently holding small glowing red heart warm dark background emotional premium photography charity" "$OUT/one-heart-2.png"

echo "=== ALL DONE ==="
ls -la "$OUT"
