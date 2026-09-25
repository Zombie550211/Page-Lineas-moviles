import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import Script from 'next/script'
import { SITE_URL } from './site'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
})

const TITLE = 'Líneas Móviles | Planes 5G para tu Familia'
const DESCRIPTION =
  'Planes de líneas móviles 5G desde $55/mes + impuestos. Sin contratos, soporte en español, activación rápida. Agente independiente con varios proveedores en Estados Unidos.'

export const metadata: Metadata = {
  /* metadataBase permite canonicals y OG relativos en cada página */
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_US',
    siteName: 'Líneas Móviles',
    title: TITLE,
    description: DESCRIPTION,
    url: '/',
    images: [{ url: '/images/og-cover.jpg', width: 1200, height: 630, alt: 'Planes móviles 5G' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/images/og-cover.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preload" as="image" href="/images/hablando_por_telefono.webp" />
        {/* Google Ads Consent Mode v2 — must initialize before gtag.js fires */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer=window.dataLayer||[];
              function gtag(){dataLayer.push(arguments);}
              var _sc=null;try{_sc=localStorage.getItem('cookie_consent');}catch(e){}
              /* Global Privacy Control = opt-out CCPA/CPRA: prevalece sobre el consentimiento guardado */
              var _gpc=navigator.globalPrivacyControl===true;
              var _cs=(_sc==='granted'&&!_gpc)?'granted':'denied';
              /* pinta el banner en el primer frame, sin render extra de React. Con GPC no se pregunta. */
              document.documentElement.setAttribute('data-consent',(_sc||_gpc)?'set':'pending');
              gtag('consent','default',{ad_storage:_cs,analytics_storage:_cs,ad_user_data:_cs,ad_personalization:_cs,wait_for_update:_sc?0:600});
              gtag('js',new Date());
              gtag('config','AW-18023363833');
            `,
          }}
        />
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important;}`}</style>
        </noscript>
      </head>
      <body>
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18023363833"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
