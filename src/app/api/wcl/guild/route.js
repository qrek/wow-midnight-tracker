import { wclQuery, GUILD_ROSTER_QUERY } from '@/lib/wcl'
import { MOCK_GUILD } from '@/lib/mock-data'

const USE_MOCK =
  !process.env.WCL_CLIENT_ID ||
  process.env.WCL_CLIENT_ID === 'your_wcl_client_id'

export async function GET() {
  try {
    if (USE_MOCK) {
      return Response.json({ data: MOCK_GUILD, source: 'mock' })
    }

    const data = await wclQuery(GUILD_ROSTER_QUERY, {
      name:         process.env.NEXT_PUBLIC_GUILD_NAME   || 'VoidCovenant',
      serverSlug:   process.env.NEXT_PUBLIC_GUILD_REALM  || 'kirin-tor',
      serverRegion: process.env.NEXT_PUBLIC_GUILD_REGION || 'eu',
    })

    return Response.json({ data: data.guildData.guild, source: 'wcl' })
  } catch (err) {
    console.error('[WCL/guild]', err)
    return Response.json({ data: MOCK_GUILD, source: 'mock', error: err.message })
  }
}
