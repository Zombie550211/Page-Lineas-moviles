'use client'

import { useState } from 'react'

/* Exclusión CCPA/CPRA: niega todo el consentimiento publicitario en este navegador */
export default function OptOutButton() {
  const [done, setDone] = useState(false)

  const optOut = () => {
    try { localStorage.setItem('cookie_consent', 'denied') } catch {}
    window.gtag?.('consent', 'update', {
      ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    })
    setDone(true)
  }

  return (
    <p style={{ display: 'flex', alignItems: 'center', gap: '.75rem', flexWrap: 'wrap', marginTop: '.5rem' }}>
      <button
        type="button"
        onClick={optOut}
        style={{ background: '#0F172A', color: '#fff', border: 'none', padding: '.6rem 1.2rem', borderRadius: 4, font: 'inherit', fontWeight: 700, cursor: 'pointer' }}
      >
        No vender ni compartir mis datos
      </button>
      <span role="status" style={{ fontSize: '.9rem', color: '#475569' }}>
        {done && 'Listo: las cookies publicitarias quedan desactivadas en este navegador.'}
      </span>
    </p>
  )
}
