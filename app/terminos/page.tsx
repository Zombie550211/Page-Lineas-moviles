import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Términos y Condiciones | Connecting',
  description: 'Términos y condiciones de servicio de lineas-moviles.com. Connecting es un agente independiente de servicios móviles.',
  alternates: { canonical: 'https://lineas-moviles.com/terminos' },
}

const sections: { title: string | null; body: string; highlight?: boolean; bullets?: string[]; after?: string; phone?: string }[] = [
  {
    title: null,
    highlight: true,
    body: "Entidad: Connecting\n\nSitio oficial: lineas-moviles.com",
  },
  {
    title: "1. Aceptación de los términos",
    body: "Al acceder, navegar o utilizar el sitio web lineas-moviles.com, así como al solicitar información o contratar servicios a través de nuestros asesores telefónicos o digitales, usted (\"el Cliente\" o \"el Usuario\") acepta cumplir y estar sujeto a los presentes Términos y Condiciones.\n\nSi no está de acuerdo con alguna parte de estas condiciones, deberá abstenerse de utilizar nuestros servicios y sitio web.",
  },
  {
    title: "2. Naturaleza del servicio: agente independiente",
    body: "Connecting opera como un agente independiente de servicios de telefonía móvil para el mercado hispano en los Estados Unidos. No somos una compañía de red móvil ni representantes oficiales de ningún operador.",
    bullets: ["Nuestra función: brindamos asesoría en idioma español, comparamos opciones de cobertura y facilitamos la gestión y contratación de servicios de telefonía móvil, planes y equipos con proveedores participantes.", "Relación con el proveedor: Connecting no es un proveedor directo de infraestructura o servicios de red móvil. El contrato final para la prestación del servicio, activación de líneas y provisión de equipos se establece directamente entre el Cliente y la compañía proveedora seleccionada."],
  },
  {
    title: "3. Procesamiento de la contratación y gestión de órdenes",
    body: "Para fines de transparencia con el usuario y las plataformas de verificación:",
    bullets: ["Recopilación y asesoría: Connecting recopila la información inicial, verifica la disponibilidad de cobertura y prepara la orden en idioma español.", "Procesamiento de la orden: una vez confirmada la elección por el usuario, la orden se transmite directamente al sistema del proveedor de telecomunicaciones seleccionado.", "Ejecución y facturación: el proveedor elegido es la única entidad responsable de aprobar la solicitud, activar la línea, enviar los equipos y emitir las facturas mensuales de cobro."],
  },
  {
    title: "4. Gratuidad del servicio de asesoría",
    body: "La asesoría, verificación de cobertura, comparación de tarifas y gestión de la solicitud realizada por Connecting a través de lineas-moviles.com es 100 % gratuita para el cliente.\n\nNo cobramos cargos adicionales, recargos ni comisiones al cliente por la atención de nuestros asesores. Connecting puede recibir una comisión por parte del proveedor cuando el cliente contrata a través de nosotros; esta comisión no modifica el precio del plan ni genera un costo adicional para el cliente.",
  },
  {
    title: "5. Precios, promociones y tarifas",
    body: "",
    bullets: ["Estimación de precios: los precios, promociones, características de los planes y equipos mostrados en lineas-moviles.com son estimativos y están sujetos a confirmación según la dirección exacta, disponibilidad y elegibilidad del cliente. Los precios se expresan en dólares estadounidenses (USD) y no incluyen impuestos ni cargos regulatorios, que varían según el estado y el proveedor.", "Cambios por parte del proveedor: los proveedores de telecomunicaciones se reservan el derecho de modificar sus tarifas oficiales, promociones, cargos de activación, costos de equipos y demás condiciones, conforme a sus propios contratos y políticas de notificación.", "Vigencia promocional: las tarifas preferenciales o con descuento pueden tener una duración determinada. Finalizado dicho periodo, la tarifa podrá ajustarse automáticamente al precio regular establecido por el proveedor. Antes de contratar le informamos la duración de la promoción y el precio posterior."],
  },
  {
    title: "6. Requisitos y proceso de contratación",
    body: "",
    bullets: ["Documentación: se requiere una identificación oficial vigente. Dependiendo de las políticas del proveedor, se podría aceptar pasaporte o identificación estatal de Estados Unidos.", "Verificación de crédito: según las políticas de la compañía proveedora seleccionada, la contratación podría requerir o no una verificación crediticia. En caso de no contar con historial en Estados Unidos, el proveedor final podría solicitar un depósito de garantía reembolsable o un pago por adelantado.", "Disponibilidad y entrega: la aprobación de la solicitud, disponibilidad de equipos, activación del servicio y tiempos de entrega dependen exclusivamente de las políticas, inventario y procesos de la compañía proveedora seleccionada."],
  },
  {
    title: "7. Deslinde de responsabilidad: soporte técnico y facturación",
    body: "",
    bullets: ["Facturación directa: las facturas son emitidas, enviadas y cobradas directamente por el proveedor de telecomunicaciones correspondiente, no por Connecting.", "Servicio técnico e interrupciones: Connecting no se hace responsable por interrupciones de señal, problemas de cobertura, fallas en los equipos, inconvenientes con la activación o dificultades relacionadas con el funcionamiento del servicio. La velocidad de datos puede variar según la ubicación, la cobertura y la congestión de la red del proveedor."],
    after: "Nuestro equipo puede brindar orientación general en español para ayudar al cliente a identificar el canal de atención correspondiente. Sin embargo, el soporte técnico, la administración de la cuenta, las cancelaciones, devoluciones, cambios y reembolsos deben gestionarse directamente con el proveedor seleccionado.",
  },
  {
    title: "8. Consentimiento para comunicaciones (TCPA)",
    body: "Cuando nos da su número de teléfono durante una llamada, usted acepta que le llamemos o le enviemos mensajes sobre la configuración de su servicio, ayuda técnica y ofertas especiales. Este consentimiento no es condición para contratar ningún servicio. Si cambia de opinión, puede pedirnos que no le llamemos más y lo añadiremos a nuestra lista interna de \"No llamar\".",
  },
  {
    title: "9. Privacidad de los datos",
    body: "La información que recogemos durante la llamada, como su nombre y número de teléfono, se guarda de forma segura y solo se comparte con el proveedor seleccionado en la medida necesaria para tramitar su servicio. Consulte nuestra Política de Privacidad para más detalles.",
  },
  {
    title: "10. Modificaciones de los términos",
    body: "Podemos actualizar estos Términos y Condiciones para reflejar cambios en nuestros servicios o en la normativa aplicable. La fecha de la última actualización se indica al inicio de este documento.",
  },
  {
    title: "11. Contacto",
    body: "Si tiene preguntas sobre estos Términos y Condiciones, llámenos al +1 (888) 470-2820 (lunes a domingo, 8:00 a.m. – 9:00 p.m., hora de Texas, CT).",
    phone: '+18884702820',
  },
]

