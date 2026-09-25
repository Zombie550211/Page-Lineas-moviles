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
const HORARIO = 'Lun–Dom 8 AM–9 PM (hora de Texas, CT)'

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
      { label: 'Lanzamiento', value: '2022 · Android 12 de fábrica' },
      { label: 'Red',        value: '5G, 4G LTE' },
      { label: 'Batería',    value: '3,700 mAh' },
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
      { label: 'OS',         value: 'iOS 26' },
      { label: 'Red',        value: '5G, 4G LTE' },
      { label: 'Procesador', value: 'Apple A19 Pro' },
      { label: 'Pantalla',   value: '6.3" Super Retina XDR, ProMotion 120Hz' },
      { label: 'Cámara',     value: 'Tres cámaras traseras de 48MP · 18MP frontal' },
      { label: 'Batería',    value: 'Todo el día · Carga MagSafe' },
    ],
  },
  {
    name: 'iPhone Air',
    img: '/images/carrusel/iPhoneAir.webp',
    specs: [
      { label: 'OS',      value: 'iOS 26' },
      { label: 'Red',     value: '5G, 4G LTE' },
      { label: 'Diseño',  value: 'Cuerpo de titanio de 5.6 mm' },
      { label: 'Pantalla',value: '6.5" Super Retina XDR' },
      { label: 'Cámara',  value: '48MP principal · 18MP frontal' },
      { label: 'Carga',   value: 'MagSafe + USB-C' },
    ],
  },
  {
    name: 'Samsung Galaxy Z Fold7',
    img: '/images/carrusel/samsung-galaxy-fold7-detail.webp',
    specs: [
      { label: 'OS',         value: 'Android 16 · One UI 8' },
      { label: 'Red',        value: '5G, 4G LTE' },
      { label: 'Pantalla',   value: '8" interior · 6.5" exterior' },
      { label: 'Procesador', value: 'Snapdragon 8 Elite' },
      { label: 'Cámara',     value: '200MP principal + 12MP ultra + 10MP zoom' },
      { label: 'Batería',    value: '4,400 mAh · Carga rápida 25W' },
    ],
  },
]

const faqs = [
  {
    q: '¿Tengo que firmar un contrato?',
    a: 'El plan de servicio es mes a mes y puedes cancelarlo cuando quieras. La excepción es el equipo: si lo compras financiado o con descuento, el proveedor puede cobrarte el saldo pendiente al cancelar o pedirte mantener la línea un tiempo para conservar el descuento. Te lo explicamos antes de que contrates.',
  },
  {
    q: '¿Qué necesito para contratar si soy extranjero?',
    a: 'Una identificación oficial vigente. Muchos proveedores aceptan pasaporte extranjero, pero los documentos exactos dependen del proveedor y del plan; te confirmamos cuáles necesitas antes de iniciar el trámite.',
  },
  {
    q: '¿Mi factura va a subir después de unos meses?',
    a: 'El precio base del plan no sube por promociones que vencen. Aparte del plan se facturan los impuestos y cargos regulatorios, que varían según tu estado y el proveedor. Te desglosamos el total estimado antes de que contrates.',
  },
  {
    q: '¿Qué quiere decir que los datos móviles sean "ilimitados"?',
    a: 'Que no pagas cargos extra por consumo. Ten en cuenta que los proveedores aplican priorización de red a partir de cierto consumo mensual, lo que puede reducir la velocidad en horas de congestión. El umbral en GB depende del proveedor y del plan; te lo confirmamos antes de que contrates.',
  },
  {
    q: '¿En qué condiciones viene el equipo?',
    a: 'Depende del proveedor y del plan. Según el caso el equipo puede entrar financiado a plazos, con un pago inicial o sujeto a permanencia mínima para conservar el descuento. No entregamos equipos por nuestra cuenta: las condiciones, la garantía y el financiamiento los fija el proveedor, y te las explicamos en detalle antes de que firmes.',
  },
  {
    q: '¿Con qué proveedores trabajan?',
    a: 'Somos un agente independiente y trabajamos con varios proveedores de servicios móviles en Estados Unidos. No pertenecemos a ninguno de ellos. Revisamos contigo cuál conviene más según tu zona, tu presupuesto y el uso que le des a la línea.',
  },
  {
    q: '¿Me piden verificación de crédito para aplicar?',
    a: 'Depende del plan. Los planes de servicio sin equipo normalmente no requieren verificación de crédito. Si financias un equipo, el proveedor sí puede revisar tu crédito, y la aprobación y las condiciones del financiamiento las decide él, no nosotros.',
  },
  {
    q: '¿Cuándo queda activa mi línea?',
    a: 'Con eSIM y un teléfono compatible, la activación suele completarse el mismo día. Si necesitas SIM física o un equipo nuevo, el envío tarda normalmente de 24 a 72 horas hábiles tras la aprobación y la línea se activa al recibirlo. El plazo final lo define el proveedor.',
  },
  {
    q: '¿Puedo cambiar mi plan más adelante?',
    a: 'Sí. Como el plan es mes a mes, puedes subir o bajar de plan según lo que necesites. Como trabajamos con varios proveedores, también podemos revisar contigo si otro se ajusta mejor.',
  },
]

