import { NextResponse } from 'next/server'

const CRM_WEBHOOK = 'https://agentes-49dr.onrender.com/api/webhook/lineas'

export async function POST(req: Request) {
  try {
    const apiKey = process.env.WEBHOOK_LINEAS_KEY
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: 'Relay not configured' }, { status: 503 })
    }

    const body = await req.json()

    const res = await fetch(CRM_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ ok: false, error: 'Relay error' }, { status: 500 })
  }
}