export default function TerminosPage() {
  return (
    <>
      <nav style={{ background: 'rgba(255,255,255,.95)', borderBottom: '1px solid #E2E8F0', padding: '16px max(6%, calc((100% - 1280px) / 2))', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,.06)', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ color: '#1D4ED8', textDecoration: 'none', fontWeight: 700, fontSize: '.92rem' }}>
          ← Volver al inicio
        </Link>
        <Image src="/images/Connecting_logo.webp" alt="Connecting" width={80} height={32} />
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 2.5rem 80px' }}>
        <div style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: '#1D4ED8', marginBottom: '.6rem' }}>Legal</div>
        <h1 style={{ fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#0F172A', marginBottom: '.5rem', lineHeight: 1.1 }}>
          Términos y condiciones de servicio
        </h1>
        <p style={{ fontSize: '.83rem', color: '#94A3B8', marginBottom: '2.5rem' }}>Última actualización: septiembre de 2026</p>

        {sections.map((s, i) => (
          <div
            key={i}
            style={{
              background: s.highlight ? '#EFF6FF' : '#fff',
              border: `1px solid ${s.highlight ? '#BFDBFE' : '#E2E8F0'}`,
              borderRadius: 20,
              padding: '2rem 2.2rem',
              marginBottom: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,.06)',
            }}
          >
            {s.title && (
              <h2 style={{ fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)', fontSize: '1.35rem', fontWeight: 700, color: '#1D4ED8', marginBottom: '.8rem' }}>
                {s.title}
              </h2>
            )}
            {s.body.split('\n\n').filter(Boolean).map((para, j) => (
              <p key={j} style={{ fontSize: '.95rem', color: '#475569', lineHeight: 1.8, marginBottom: '.8rem' }}>
                {s.phone && para.includes('+1 (888) 470-2820') ? (
                  <>
                    {para.replace('+1 (888) 470-2820', '')}
                    <a href={`tel:${s.phone}`} style={{ color: '#1D4ED8', fontWeight: 700 }}>+1 (888) 470-2820</a>
                  </>
                ) : para}
              </p>
            ))}
            {s.bullets && (
              <ul style={{ paddingLeft: '1.4rem', margin: '.5rem 0' }}>
                {s.bullets.map((b, j) => (
                  <li key={j} style={{ fontSize: '.95rem', color: '#475569', lineHeight: 1.8, marginBottom: '.3rem' }}>{b}</li>
                ))}
              </ul>
            )}
            {s.after && <p style={{ fontSize: '.95rem', color: '#475569', lineHeight: 1.8, marginTop: '.8rem' }}>{s.after}</p>}
          </div>
        ))}
      </div>

      <footer style={{ background: '#0F172A', borderTop: '1px solid #1E293B', padding: '28px max(6%, calc((100% - 1280px) / 2))', textAlign: 'center', fontSize: '.82rem', color: '#475569' }}>
        <Image src="/images/Connecting_logo.webp" alt="Connecting" width={80} height={32} style={{ display: 'block', margin: '0 auto .8rem', filter: 'brightness(10)' }} />
        © 2026 Connecting. Todos los derechos reservados. &nbsp;·&nbsp;
        <Link href="/privacidad" style={{ color: '#60A5FA', textDecoration: 'none' }}>Política de Privacidad</Link>
      </footer>
    </>
  )
}
