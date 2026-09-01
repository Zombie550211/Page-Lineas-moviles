# Despliegue en AWS — lineas-moviles.com

Sitio estático en **S3 privado + CloudFront**, DNS en **Route 53**.
Todo el stack va en `us-east-1`: CloudFront solo acepta certificados ACM de esa región.

## Estado del DNS antes de empezar

| Registro | Valor actual | Dónde |
|---|---|---|
| NS | `helios.dns-parking.com`, `aster.dns-parking.com` | Hostinger |
| A (apex) | `216.24.57.1` | hosting anterior |
| CNAME `www` | host del proveedor anterior (301 al apex) | hosting anterior |
| MX / TXT / CAA | **ninguno** | — |

No hay correo ni verificaciones en el dominio: mover nameservers no rompe nada más que el web.

## Permisos necesarios

Dos usuarios en la cuenta, ninguno completo:

| Usuario | Route 53 | ACM | S3 | CloudFront | CloudFormation |
|---|---|---|---|---|---|
| `crm-migration` | no | no | no | no | no |
| `connecting-deploy` (perfil `connecting`) | si | si | si | parcial | no |

`connecting-deploy` puede crear el OAC y leer distribuciones, pero tiene denegado
`CreateFunction`, `CreateResponseHeadersPolicy` y `ListResponseHeadersPolicies`,
que son justo las piezas de las URLs limpias y las cabeceras de seguridad.

Para completar la migracion, un admin debe adjuntar `infra/iam-policy-deploy.json`
a `connecting-deploy`:

```bash
aws iam create-policy --policy-name lineas-moviles-deploy \
  --policy-document file://infra/iam-policy-deploy.json
aws iam attach-user-policy --user-name connecting-deploy \
  --policy-arn arn:aws:iam::964060772387:policy/lineas-moviles-deploy
```

## Estado de la migración — COMPLETADA

El sitio se sirve desde AWS. Recursos creados con la CLI (perfil `connecting`),
no con CloudFormation: la plantilla queda como referencia del diseño.

| Recurso | Valor |
|---|---|
| Hosted zone | `Z03177593JKSBRT7F0UFH` |
| Nameservers | `ns-913.awsdns-50.net`, `ns-1233.awsdns-26.org`, `ns-1537.awsdns-00.co.uk`, `ns-454.awsdns-56.com` |
| Certificado ACM | `.../7c1e1d98-a1e8-4890-8d2c-a4b251672631` (ISSUED) |
| Bucket | `lineas-moviles-com-site` (us-east-1, privado, OAC) |
| OAC | `EBN3PP3TSU440` |
| Distribución | `E1Z1L8F3TXOY24` — `d1rroc0j8ltocd.cloudfront.net` |

### Publicar cambios

```bash
export AWS_PROFILE=connecting
BUCKET=lineas-moviles-com-site DIST=E1Z1L8F3TXOY24 ./infra/deploy.sh
```

Las páginas legales se suben además **sin extensión** (`privacidad`, `terminos`,
con `Content-Type: text/html`). Así `/privacidad` funciona sin necesitar la
función de CloudFront, para la que no hay permisos:

```bash
aws s3 cp dist/privacidad.html s3://lineas-moviles-com-site/privacidad \
  --content-type "text/html; charset=utf-8" --cache-control "public, max-age=0, must-revalidate"
```

### Pendiente (requiere permisos de admin)

Falta adjuntar `infra/iam-policy-deploy.json` a `connecting-deploy` para crear la
política de cabeceras propia y la función de rewrite. Mientras tanto:

- Las cabeceras las pone la política **gestionada** de AWS
  (`67f7725c-6f97-4210-82d7-5512b31e9d03`): HSTS de 1 año sin `includeSubDomains`
  ni `preload`, `X-Frame-Options: SAMEORIGIN` en vez de `DENY`, y sin
  `Permissions-Policy`, `Cross-Origin-Opener-Policy` ni la CSP en Report-Only.
- `www` **no redirige** al apex: sirve el mismo contenido con 200. El `canonical`
  apunta al apex, así que el impacto en SEO es limitado, pero la redirección 301
  necesita la función de CloudFront.

Ambas se arreglan con un `UpdateDistribution`, sin rehacer nada.

---

## Orden de ejecución

El punto delicado es el certificado: ACM valida por DNS público, y el DNS **todavía**
lo sirve Hostinger. Por eso se valida ANTES de mover nameservers.

### 1. Hosted zone en Route 53

```bash
aws route53 create-hosted-zone --name lineas-moviles.com \
  --caller-reference "migracion-$(date +%s)" \
  --query '{Zona:HostedZone.Id, Nameservers:DelegationSet.NameServers}'
```

