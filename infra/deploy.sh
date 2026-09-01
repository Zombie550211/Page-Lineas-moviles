#!/usr/bin/env bash
# Publica el sitio estatico en S3 e invalida CloudFront.
#   ./infra/deploy.sh [nombre-del-stack]
set -euo pipefail

STACK="${1:-lineas-moviles-site}"
REGION="us-east-1"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

salida() {
  aws cloudformation describe-stacks --stack-name "$STACK" --region "$REGION" \
    --query "Stacks[0].Outputs[?OutputKey=='$1'].OutputValue" --output text
}

# Los recursos se crearon con la CLI, no con CloudFormation. Con BUCKET y DIST
# en el entorno no se consulta el stack; si no, se leen de sus outputs.
BUCKET="${BUCKET:-$(salida BucketName)}"
DIST="${DIST:-$(salida DistributionId)}"
[ -n "$BUCKET" ] && [ "$BUCKET" != "None" ] || { echo "No se pudo leer el bucket del stack $STACK"; exit 1; }

echo "==> Ensamblando dist/"
rm -rf dist && mkdir -p dist
cp index.html privacidad.html terminos.html 404.html robots.txt sitemap.xml dist/
cp -r public dist/public
cp -r fanpage dist/fanpage

# Comprueba que no se cuele codigo fuente en lo publicado.
for prohibido in package.json CLAUDE.md instrucciones.txt app node_modules infra .git; do
  if [ -e "dist/$prohibido" ]; then echo "ABORTADO: dist/$prohibido no debe publicarse"; exit 1; fi
done

echo "==> Subiendo assets (cache larga, tienen nombre estable)"
aws s3 sync dist/ "s3://$BUCKET/" --region "$REGION" --delete \
  --exclude "*.html" --exclude "robots.txt" --exclude "sitemap.xml" \
  --cache-control "public, max-age=31536000, immutable"

echo "==> Subiendo HTML (sin cache en el navegador; CloudFront cachea y se invalida)"
aws s3 sync dist/ "s3://$BUCKET/" --region "$REGION" --delete \
  --exclude "*" --include "*.html" --include "robots.txt" --include "sitemap.xml" \
  --cache-control "public, max-age=0, must-revalidate"

echo "==> Invalidando CloudFront ($DIST)"
ID=$(aws cloudfront create-invalidation --distribution-id "$DIST" --paths "/*" \
       --query 'Invalidation.Id' --output text)
aws cloudfront wait invalidation-completed --distribution-id "$DIST" --id "$ID"

echo "==> Listo. https://lineas-moviles.com"