const plans = [
  {
    badge: 'Plan 01', name: 'Básico', price: '55', featured: false,
    features: ['Datos 5G ilimitados', 'Llamadas y mensajes sin límite', `Soporte en español, ${HORARIO}`],
    cond: 'Precio por línea, sin impuestos. Sujeto a disponibilidad del proveedor en tu zona.',
  },
  {
    badge: 'Recomendado', name: 'Familiar', price: '150', featured: true,
    features: ['4 líneas incluidas ($37.50 c/u)', 'Datos ilimitados en cada línea', 'Menos de 4 líneas: precio por cotización'],
    cond: 'Precio total por 4 líneas, sin impuestos. Requiere activarlas con el mismo proveedor.',
  },
  {
    badge: 'Plan 03', name: 'Premium', price: '90', featured: false,
    features: ['Datos 5G ilimitados', 'Opción de equipo de alta gama', `Atención en español, ${HORARIO}`],
    cond: 'Precio por línea, sin impuestos. El equipo y sus condiciones los define el proveedor.',
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
  const [price, setPrice]               = useState(0)
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
    const dur = 1600
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1)
      const ease = 1 - (1 - p) ** 3
      setPrice(Math.round(55 * ease))
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
    /* Global Privacy Control = opt-out CCPA/CPRA: prevalece sobre la elección del banner */
    if ((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) value = 'denied'
    try { localStorage.setItem('cookie_consent', value) } catch {}
    window.gtag?.('consent', 'update', {
      ad_storage: value, analytics_storage: value, ad_user_data: value, ad_personalization: value,
    })
    document.documentElement.setAttribute('data-consent', 'set')
  }
  const acceptCookie = () => setConsent('granted')
  const rejectCookie = () => setConsent('denied')
  const openCookiePrefs = () => document.documentElement.setAttribute('data-consent', 'pending')

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
            <p className="hero-sub">Planes desde $55/mes + impuestos, mes a mes, sin contrato anual. Te atendemos en español y te ayudamos con la activación desde tu primera llamada.</p>
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
            num: 'Mes a mes', label: 'Sin Contrato Anual',
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
          },
          {
            num: 'USA', label: 'Cobertura Nacional',
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M10.54 16.1a6 6 0 0 1 2.92 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
          },
          {
            num: `$${price}`, label: 'Desde / mes + imp.',
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
          },
          {
            num: '8–21 h', label: 'Lun–Dom · En Español',
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
              title: 'Mes a mes',
              desc: 'El plan se cancela cuando quieras. Si financias un equipo, sus condiciones las fija el proveedor y te las explicamos antes.',
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
            },
            {
              title: 'Soporte en español',
              desc: `Asesores que hablan tu idioma, ${HORARIO}.`,
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>,
            },
            {
              title: 'Red 5G nacional',
              desc: 'Cobertura nacional sobre las principales redes 5G del país. El alcance exacto depende del proveedor y plan que elijas.',
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M10.54 16.1a6 6 0 0 1 2.92 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
            },
            {
              title: 'Activación ágil',
              desc: 'Con eSIM, normalmente el mismo día. Con SIM física o equipo, envío en 24 a 72 horas hábiles.',
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
          <h2>Paga menos<br /><em>por línea.</em></h2>
          <p>Con el plan Familiar, 4 líneas cuestan $150/mes + impuestos: $37.50 por línea, frente a $55 del plan Básico. Si necesitas menos líneas, te cotizamos el precio por teléfono.</p>
          <div><a href={`tel:${PHONE}`} className="btn-dark" onClick={onPhoneClick}>Hablar con un Asesor</a></div>
        </div>
      </section>

      {/* SPLIT 2: Datos ilimitados */}
      <section className="split split-dark">
        <div className="split-content reveal">
          <span className="split-tag">Datos Ilimitados</span>
          <h2>Datos<br /><em>ilimitados.</em></h2>
          <p>Sin cargos por exceso de consumo. A partir de cierto uso mensual el proveedor puede aplicar priorización de red y reducir la velocidad en momentos de congestión; te decimos el umbral de cada plan antes de contratar.</p>
          <div><a href={`tel:${PHONE}`} className="btn-outline-white" onClick={onPhoneClick}>Conocer Más</a></div>
        </div>
        <div className="split-image reveal reveal-delay-1">
          <Image src="/images/datos-ilimitados.webp" alt="Datos Ilimitados" fill style={{ objectFit: 'cover' }} />
        </div>
      </section>

      {/* CAROUSEL DISPOSITIVOS */}
      <section className="carousel-section" id="dispositivos">
        <div className="carousel-header reveal">
          <span className="section-eyebrow">Equipos con tu Plan</span>
          <h2 className="section-title">Equipos de<br /><em>Alta Gama.</em></h2>
          <p className="section-sub">Modelos que algunos proveedores participantes ofrecen junto con el plan. Disponibilidad, precio y financiamiento dependen del proveedor.</p>
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
        <p className="carousel-legal">
          Connecting no fabrica ni vende equipos por cuenta propia: los equipos los ofrece y financia cada proveedor.
          Apple, iPhone, Samsung y Galaxy son marcas registradas de sus respectivos titulares, que no patrocinan ni
          están afiliados a este sitio. Imágenes ilustrativas.
        </p>
      </section>

      {/* PLANES */}
      <section className="plans-section" id="planes">
        <div className="section-header reveal">
          <span className="section-eyebrow">Precios Claros</span>
          <h2 className="section-title">Escoge tu Plan.</h2>
          <p className="section-sub">Precio base del plan. Los impuestos y cargos regulatorios se facturan aparte y varían según tu estado y el proveedor.</p>
        </div>
        <div className="plans-grid">
          {plans.map((plan, i) => (
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
              <div className="plan-tax">+ impuestos y cargos regulatorios</div>
              <hr className="plan-divider" />
              <ul className="plan-features">
                {plan.features.map((f, j) => <li key={j}>{f}</li>)}
              </ul>
              <a href={`tel:${PHONE}`} className="plan-cta" onClick={onPhoneClick}>Hablar con un Asesor</a>
              <p className="plan-cond">{plan.cond}</p>
              <Link href="/terminos" className="plan-cond plan-cond-link">Ver condiciones completas</Link>
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
          <span className="split-tag">Redes 5G</span>
          <h2>Velocidad<br /><em>5G.</em></h2>
          <p>Acceso a redes 5G donde el proveedor tenga cobertura. La velocidad real varía según la zona, el equipo, el plan y la congestión de la red; te orientamos sobre qué esperar en tu dirección.</p>
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
          <ol className="about-steps">
            <li><strong>Llamas.</strong> Nos dices tu código postal, cuántas líneas necesitas y cuánto usas datos.</li>
            <li><strong>Comparamos.</strong> Revisamos la cobertura de cada proveedor en tu zona y te damos el precio total con impuestos estimados.</li>
            <li><strong>Eliges.</strong> Tramitamos la línea con el proveedor que escojas. Con eSIM la activación suele ser el mismo día; con SIM física o equipo, el envío tarda de 24 a 72 horas hábiles.</li>
          </ol>
          <p>
            Recibimos una comisión del proveedor cuando contratas a través de nosotros. No te
            cobramos por la asesoría ni altera el precio del plan.
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
        <p>Asesores en español de lunes a domingo, de 8 AM a 9 PM (hora de Texas, CT).</p>
        <a href={`tel:${PHONE}`} className="lead-btn" onClick={onPhoneClick}>
          Llamar {PHONE_DISPLAY} →
        </a>
        <p className="lead-note">Llamada sin costo (número 888). Fuera de horario te devolvemos la llamada el siguiente día hábil.</p>
      </section>

      {/* FOOTER */}
      <footer className="footer" id="contacto">
        <div className="footer-grid">
          <div className="footer-brand">
            <h4>Quiénes Somos</h4>
            <p>Agente independiente de servicios móviles. Comparamos planes de varios proveedores participantes en redes 5G de Estados Unidos.</p>
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
            <Link href="#quienes-somos">Quiénes Somos</Link>
            <Link href="#cobertura">Cobertura</Link>
            <Link href="#faq">Preguntas Frecuentes</Link>
            <Link href="/privacidad">Privacidad</Link>
            <Link href="/terminos">Términos</Link>
          </div>
          <div className="footer-col">
            <h4>Contacto</h4>
            <a href={`tel:${PHONE}`} onClick={onPhoneClick}>{PHONE_DISPLAY}</a>
            <a>{HORARIO}</a>
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
            <Link href="/privacidad#no-vender">No vender ni compartir mis datos</Link> &nbsp;·&nbsp;
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.3)', fontSize: '.74rem', cursor: 'pointer', padding: 0 }}
              onClick={openCookiePrefs}
            >
              Preferencias de cookies
            </button>
          </span>
        </div>
      </footer>

      {/* COOKIE BANNER */}
      <div id="cookie-banner" role="dialog" aria-label="Aviso de cookies">
        <p className="cookie-text">
          Usamos cookies propias y de terceros (incluido Google Ads) para medir el sitio y mostrarte publicidad relevante.
          Solo se activan si las aceptas.{' '}
          <Link href="/privacidad">Política de Privacidad</Link>.
        </p>
        <div className="cookie-actions">
          <button type="button" className="cookie-reject" onClick={rejectCookie}>Rechazar</button>
          <button type="button" className="cookie-accept" onClick={acceptCookie}>Aceptar</button>
        </div>
      </div>
    </>
  )
}
