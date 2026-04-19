'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

const PHONE = '+18884601317'
const PHONE_DISPLAY = '+1 (888) 460-1317'
const CONVERSION_ID = 'AW-11148367992/CONVERSION_LABEL'

const heroSlides = [
  { src: '/images/hablando_por_telefono.webp', alt: 'Planes Móviles' },
  { src: '/images/familiaconectada.webp',      alt: 'Familia Conectada' },
  { src: '/images/altavelocidad.webp',          alt: 'Alta Velocidad 5G' },
]

const carouselItems = [
  {
    name: 'Samsung Galaxy Z Flip4',
    img: '/images/carrusel/Galaxy_Z_Flip4_detail.webp',
    specs: [
      { label: 'OS',         value: 'Android 12' },
      { label: 'Red',        value: '5G+ (mmWave & C-Band), 4G LTE' },
      { label: 'Batería',    value: '3,700 mAh · Hasta 32h de llamadas' },
      { label: 'Memoria',    value: '128GB / 256GB · 8GB RAM' },
      { label: 'Procesador', value: 'Snapdragon 8+ Gen 1' },
      { label: 'Pantalla',   value: '6.7" (abierto) · 1.9" (cerrado)' },
      { label: 'Cámara',     value: '12MP + 12MP trasera · 10MP frontal' },
    ],
  },
  {
    name: 'iPhone 17 Pro',
    img: '/images/carrusel/iPhone17pro.webp',
    specs: [
      { label: 'OS',         value: 'iOS 18' },
      { label: 'Red',        value: '5G (mmWave & Sub-6GHz), 4G LTE' },
      { label: 'Procesador', value: 'Apple A19 Pro' },
      { label: 'Pantalla',   value: '6.3" Super Retina XDR, ProMotion 120Hz' },
      { label: 'Cámara',     value: 'Sistema Pro 48MP + 12MP + 12MP' },
      { label: 'Batería',    value: 'Todo el día · Carga MagSafe' },
    ],
  },
  {
    name: 'iPhone Air',
    img: '/images/carrusel/iPhoneAir.webp',
    specs: [
      { label: 'OS',      value: 'iOS 18' },
      { label: 'Red',     value: '5G, 4G LTE' },
      { label: 'Diseño',  value: 'El iPhone más delgado de Apple' },
      { label: 'Pantalla',value: '6.6" Super Retina XDR' },
      { label: 'Cámara',  value: '48MP principal · 12MP frontal' },
      { label: 'Carga',   value: 'MagSafe + USB-C' },
    ],
  },
  {
    name: 'Samsung Galaxy Z Fold7',
    img: '/images/carrusel/samsung-galaxy-fold7-detail.webp',
    specs: [
      { label: 'OS',         value: 'Android 15 · One UI 7' },
      { label: 'Red',        value: '5G+ (mmWave & C-Band), 4G LTE' },
      { label: 'Pantalla',   value: '8" interior · 6.5" exterior' },
      { label: 'Procesador', value: 'Snapdragon 8 Elite' },
      { label: 'Cámara',     value: '200MP principal + 12MP ultra + 10MP zoom' },
      { label: 'Batería',    value: '4,400 mAh · Carga rápida 25W' },
    ],
  },
]

const faqs = [
  {
    q: '¿Realmente no hay contratos forzosos?',
    a: '¡Exacto! Creemos en la libertad del cliente. No estás atado a plazos mínimos de permanencia; puedes cancelar el servicio cuando lo desees sin pagar penalizaciones por "terminación anticipada".',
  },
  {
    q: '¿Qué requisitos necesito para contratar si soy extranjero?',
    a: 'Solo necesitas una identificación oficial vigente. Aceptamos pasaporte de cualquier país para abrir tu cuenta, facilitando el proceso sin necesidad de trámites complicados.',
  },
  {
    q: '¿El precio de mi factura cambiará después de unos meses?',
    a: 'No. Ofrecemos un bill fijo. El precio que contratas es el que pagas mes a mes, sin cargos ocultos ni "tarifas de promoción" que expiran después de un tiempo.',
  },
  {
    q: '¿Qué significa que el internet sea "ilimitado"?',
    a: 'Significa que no tenemos límites de datos (data caps). Puedes navegar, ver películas en 4K, jugar en línea y trabajar todo el mes sin preocuparte por reducciones de velocidad o cargos extra por consumo.',
  },
  {
    q: '¿Necesito una verificación de crédito para aplicar?',
    a: '¡Al permitir la contratación con pasaporte y no tener contratos a largo plazo, nuestros requisitos son mucho más flexibles que los de las compañías tradicionales. ¡Consulta con nosotros para una aprobación rápida!',
  },
  {
    q: '¿Cuánto tiempo tarda el envío del equipo?',
    a: 'Una vez aprobada tu solicitud, solemos agendar el envío en un plazo de 24 a 72 horas hábiles.',
  },
  {
    q: '¿Puedo cambiar mi plan de velocidad más adelante?',
    a: '¡Por supuesto! Al no haber contrato, tienes la flexibilidad de subir o bajar la velocidad de tu plan según tus necesidades actuales, sin complicaciones.',
  },
]

