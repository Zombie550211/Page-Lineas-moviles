#!/usr/bin/env bash
# Vista previa local con la misma estructura que se publica en S3
# (public/ volcado a la raiz, igual que deploy.sh).
#   ./infra/preview.sh [puerto]   (por defecto 4321; 8080 es del sistema de cuadratura)
set -euo pipefail

PORT="${1:-4321}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="${TMPDIR:-/tmp}/lineas-moviles-preview"
cd "$ROOT"

if ss -ltn "sport = :$PORT" | grep -q LISTEN; then
  echo "El puerto $PORT esta ocupado. Usa otro: ./infra/preview.sh 4400"; exit 1
fi

rm -rf "$OUT" && mkdir -p "$OUT"
cp index.html privacidad.html terminos.html cancelacion.html ayuda.html 404.html robots.txt sitemap.xml "$OUT/"
cp -r public/. "$OUT/"

echo "==> http://localhost:$PORT  (Ctrl+C para detener; vuelve a correrlo tras cada cambio)"
python3 -m http.server "$PORT" --bind 127.0.0.1 -d "$OUT"
