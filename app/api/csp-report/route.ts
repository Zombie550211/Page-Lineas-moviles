import { NextResponse } from 'next/server'

/* Colector de violaciones CSP. Solo registra; nunca devuelve contenido. */
export async function POST(req: Request) {
  try {
    const report = await req.json()
    const r = report?.['csp-report'] ?? report
    console.warn('[CSP]', JSON.stringify({
      directive: r?.['violated-directive'] ?? r?.effectiveDirective,
      blocked:   r?.['blocked-uri']        ?? r?.blockedURL,
      document:  r?.['document-uri']       ?? r?.documentURL,
    }))
  } catch {
    /* reporte malformado: se descarta en silencio */
  }
  return new NextResponse(null, { status: 204 })
}
