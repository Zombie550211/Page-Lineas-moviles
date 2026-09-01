import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const CRM_WEBHOOK = 'https://agentes-49dr.onrender.com/api/webhook/lineas'
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? 'https://lineas-moviles.com'

const LeadSchema = z.object({
  nombre:   z.string().trim().min(2).max(80),
  telefono: z.string().trim().regex(/^\+?1?\s?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}$/, 'Teléfono inválido'),
  fuente:   z.literal('Chatbot AI'),
})

/* rate limit en memoria — se poda para no crecer sin límite */
const WINDOW = 15 * 60 * 1000
const MAX_HITS = 5
const hits = new Map<string, { count: number; reset: number }>()

function allowed(ip: string): boolean {
  const now = Date.now()
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (now > v.reset) hits.delete(k)
  }
  const entry = hits.get(ip)
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW })
    return true
  }
  if (entry.count >= MAX_HITS) return false
  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  /* solo desde el propio sitio: corta el uso del relay como proxy anónimo */
  const origin = req.headers.get('origin')
  if (origin && origin !== ALLOWED_ORIGIN) {
    return NextResponse.json({ ok: false, error: 'Origen no permitido' }, { status: 403 })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
  if (!allowed(ip)) {
    return NextResponse.json({ ok: false, error: 'Demasiadas solicitudes' }, { status: 429 })
  }

  const apiKey = process.env.WEBHOOK_LINEAS_KEY
  if (!apiKey) {
    console.error('[/api/chatbot-lead] WEBHOOK_LINEAS_KEY ausente — lead descartado')
    return NextResponse.json({ ok: false, error: 'Relay not configured' }, { status: 503 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Cuerpo inválido' }, { status: 400 })
  }

  const parsed = LeadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Datos inválidos' }, { status: 422 })
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    const res = await fetch(CRM_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      /* solo se reenvían los campos validados, nunca el body crudo */
      body: JSON.stringify(parsed.data),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) {
      console.error('[/api/chatbot-lead] CRM respondió', res.status)
      return NextResponse.json({ ok: false, error: 'CRM no disponible' }, { status: 502 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[/api/chatbot-lead]', err)
    return NextResponse.json({ ok: false, error: 'Relay error' }, { status: 500 })
  }
}
