export const dynamic = 'force-dynamic'

import { fetchGuildData } from '@/lib/data'

export async function GET() {
  try {
    const data = await fetchGuildData()
    return Response.json({ data, source: 'ok' })
  } catch (err) {
    console.error('[api/wcl/guild]', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
