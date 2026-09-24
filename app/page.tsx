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

const PHONE = '+18884702820'
const PHONE_DISPLAY = '+1 (888) 470-2820'

const heroSlides = [
  { src: '/images/sim-entrando.webp',        alt: 'Tarjeta SIM activándose en un teléfono móvil' },
  { src: '/images/persona-en-la-calle.webp', alt: 'Hombre hablando por su línea móvil en la calle' },
  { src: '/images/telefonos-juntos.webp',    alt: 'Teléfonos de alta gama disponibles con tu línea' },
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
  const [scrollPct, setScrollPct]       = useState(0)
  const [statsVisible, setStatsVisible] = useState(false)
  const [cnt, setCnt]                   = useState([0, 0, 0])
  const planRefs                         = useRef<(HTMLDivElement | null)[]>([null, null, null])
  const canvasRef                        = useRef<HTMLCanvasElement>(null)

  /* canvas particles */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize)
    type P = { x:number; y:number; vx:number; vy:number; r:number; o:number }
    const pts: P[] = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - .5) * .45,
      vy: (Math.random() - .5) * .45,
      r: Math.random() * 1.4 + .4,
      o: Math.random() * .45 + .1,
    }))
    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y
          const d = Math.sqrt(dx*dx + dy*dy)
          if (d < 130) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(0,212,255,${.13*(1-d/130)})`
            ctx.lineWidth = .6
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.stroke()
          }
        }
      }
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,212,255,${p.o})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  /* scroll progress */
  useEffect(() => {
    const onScroll = () => {
      const d = document.documentElement
      setScrollPct((d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* stat counters */
  useEffect(() => {
    const el = document.querySelector('.stats-strip')
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStatsVisible(true); io.disconnect() }
    }, { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!statsVisible) return
    const targets = [10, 99, 55]
    const dur = 1600
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1)
      const ease = 1 - (1 - p) ** 3
      setCnt(targets.map(v => Math.round(v * ease)))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [statsVisible])

  /* plan card tilt */
  const onTiltMove = (e: React.MouseEvent, idx: number) => {
    const el = planRefs.current[idx]
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width - .5) * 14
    const y = ((e.clientY - r.top) / r.height - .5) * -14
    el.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${y}deg) scale(1.02)`
    el.style.transition = 'transform .1s ease'
  }
  const onTiltLeave = (idx: number) => {
    const el = planRefs.current[idx]
    if (!el) return
    el.style.transform = ''
    el.style.transition = 'transform .45s ease, background .3s'
  }

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
    window.gtag?.('event', 'phone_call_click', { phone_number: PHONE })
  }

  /* carousel nav */
  const goCarousel = (n: number) => {
    setCarouselIdx((n + carouselItems.length) % carouselItems.length)
    startCarouselTimer()
  }

  /* cookie — el banner se oculta por atributo en <html>, sin estado de React */
  const setConsent = (value: 'granted' | 'denied') => {
    localStorage.setItem('cookie_consent', value)
    window.gtag?.('consent', 'update', {
      ad_storage: value, analytics_storage: value, ad_user_data: value, ad_personalization: value,
    })
    document.documentElement.setAttribute('data-consent', 'set')
  }
  const acceptCookie = () => setConsent('granted')
  const rejectCookie = () => setConsent('denied')
  /* CCPA: aplica la exclusión y vuelve a mostrar el banner como confirmación */
  const optOutCcpa = () => {
    setConsent('denied')
    document.documentElement.setAttribute('data-consent', 'pending')
  }

  return (
    <>
      {/* SCROLL PROGRESS */}
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />

      {/* NAV */}
      <nav>
        <div className="nav-left">
          <Link href="#servicios" className="nav-link">Servicios</Link>
          <Link href="#familiar"  className="nav-link">Familias</Link>
          <Link href="#planes"    className="nav-link">Planes</Link>
          <Link href="#quienes-somos" className="nav-link">Nosotros</Link>
        </div>

        <div className="nav-right">
          <Link href="#faq" className="nav-link">Preguntas</Link>
          <a href={`tel:${PHONE}`} className="nav-cta" onClick={onPhoneClick}>Llamar</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="servicios">
        <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', zIndex:2, pointerEvents:'none' }} />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        <div className="hero-slides">
          {heroSlides.map((slide, i) => (
            <div key={i} className={`hero-slide${i === heroSlide ? ' active' : ''}`}>
              <Image src={slide.src} alt={slide.alt} fill style={{ objectFit: 'cover', objectPosition: 'center top' }} priority={i === 0} />
            </div>
          ))}
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-badge">Conectamos familias en todo Estados Unidos</span>
            <p className="hero-eyebrow">Redes 5G nacionales · Varios proveedores</p>
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
          {
            num: `+${cnt[0]}K`, label: 'Clientes Satisfechos',
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
          },
          {
            num: `${cnt[1]}%`, label: 'Cobertura Nacional',
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M10.54 16.1a6 6 0 0 1 2.92 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
          },
          {
            num: `$${cnt[2]}`, label: 'Desde / mes',
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
          },
          {
            num: '24/7', label: 'Soporte en Español',
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
          },
        ].map((s, i) => (
          <div key={i} className={`stat-item reveal${i > 0 ? ` reveal-delay-${i}` : ''}`}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* WHY SECTION */}
      <section className="why-section">
        <div className="why-header reveal">
          <span className="section-eyebrow">Por qué elegirnos</span>
          <h2 className="why-title">La diferencia que<br /><em>marca el servicio.</em></h2>
        </div>
        <div className="why-grid">
          {[
            {
              title: 'Sin contratos',
              desc: 'Cancela cuando quieras. Sin penalizaciones por terminación anticipada ni permanencia forzosa.',
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
            },
            {
              title: 'Soporte en español',
              desc: 'Atención 24/7 por agentes nativos que te entienden. Sin barreras de idioma.',
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>,
            },
            {
              title: 'Red 5G nacional',
              desc: 'Cobertura nacional sobre las principales redes 5G del país. El alcance exacto depende del proveedor y plan que elijas.',
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M10.54 16.1a6 6 0 0 1 2.92 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
            },
            {
              title: 'Activación express',
              desc: 'Tu línea activa en menos de 24 horas. Solo necesitas tu pasaporte. Así de simple.',
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
            },
          ].map((item, i) => (
            <div key={i} className={`why-card reveal${i > 0 ? ` reveal-delay-${i}` : ''}`}>
              <div className="why-icon">{item.icon}</div>
              <div className="why-card-title">{item.title}</div>
              <div className="why-card-desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

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
        <div className="split-content reveal">
          <span className="split-tag">Sin Límites</span>
          <h2>Datos<br /><em>ilimitados.</em></h2>
          <p>Sin data caps, sin sorpresas. Streaming en 4K, videollamadas y gaming todo el mes sin interrupciones ni cargos extra.</p>
          <div><a href={`tel:${PHONE}`} className="btn-outline-white" onClick={onPhoneClick}>Conocer Más</a></div>
        </div>
        <div className="split-image reveal reveal-delay-1">
          <Image src="/images/datos-ilimitados.webp" alt="Datos Ilimitados" fill style={{ objectFit: 'cover' }} />
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
          <p className="section-sub">Precio base del plan. Los impuestos y cargos regulatorios se facturan aparte y varían según tu estado y el proveedor.</p>
        </div>
        <div className="plans-grid">
          {[
            { badge: 'Plan 01',    name: 'Básico',   price: '55',  features: ['Datos ilimitados 5G', 'Llamadas y mensajes ilimitados', 'Soporte 24/7 en español'],           featured: false },
            { badge: 'Recomendado', name: 'Familiar', price: '150', features: ['Hasta 4 líneas incluidas', 'Datos ilimitados para todos', 'Descuentos por líneas adicionales'], featured: true  },
            { badge: 'Plan 03',    name: 'Premium',  price: '90',  features: ['Datos ilimitados 5G', 'Incluye dispositivo de alta gama', 'Soporte en español 24/7'],          featured: false },
          ].map((plan, i) => (
            <div
              key={i}
              ref={el => { planRefs.current[i] = el }}
              className={`plan-card reveal${plan.featured ? ' featured' : ''}${i > 0 ? ` reveal-delay-${i}` : ''}`}
              onMouseMove={e => onTiltMove(e, i)}
              onMouseLeave={() => onTiltLeave(i)}
            >
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
        <div className="split-content reveal reveal-delay-1">
          <span className="split-tag">Cobertura y Velocidad</span>
          <h2>Cobertura en<br /><em>todo el país.</em></h2>
          <p>Trabajamos con varios proveedores sobre las principales redes 5G de Estados Unidos. Verificamos contigo la cobertura real en tu zona antes de que contrates.</p>
          <div><a href={`tel:${PHONE}`} className="btn-dark" onClick={onPhoneClick}>Verificar Cobertura</a></div>
        </div>
      </section>

      {/* SPLIT 4: Velocidad */}
      <section className="split split-dark">
        <div className="split-content reveal">
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
      {/* QUIENES SOMOS: identidad del anunciante exigida por Google Ads */}
      <section className="about-section" id="quienes-somos">
        <div className="about-header reveal">
          <span className="section-eyebrow">Quiénes somos</span>
          <h2 className="section-title">Un agente,<br /><em>no una red.</em></h2>
        </div>
        <div className="about-body reveal reveal-delay-1">
          <p className="about-disclaimer">
            Connecting S.A. de C.V. es un agente independiente de servicios móviles. Ayudamos a
            consumidores en Estados Unidos a conocer opciones de telefonía móvil y conectarse con
            proveedores participantes. No somos una compañía de red móvil ni afirmamos ser
            representantes de ningún operador salvo cuando se indique expresamente.
          </p>
          <p>
            No trabajamos con un solo operador: comparamos planes de <strong>varios proveedores</strong> y
            te mostramos cuál se ajusta mejor a tu zona, tu presupuesto y tu consumo. El contrato final
            de servicio se establece entre tú y la compañía proveedora que elijas.
          </p>
          <p>
            Las marcas, nombres comerciales y logotipos de terceros que aparezcan en este sitio
            pertenecen a sus respectivos titulares. Los planes, precios y disponibilidad los determina
            cada proveedor y están sujetos a cambios sin previo aviso.
          </p>
          <div className="about-meta">
            <span><strong>Razón social:</strong> Connecting S.A. de C.V.</span>
            <span><strong>Operaciones:</strong> Texas, Estados Unidos</span>
            <span><strong>Contacto:</strong> {PHONE_DISPLAY}</span>
          </div>
        </div>
      </section>

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

      {/* CTA FINAL */}
      <section className="lead-section">
        <span className="lead-eyebrow">Contacto Directo</span>
        <h2>Hablemos<br /><em>ahora mismo.</em></h2>
        <p>Un asesor en español te atiende al instante. Sin esperas ni formularios.</p>
        <a href={`tel:${PHONE}`} className="lead-btn" onClick={onPhoneClick}>
          Llamar {PHONE_DISPLAY} →
        </a>
        <p className="lead-note">Atención en español. La llamada no tiene costo.</p>
      </section>

      {/* FOOTER */}
      <footer className="footer" id="contacto">
        <div className="footer-grid">
          <div className="footer-brand">
            <h4>Quiénes Somos</h4>
            <p>Agente independiente de servicios móviles. Comparamos planes de varios proveedores participantes en las mejores redes 5G de Estados Unidos.</p>
            <Link href="/#quienes-somos" className="footer-brand-link">Conocer más →</Link>
            <p className="footer-brand-loc">Texas, EE.UU.</p>
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
        <a href={`tel:${PHONE}`} className="footer-call" onClick={onPhoneClick} aria-label={`Llamar ahora al ${PHONE_DISPLAY}`}>
          📞 &nbsp;¡Llama ahora!
        </a>
        <div className="footer-bottom">
          <span>© 2026 Connecting S.A. de C.V. · Agente independiente de servicios móviles.</span>
          <span>
            <Link href="/privacidad">Privacidad</Link> &nbsp;·&nbsp;
            <Link href="/terminos">Términos</Link> &nbsp;·&nbsp;
            <button
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.3)', fontSize: '.74rem', cursor: 'pointer', padding: 0 }}
              onClick={optOutCcpa}
            >
              No vender mis datos (CCPA)
            </button>
          </span>
        </div>
      </footer>

      {/* COOKIE BANNER */}
      <div id="cookie-banner" role="dialog" aria-label="Aviso de cookies">
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
