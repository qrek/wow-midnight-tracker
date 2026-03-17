import { wclQuery, CHARACTER_ZONE_RANKINGS_QUERY } from '@/lib/wcl'
import { MOCK_GUILD } from '@/lib/mock-data'

const USE_MOCK =
  !process.env.WCL_CLIENT_ID ||
  process.env.WCL_CLIENT_ID === 'your_wcl_client_id'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const name   = searchParams.get('name')
  const realm  = searchParams.get('realm')  || process.env.NEXT_PUBLIC_GUILD_REALM  || 'kirin-tor'
  const region = searchParams.get('region') || process.env.NEXT_PUBLIC_GUILD_REGION || 'eu'
  const zoneID = parseInt(searchParams.get('zoneID') || '40')

  if (!name) return Response.json({ error: 'name required' }, { status: 400 })

  try {
    if (USE_MOCK) {
      const member = MOCK_GUILD.members.find(m => m.name.toLowerCase() === name.toLowerCase())
      return Response.json({ data: member || null, source: 'mock' })
    }

    const data = await wclQuery(CHARACTER_ZONE_RANKINGS_QUERY, {
      name, serverSlug: realm, serverRegion: region, zoneID,
    })

    return Response.json({ data: data.characterData.character, source: 'wcl' })
  } catch (err) {
    console.error('[WCL/character]', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
