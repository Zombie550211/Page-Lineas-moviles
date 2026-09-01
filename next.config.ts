import type { NextConfig } from 'next'

/* Dominios de terceros realmente en uso: Google Ads (gtag) y Botpress (webchat). */
const GOOGLE = 'https://www.googletagmanager.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://www.google.com https://td.doubleclick.net'
const BOTPRESS = 'https://cdn.botpress.cloud https://files.bpcontent.cloud https://*.botpress.cloud'

/*
 * CSP en modo Report-Only: registra violaciones en /api/csp-report sin romper
 * el webchat ni el tag de Ads. Revisar los logs y pasar a `Content-Security-Policy`
 * cuando el reporte esté limpio.
 */
const csp = [
  `default-src 'self'`,
  `base-uri 'self'`,
  `object-src 'none'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
  `script-src 'self' 'unsafe-inline' ${GOOGLE} ${BOTPRESS}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: ${GOOGLE} ${BOTPRESS}`,
  `font-src 'self' data: ${BOTPRESS}`,
  `connect-src 'self' ${GOOGLE} ${BOTPRESS} wss://*.botpress.cloud`,
  `frame-src 'self' ${GOOGLE} ${BOTPRESS}`,
  `media-src 'self' ${BOTPRESS}`,
  `upgrade-insecure-requests`,
  `report-uri /api/csp-report`,
].join('; ')

const securityHeaders = [
  /* fuerza HTTPS durante 2 años en el dominio y subdominios */
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  /* anti-clickjacking (X-Frame-Options para navegadores viejos, frame-ancestors para el resto) */
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Content-Security-Policy', value: `frame-ancestors 'none'` },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  /* no filtrar la URL completa (con parámetros de campaña) a terceros */
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Content-Security-Policy-Report-Only', value: csp },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default nextConfig