Guarda el ID (`/hostedzone/ZXXXXXXXXXXXX` → usa solo `ZXXXXXXXXXXXX`) y los 4 nameservers.
**Todavía no los pongas en el registrador.**

### 2. Certificado ACM

```bash
aws acm request-certificate --region us-east-1 \
  --domain-name lineas-moviles.com \
  --subject-alternative-names www.lineas-moviles.com \
  --validation-method DNS --query CertificateArn --output text
```

Obtén el CNAME de validación:

```bash
aws acm describe-certificate --region us-east-1 --certificate-arn <ARN> \
  --query 'Certificate.DomainValidationOptions[].ResourceRecord'
```

### 3. Validar el certificado desde Hostinger

Crea ese CNAME **en Hostinger**, que es quien manda ahora. En minutos el estado pasa a `ISSUED`:

```bash
aws acm describe-certificate --region us-east-1 --certificate-arn <ARN> \
  --query 'Certificate.Status' --output text
```

> **Crea el mismo CNAME también en Route 53.** ACM revalida por DNS al renovar
> (~11 meses). Si el registro solo vive en Hostinger, tras el cambio de nameservers
> la renovación falla en silencio y el certificado expira.

### 4. Desplegar el stack

```bash
aws cloudformation deploy --region us-east-1 \
  --stack-name lineas-moviles-site \
  --template-file infra/static-site.yaml \
  --parameter-overrides \
      DomainName=lineas-moviles.com \
      HostedZoneId=<ZXXXXXXXXXXXX> \
      CertificateArn=<ARN>
```

Tarda ~15 min (CloudFront). Los registros A/AAAA se crean en Route 53, que aún no es
autoritativa — no afecta al sitio en producción.

### 5. Subir el contenido

```bash
./infra/deploy.sh lineas-moviles-site
```

### 6. Probar ANTES de tocar el DNS

```bash
CF=$(aws cloudformation describe-stacks --region us-east-1 --stack-name lineas-moviles-site \
      --query "Stacks[0].Outputs[?OutputKey=='DistributionDomain'].OutputValue" --output text)

# Con el Host real, sin que el dominio apunte todavía a AWS
curl -sI --connect-to lineas-moviles.com:443:$CF:443 https://lineas-moviles.com/
curl -so /dev/null -w '%{http_code}\n' --connect-to lineas-moviles.com:443:$CF:443 https://lineas-moviles.com/privacidad
curl -so /dev/null -w '%{http_code}\n' --connect-to lineas-moviles.com:443:$CF:443 https://lineas-moviles.com/fanpage/pagina.html
```

Comprueba: `200` en las tres, cabeceras `strict-transport-security` y `x-frame-options`,
y que `/privacidad` (sin `.html`) resuelva.

### 7. Bajar el TTL y cortar

En Hostinger, baja el TTL de los registros a 300s y espera a que caduque el TTL anterior.
Después cambia los nameservers del dominio en tu **registrador** a los 4 de Route 53.

```bash
dig +short NS lineas-moviles.com
dig +short lineas-moviles.com
```

### 8. Verificar en producción

```bash
curl -sI https://lineas-moviles.com | grep -iE 'strict-transport|x-frame|content-security'
curl -so /dev/null -w '%{http_code}\n' https://lineas-moviles.com/privacidad
curl -sI https://www.lineas-moviles.com | grep -i location   # 301 al apex
curl -so /dev/null -w '%{http_code}\n' https://lineas-moviles.com/api.js   # debe dar 404
```

Y en Google Ads: que la URL final de los anuncios siga resolviendo y que el clic a
teléfono siga registrando la conversión `Contacto`.

### 9. Dar de baja el hosting anterior

Solo cuando lleves 48h estable. Borra el sitio estático en el panel del proveedor anterior.

---

## Rollback

Mientras no borres el servicio del hosting anterior, revertir es volver a poner los nameservers de
Hostinger en el registrador. Por eso se baja el TTL antes: la vuelta tarda minutos, no horas.

## Coste estimado

Route 53: $0.50/mes por zona. S3: centavos. CloudFront `PriceClass_100`: el primer TB
mensual entra en la capa gratuita. Para el tráfico de una landing, **menos de $1/mes**.

## Notas

- El bucket tiene `DeletionPolicy: Retain`: un `delete-stack` no borra el contenido.
- La CSP va en **Report-Only**. Revisa la consola del navegador y promuévela a
  `Content-Security-Policy` en `SecurityHeadersPolicy` cuando no reporte violaciones.
- `deploy.sh` aborta si detecta código fuente dentro de `dist/`.
