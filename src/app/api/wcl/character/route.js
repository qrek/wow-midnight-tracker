import {
  wclQuery,
  CHARACTER_ZONE_RANKINGS_QUERY,
  getWclZoneRankingMetric,
  getWclParseKind,
} from '@/lib/wcl'
import { getWclZoneIdsForParses } from '@/lib/constants'
import { MOCK_GUILD } from '@/lib/mock-data'

const USE_MOCK =
  !process.env.WCL_CLIENT_ID ||
  process.env.WCL_CLIENT_ID === 'your_wcl_client_id'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const name   = searchParams.get('name')
  const realm  = searchParams.get('realm')  || process.env.NEXT_PUBLIC_GUILD_REALM  || 'kirin-tor'
  const region = searchParams.get('region') || process.env.NEXT_PUBLIC_GUILD_REGION || 'eu'
  const raw = searchParams.get('zoneID')
  const ids = getWclZoneIdsForParses()
  let zoneID = ids[0]
  if (raw != null && raw !== '') {
    const p = parseInt(raw, 10)
    if (!Number.isNaN(p)) zoneID = p
  }

  if (!name) return Response.json({ error: 'name required' }, { status: 400 })

  const roleParam = (searchParams.get('role') || 'DPS').toUpperCase()
  const role =
    roleParam === 'TANK' || roleParam === 'HEALER' || roleParam === 'DPS'
      ? roleParam
      : 'DPS'
  const metric = getWclZoneRankingMetric(role)
  const parseKind = getWclParseKind(role)

  if (zoneID == null || Number.isNaN(zoneID)) {
    return Response.json(
      { error: 'Aucun zoneID WCL : renseigne RAIDS[].wclZoneId dans constants.js ou ?zoneID=' },
      { status: 400 }
    )
  }

  try {
    if (USE_MOCK) {
      const member = MOCK_GUILD.members.find(m => m.name.toLowerCase() === name.toLowerCase())
      return Response.json({
        data: member || null,
        parseKind: member ? (member.wcl?.parseKind ?? getWclParseKind(member.role)) : null,
        source: 'mock',
      })
    }

    const data = await wclQuery(CHARACTER_ZONE_RANKINGS_QUERY, {
      name,
      serverSlug: realm,
      serverRegion: region,
      zoneID,
      metric,
    })

    return Response.json({
      data: data.characterData.character,
      parseKind,
      source: 'wcl',
    })
  } catch (err) {
    console.error('[WCL/character]', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
