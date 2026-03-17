import { wclQuery, WORLD_RANKINGS_QUERY, PLAYER_SEARCH_QUERY } from '@/lib/wcl'
import { getMockWorldTop, getMockGuildLogs } from '@/lib/mock-data'

const USE_MOCK =
  !process.env.WCL_CLIENT_ID ||
  process.env.WCL_CLIENT_ID === 'your_wcl_client_id'

export async function POST(request) {
  try {
    const body = await request.json()
    const { mode, encounterID, className, specName, difficulty = 5,
            playerName, playerRealm, playerRegion } = body

    if (USE_MOCK) {
      return Response.json({
        worldTop:  getMockWorldTop(specName || 'Fire'),
        guildLogs: getMockGuildLogs('Boss', specName),
        source: 'mock',
      })
    }

    // Fetch world top 10 by class/spec
    const worldData = await wclQuery(WORLD_RANKINGS_QUERY, {
      encounterID, className, specName, difficulty,
    })

    let referencePlayer = null

    // Optionally fetch a specific player's log
    if (playerName && playerRealm) {
      const playerData = await wclQuery(PLAYER_SEARCH_QUERY, {
        name: playerName,
        serverSlug: playerRealm,
        serverRegion: playerRegion || 'eu',
        encounterID,
        difficulty,
      })
      referencePlayer = playerData?.characterData?.character || null
    }

    const rankings = worldData?.worldData?.encounter?.characterRankings?.rankings || []

    return Response.json({
      worldTop: rankings.slice(0, 10).map((r, i) => ({
        rank: i + 1,
        name: r.name,
        server: r.server?.name,
        region: r.server?.region?.name,
        amount: r.amount,
        rankPercent: r.rankPercent,
        spec: r.spec,
        reportCode: r.report?.code,
        duration: r.duration,
      })),
      referencePlayer,
      source: 'wcl',
    })
  } catch (err) {
    console.error('[WCL/analysis]', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