export default function Home() {
  const [heroSlide, setHeroSlide]       = useState(0)
  const heroTimer                        = useRef<ReturnType<typeof setInterval> | null>(null)
  const [carouselIdx, setCarouselIdx]   = useState(0)
  const carouselTimer                    = useRef<ReturnType<typeof setInterval> | null>(null)
  const [openFaq, setOpenFaq]           = useState<number | null>(null)
  const [form, setForm]                 = useState({ name: '', phone: '', email: '', address: '' })
  const [formState, setFormState]       = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [cookieVisible, setCookieVisible] = useState(false)

  /* hero timer */
  const startHeroTimer = useCallback(() => {
    if (heroTimer.current) clearInterval(heroTimer.current)
    heroTimer.current = setInterval(() => setHeroSlide(s => (s + 1) % heroSlides.length), 6000)
  }, [])

  useEffect(() => {
    startHeroTimer()
    return () => { if (heroTimer.current) clearInterval(heroTimer.current) }
  }, [startHeroTimer])

  /* carousel timer */
  const startCarouselTimer = useCallback(() => {
    if (carouselTimer.current) clearInterval(carouselTimer.current)
    carouselTimer.current = setInterval(() => setCarouselIdx(i => (i + 1) % carouselItems.length), 5000)
  }, [])

  useEffect(() => {
    startCarouselTimer()
    return () => { if (carouselTimer.current) clearInterval(carouselTimer.current) }
  }, [startCarouselTimer])

  /* cookie banner */
  useEffect(() => {
    if (!localStorage.getItem('cookie_consent')) setCookieVisible(true)
  }, [])

  /* reveal on scroll */
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal')
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('visible'))
      return
    }
    const vh = window.innerHeight
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) } }),
      { threshold: 0.06, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach(el => {
      if (el.getBoundingClientRect().top < vh) el.classList.add('visible')
      else io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  /* phone click */
  const onPhoneClick = () => {
    window.gtag?.('event', 'conversion', { send_to: CONVERSION_ID, event_callback: () => {} })
    window.gtag?.('event', 'phone_call_click', { phone_number: PHONE })
  }

  /* carousel nav */
  const goCarousel = (n: number) => {
    setCarouselIdx((n + carouselItems.length) % carouselItems.length)
    startCarouselTimer()
  }

  /* form */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { name, phone, email, address } = form
    if (!name || !phone || !email || !address) return
    setFormState('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, address }),
      })
      const data = await res.json()
      if (data.ok) {
        window.gtag?.('event', 'lead_magnet_submit', { name, phone })
        setFormState('success')
      } else {
        setFormState('error')
      }
    } catch {
      setFormState('error')
    }
  }

  /* cookie */
  const acceptCookie = () => {
    localStorage.setItem('cookie_consent', 'granted')
    window.gtag?.('consent', 'update', { ad_storage: 'granted', analytics_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' })
    setCookieVisible(false)
  }
  const rejectCookie = () => {
    localStorage.setItem('cookie_consent', 'denied')
    window.gtag?.('consent', 'update', { ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })
    setCookieVisible(false)
  }

  return (
    <>
      {/* NAV */}
      <nav>
        <div className="nav-left">
          <Link href="#servicios" className="nav-link">Servicios</Link>
          <Link href="#familiar"  className="nav-link">Familias</Link>
          <Link href="#planes"    className="nav-link">Planes</Link>
        </div>
        <div className="nav-center">
          <Link className="nav-logo" href="/">
            <Image src="/images/Connecting_logo.webp" alt="Líneas Móviles" width={80} height={32} priority />
            <span className="nav-logo-text">Connecting</span>
          </Link>
        </div>
        <div className="nav-right">
          <Link href="#faq" className="nav-link">Preguntas</Link>
          <a href={`tel:${PHONE}`} className="nav-cta" onClick={onPhoneClick}>Llamar</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="servicios">
        <div className="hero-slides">
          {heroSlides.map((slide, i) => (
            <div key={i} className={`hero-slide${i === heroSlide ? ' active' : ''}`}>
              <Image src={slide.src} alt={slide.alt} fill style={{ objectFit: 'cover', objectPosition: 'center top' }} priority={i === 0} />
            </div>
          ))}
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <p className="hero-eyebrow">Red 5G activa en todo USA</p>
            <h1>Conecta a tu<br /><em>Familia</em> hoy.</h1>
            <p className="hero-sub">Planes sin contratos desde $55/mes. Soporte 100% en español. Activa hoy mismo.</p>
            <div className="hero-actions">
              <a href={`tel:${PHONE}`} className="btn-hero-main" onClick={onPhoneClick}>📞 Hablar con un Asesor</a>
              <Link href="#planes" className="btn-hero-ghost">Ver planes →</Link>
            </div>
          </div>
          <div className="hero-pagination">
            <p className="hero-page-counter"><span>{heroSlide + 1}</span> / {heroSlides.length}</p>
            <div className="hero-dots">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  className={`hero-dot${i === heroSlide ? ' active' : ''}`}
                  onClick={() => { setHeroSlide(i); startHeroTimer() }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-strip">
        {[
          { num: '+10K', label: 'Clientes Satisfechos' },
          { num: '99%',  label: 'Cobertura Nacional' },
          { num: '$55',  label: 'Desde / mes' },
          { num: '24/7', label: 'Soporte en Español' },
        ].map((s, i) => (
          <div key={i} className={`stat-item reveal${i > 0 ? ` reveal-delay-${i}` : ''}`}>
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* SPLIT 1: Familias */}
      <section className="split" id="familiar">
        <div className="split-image reveal">
          <Image src="/images/familiaconectada.webp" alt="Familia Conectada" fill style={{ objectFit: 'cover' }} />
        </div>
        <div className="split-content reveal reveal-delay-1">
          <span className="split-tag">Planes Familiares</span>
          <h2>Ahorra más<br /><em>por línea.</em></h2>
          <p>Agrega hasta 4 líneas y disfruta de tarifas reducidas. Cuantas más líneas, más ahorras. Toda tu familia en la red 5G más rápida de Estados Unidos.</p>
          <div><a href={`tel:${PHONE}`} className="btn-dark" onClick={onPhoneClick}>Hablar con un Asesor</a></div>
        </div>
      </section>

      {/* SPLIT 2: Datos ilimitados */}
      <section className="split split-dark">
        <div className="split-content reveal" style={{ background: 'var(--black)' }}>
          <span className="split-tag">Sin Límites</span>
          <h2>Datos<br /><em>ilimitados.</em></h2>
          <p>Sin data caps, sin sorpresas. Streaming en 4K, videollamadas y gaming todo el mes sin interrupciones ni cargos extra.</p>
          <div><a href={`tel:${PHONE}`} className="btn-outline-white" onClick={onPhoneClick}>Conocer Más</a></div>
        </div>
        <div className="split-image reveal reveal-delay-1">
          <Image src="/images/datos ilimitados.webp" alt="Datos Ilimitados" fill style={{ objectFit: 'cover' }} />
        </div>
      </section>

      {/* CAROUSEL DISPOSITIVOS */}
      <section className="carousel-section" id="dispositivos">
        <div className="carousel-header reveal">
          <span className="section-eyebrow">Tecnología de Punta</span>
          <h2 className="section-title">Teléfonos de<br /><em>Alta Gama.</em></h2>
          <p className="section-sub">Los mejores dispositivos disponibles para tu plan móvil.</p>
        </div>
        <div className="carousel-wrapper">
          <div className="carousel-track" style={{ transform: `translateX(-${carouselIdx * 100}%)` }}>
            {carouselItems.map((item, i) => (
              <div key={i} className="carousel-slide">
                <div className="carousel-slide-inner">
                  <div className="carousel-img-wrap">
                    <Image src={item.img} alt={item.name} width={400} height={400} style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }} />
                  </div>
                  <div className="carousel-info">
                    <div className="carousel-name">{item.name}</div>
                    <ul className="carousel-specs">
                      {item.specs.map((s, j) => (
                        <li key={j}><span className="spec-label">{s.label}</span> {s.value}</li>
                      ))}
                    </ul>
                    <a href={`tel:${PHONE}`} className="btn-dark" style={{ width: 'fit-content' }} onClick={onPhoneClick}>Contactar un Asesor</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="carousel-controls">
          <div className="carousel-progress">
            {carouselItems.map((_, i) => (
              <button key={i} className={`carousel-dot${i === carouselIdx ? ' active' : ''}`} onClick={() => goCarousel(i)} />
            ))}
          </div>
          <div className="carousel-counter">
            <strong>{carouselIdx + 1}</strong> / {carouselItems.length}
          </div>
          <div className="carousel-nav">
            <button className="carousel-btn" onClick={() => goCarousel(carouselIdx - 1)}>←</button>
            <button className="carousel-btn" onClick={() => goCarousel(carouselIdx + 1)}>→</button>
          </div>
        </div>
      </section>

      {/* PLANES */}
      <section className="plans-section" id="planes">
        <div className="section-header reveal">
          <span className="section-eyebrow">Precios Transparentes</span>
          <h2 className="section-title">Elige tu Plan.</h2>
          <p className="section-sub">Sin letra chica. El precio que ves es el que pagas mes a mes.</p>
        </div>
        <div className="plans-grid">
          {[
            { badge: 'Plan 01',    name: 'Básico',   price: '55',  features: ['Datos ilimitados 5G', 'Llamadas y mensajes ilimitados', 'Soporte 24/7 en español'],           featured: false },
            { badge: 'Recomendado', name: 'Familiar', price: '150', features: ['Hasta 4 líneas incluidas', 'Datos ilimitados para todos', 'Descuentos por líneas adicionales'], featured: true  },
            { badge: 'Plan 03',    name: 'Premium',  price: '90',  features: ['Datos ilimitados 5G', 'Incluye dispositivo de alta gama', 'Soporte en español 24/7'],          featured: false },
          ].map((plan, i) => (
            <div key={i} className={`plan-card reveal${plan.featured ? ' featured' : ''}${i > 0 ? ` reveal-delay-${i}` : ''}`}>
              <span className="plan-badge">{plan.badge}</span>
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price"><sup>$</sup>{plan.price}<sub>/mes</sub></div>
              <hr className="plan-divider" />
              <ul className="plan-features">
                {plan.features.map((f, j) => <li key={j}>{f}</li>)}
              </ul>
              <a href={`tel:${PHONE}`} className="plan-cta" onClick={onPhoneClick}>Hablar con un Asesor</a>
              <Link href="/terminos" className="plan-cond">*Condiciones Aplican</Link>
            </div>
          ))}
        </div>
      </section>

      {/* SPLIT 3: Cobertura */}
      <section className="split split-cream" id="cobertura">
        <div className="split-image reveal">
          <Image src="/images/mapa_de_cobertura.webp" alt="Cobertura Nacional" fill style={{ objectFit: 'cover' }} />
        </div>
        <div className="split-content reveal reveal-delay-1" style={{ background: 'var(--cream-dark)' }}>
          <span className="split-tag">Cobertura y Velocidad</span>
          <h2>El 99% de<br /><em>Estados Unidos.</em></h2>
          <p>Nuestra red cubre el 99% del territorio. Siempre conectado sin importar dónde te encuentres.</p>
          <div><a href={`tel:${PHONE}`} className="btn-dark" onClick={onPhoneClick}>Verificar Cobertura</a></div>
        </div>
      </section>

      {/* SPLIT 4: Velocidad */}
      <section className="split split-dark">
        <div className="split-content reveal" style={{ background: 'var(--black)' }}>
          <span className="split-tag">5G Ultra Rápido</span>
          <h2>Hasta<br /><em>1 Gbps.</em></h2>
          <p>Streaming en HD, videollamadas y gaming sin interrupciones. La conexión más rápida para tu familia, disponible hoy.</p>
          <div><a href={`tel:${PHONE}`} className="btn-outline-white" onClick={onPhoneClick}>Hablar con un Asesor</a></div>
        </div>
        <div className="split-image reveal reveal-delay-1">
          <Image src="/images/altavelocidad.webp" alt="Alta Velocidad 5G" fill style={{ objectFit: 'cover' }} />
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section" id="faq">
        <div className="section-header reveal">
          <span className="section-eyebrow">Resolvemos tus dudas</span>
          <h2 className="section-title">Preguntas<br /><em>Frecuentes.</em></h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-item reveal${openFaq === i ? ' open' : ''}`}>
              <button
                className="faq-question"
                aria-expanded={openFaq === i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {faq.q}
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">{faq.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LEAD MAGNET */}
      <section className="lead-section">
        <span className="lead-eyebrow">Contacto Directo</span>
        <h2>¿No puedes<br /><em>llamar ahora?</em></h2>
        <p>Déjanos tus datos y un asesor te contactará en menos de 10 minutos.</p>
        {formState === 'success' ? (
          <p style={{ marginTop: '2rem', color: 'rgba(255,255,255,.7)', fontSize: '.9rem' }}>
            ✓ Recibido. Te llamamos en menos de 10 minutos.
          </p>
        ) : (
          <form className="lead-form" onSubmit={handleSubmit}>
            <input className="lead-input" type="text"  placeholder="Nombre completo"    required value={form.name}    onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <input className="lead-input" type="tel"   placeholder="Número de teléfono" required value={form.phone}   onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            <input className="lead-input" type="email" placeholder="Correo electrónico" required value={form.email}   onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <input className="lead-input" type="text"  placeholder="Dirección"          required value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
            <button type="submit" className="lead-btn" disabled={formState === 'loading'}>
              {formState === 'loading' ? 'Enviando...' : 'Que me llamen →'}
            </button>
          </form>
        )}
        {formState === 'error' && (
          <p style={{ marginTop: '12px', color: '#F87171', fontSize: '.85rem' }}>Error al enviar. Intenta de nuevo.</p>
        )}
        <p style={{ fontSize: '.72rem', color: 'rgba(255,255,255,.25)', maxWidth: '540px', margin: '12px auto 0', lineHeight: '1.6' }}>
          Al enviar este formulario, usted acepta recibir llamadas y mensajes de texto de Connecting relacionados con nuestros servicios. Puede solicitar que lo retiremos de nuestra lista de contacto en cualquier momento. Aplican tarifas de mensajes y datos.
        </p>
        <p className="lead-note">No compartimos tus datos. Solo te contactamos una vez.</p>
      </section>

      {/* FOOTER */}
      <footer className="footer" id="contacto">
        <div className="footer-grid">
          <div className="footer-brand">
            <Image src="/images/Connecting_logo.webp" alt="Connecting" width={120} height={30} style={{ filter: 'brightness(10)', marginBottom: '1.2rem' }} />
            <p>Proveedor independiente de servicios móviles en las mejores redes 5G de Estados Unidos. Texas, EE.UU.</p>
          </div>
          <div className="footer-col">
            <h4>Servicios</h4>
            <Link href="#servicios">Planes Móviles</Link>
            <Link href="#familiar">Planes Familiares</Link>
            <Link href="#dispositivos">Dispositivos</Link>
            <Link href="#planes">Precios</Link>
          </div>
          <div className="footer-col">
            <h4>Empresa</h4>
            <Link href="#cobertura">Cobertura</Link>
            <Link href="#faq">Preguntas Frecuentes</Link>
            <Link href="/privacidad">Privacidad</Link>
            <Link href="/terminos">Términos</Link>
          </div>
          <div className="footer-col">
            <h4>Contacto</h4>
            <a href={`tel:${PHONE}`} onClick={onPhoneClick}>{PHONE_DISPLAY}</a>
            <a>Lun–Dom 8:00AM–9:00PM</a>
            <a>Texas, Estados Unidos</a>
          </div>
        </div>
        <a href={`tel:${PHONE}`} className="footer-call" onClick={onPhoneClick}>
          📞 &nbsp;Llamar ahora — {PHONE_DISPLAY}
        </a>
        <div className="footer-bottom">
          <span>© 2026 Connecting S.A. de C.V. · Proveedor independiente de servicios móviles.</span>
          <span>
            <Link href="/privacidad">Privacidad</Link> &nbsp;·&nbsp;
            <Link href="/terminos">Términos</Link> &nbsp;·&nbsp;
            <button
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.3)', fontSize: '.74rem', cursor: 'pointer', padding: 0 }}
              onClick={() => { rejectCookie(); setCookieVisible(true) }}
            >
              No vender mis datos (CCPA)
            </button>
          </span>
        </div>
      </footer>

      {/* COOKIE BANNER */}
      <div id="cookie-banner" className={cookieVisible ? 'visible' : ''} role="dialog" aria-label="Aviso de cookies">
        <p className="cookie-text">
          Usamos cookies propias y de terceros (incluido Google Ads) para mejorar tu experiencia y mostrarte publicidad relevante.{' '}
          <Link href="/privacidad">Política de Privacidad</Link>.
        </p>
        <div className="cookie-actions">
          <button className="cookie-reject" onClick={rejectCookie}>Rechazar</button>
          <button className="cookie-accept" onClick={acceptCookie}>Aceptar</button>
        </div>
      </div>
    </>
  )
}
