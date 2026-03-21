// WarcraftLogs API v2 — Client GraphQL (server-side only)

let _token = null
let _tokenExpiry = 0

async function getToken() {
  if (_token && Date.now() < _tokenExpiry) return _token

  const credentials = Buffer.from(
    `${process.env.WCL_CLIENT_ID}:${process.env.WCL_CLIENT_SECRET}`
  ).toString('base64')

  const res = await fetch('https://www.warcraftlogs.com/oauth/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!res.ok) throw new Error(`WCL auth failed: ${res.status}`)
  const data = await res.json()
  _token = data.access_token
  _tokenExpiry = Date.now() + (data.expires_in - 60) * 1000
  return _token
}

export async function wclQuery(query, variables = {}) {
  const token = await getToken()

  const res = await fetch('https://www.warcraftlogs.com/api/v2/client', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300 }, // cache 5 min
  })

  if (!res.ok) throw new Error(`WCL query failed: ${res.status}`)
  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0].message)
  return json.data
}

// ─── Queries GraphQL ─────────────────────────────────────────────────────────

export const GUILD_ROSTER_QUERY = `
  query GuildRoster($name: String!, $serverSlug: String!, $serverRegion: String!) {
    guildData {
      guild(name: $name, serverSlug: $serverSlug, serverRegion: $serverRegion) {
        id
        name
        members {
          characters {
            id
            name
            classID
            server { name slug }
            zoneRankings
          }
        }
      }
    }
  }
`

export const CHARACTER_ZONE_RANKINGS_QUERY = `
  query CharacterZoneRankings(
    $name: String!, $serverSlug: String!, $serverRegion: String!, $zoneID: Int!,
    $metric: CharacterPageRankingMetricType!
  ) {
    characterData {
      character(name: $name, serverSlug: $serverSlug, serverRegion: $serverRegion) {
        id
        name
        classID
        zoneRankings(zoneID: $zoneID, metric: $metric)
      }
    }
  }
`

/** Métrique zone WCL : seulement `hps` ou `dps` (tanks = même parse dégâts que les DPS). */
export function getWclZoneRankingMetric(role) {
  const r = role === 'TANK' || role === 'HEALER' || role === 'DPS' ? role : 'DPS'
  return r === 'HEALER' ? 'hps' : 'dps'
}

/** Aligné sur la métrique WCL : `hps` | `dps` */
export function getWclParseKind(role) {
  return getWclZoneRankingMetric(role)
}

function roundPct(v) {
  if (v == null || Number.isNaN(Number(v))) return null
  return Math.round(Number(v) * 100) / 100
}

function mapAllStarRow(a) {
  if (!a || typeof a !== 'object') return null
  return {
    spec:             a.spec ?? null,
    points:           a.points != null ? Number(a.points) : null,
    possiblePoints:   a.possiblePoints != null ? Number(a.possiblePoints) : null,
    rank:             a.rank != null ? Number(a.rank) : null,
    regionRank:       a.regionRank != null ? Number(a.regionRank) : null,
    serverRank:       a.serverRank != null ? Number(a.serverRank) : null,
    rankPercent:      roundPct(a.rankPercent),
    total:            a.total != null ? Number(a.total) : null,
  }
}

function mapEncounterAllStars(as) {
  if (!as || typeof as !== 'object') return null
  return {
    points:           as.points != null ? Number(as.points) : null,
    possiblePoints:   as.possiblePoints != null ? Number(as.possiblePoints) : null,
    rank:             as.rank != null ? Number(as.rank) : null,
    regionRank:       as.regionRank != null ? Number(as.regionRank) : null,
    serverRank:       as.serverRank != null ? Number(as.serverRank) : null,
    rankPercent:      roundPct(as.rankPercent),
    total:            as.total != null ? Number(as.total) : null,
  }
}

/**
 * WCL renvoie souvent bestPerformanceAverage / medianPerformanceAverage à null alors que
 * rankings[] contient rankPercent, medianPercent, totalKills par encounter.
 * Inclut All Stars zone, méta (difficulté, taille raid…) et un rang par boss.
 */
export function parseWclZoneRankings(z, zoneIdHint) {
  const emptyDetail = () => ({
    best: 0,
    median: 0,
    kills: 0,
    zoneId:           zoneIdHint ?? null,
    metric:           null,
    difficulty:       null,
    partition:        null,
    size:             null,
    bestPerformanceRaw:  null,
    medianPerformanceRaw: null,
    allStars:         [],
    encounters:       [],
  })

  if (z == null || typeof z !== 'object') {
    return emptyDetail()
  }

  let best = z.bestPerformanceAverage
  let median = z.medianPerformanceAverage
  let kills = z.kills

  const rankings = Array.isArray(z.rankings) ? z.rankings : []

  const rankPercents = rankings
    .map(r => r?.rankPercent)
    .filter(v => v != null && !Number.isNaN(Number(v)))
    .map(Number)

  const medianPercents = rankings
    .map(r => r?.medianPercent)
    .filter(v => v != null && !Number.isNaN(Number(v)))
    .map(Number)

  if (best == null && rankPercents.length) {
    best = Math.max(...rankPercents)
  }

  if (median == null) {
    if (medianPercents.length) {
      median = medianOfSorted([...medianPercents].sort((a, b) => a - b))
    } else if (rankPercents.length) {
      median = medianOfSorted([...rankPercents].sort((a, b) => a - b))
    }
  }

  if (kills == null || kills === 0) {
    const sumKills = rankings.reduce((s, r) => s + (Number(r?.totalKills) || 0), 0)
    if (sumKills > 0) kills = sumKills
  }

  const allStarsRaw = Array.isArray(z.allStars) ? z.allStars : []
  const allStars = allStarsRaw.map(mapAllStarRow).filter(Boolean)

  const encounters = rankings.map(r => ({
    encounterId:   r?.encounter?.id ?? null,
    name:          r?.encounter?.name ?? '—',
    rankPercent:   roundPct(r?.rankPercent),
    medianPercent: roundPct(r?.medianPercent),
    totalKills:    Number(r?.totalKills) || 0,
    spec:          r?.spec ?? null,
    bestAmount:    r?.bestAmount != null ? Number(r.bestAmount) : null,
    lockedIn:      !!r?.lockedIn,
    allStars:      mapEncounterAllStars(r?.allStars),
  }))

  return {
    best:   Math.round(Number(best) || 0),
    median: Math.round(Number(median) || 0),
    kills:  Number(kills) || 0,
    zoneId:           z.zone != null ? Number(z.zone) : (zoneIdHint ?? null),
    metric:           z.metric ?? null,
    difficulty:       z.difficulty != null ? Number(z.difficulty) : null,
    partition:        z.partition != null ? Number(z.partition) : null,
    size:             z.size != null ? Number(z.size) : null,
    bestPerformanceRaw:  z.bestPerformanceAverage != null ? Number(z.bestPerformanceAverage) : null,
    medianPerformanceRaw: z.medianPerformanceAverage != null ? Number(z.medianPerformanceAverage) : null,
    allStars,
    encounters,
  }
}

function mergeEncountersByBoss(zoneParts) {
  const map = new Map()
  for (const p of zoneParts) {
    for (const e of p.encounters || []) {
      const id = e.encounterId
      if (id == null) continue
      const prev = map.get(id)
      const rp = e.rankPercent ?? 0
      const prp = prev?.rankPercent ?? 0
      if (!prev || rp > prp || (rp === prp && (e.totalKills || 0) > (prev.totalKills || 0))) {
        map.set(id, {
          ...e,
          zoneId: p.zoneId ?? e.zoneId,
        })
      }
    }
  }
  return [...map.values()].sort((a, b) => (a.encounterId || 0) - (b.encounterId || 0))
}

/** Agrège les parses de plusieurs zones WCL (plusieurs raids) pour le roster / fiche. */
export function aggregateWclParsesFromZones(parts) {
  const list = (parts || []).filter(Boolean)
  if (!list.length) {
    return {
      best: 0, median: 0, kills: 0,
      zoneIds: [], metric: null, difficulty: null, partition: null, size: null,
      bestPerformanceRaw: null, medianPerformanceRaw: null,
      allStars: [], encounters: [],
    }
  }
  const bests = list.map(p => p.best || 0)
  const medians = list.map(p => p.median || 0)
  const sumKills = list.reduce((s, p) => s + (p.kills || 0), 0)
  const best = bests.length ? Math.max(...bests) : 0
  const median = medians.length
    ? Math.round(medians.reduce((a, b) => a + b, 0) / medians.length)
    : 0

  const bestPart = list.reduce((a, b) => (b.best > (a?.best ?? 0) ? b : a), list[0])
  const zoneIds = [...new Set(list.map(p => p.zoneId).filter(id => id != null && !Number.isNaN(id)))]

  return {
    best,
    median,
    kills: sumKills,
    zoneIds,
    metric: bestPart.metric ?? null,
    difficulty: bestPart.difficulty ?? null,
    partition: bestPart.partition ?? null,
    size: bestPart.size ?? null,
    bestPerformanceRaw: bestPart.bestPerformanceRaw ?? null,
    medianPerformanceRaw: bestPart.medianPerformanceRaw ?? null,
    allStars: bestPart.allStars?.length ? bestPart.allStars : (list.find(p => p.allStars?.length)?.allStars ?? []),
    encounters: mergeEncountersByBoss(list),
  }
}

function medianOfSorted(sorted) {
  if (!sorted.length) return 0
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

export const CHARACTER_ENCOUNTER_RANKINGS_QUERY = `
  query CharacterEncounterRankings(
    $name: String!, $serverSlug: String!, $serverRegion: String!,
    $encounterID: Int!, $difficulty: Int
  ) {
    characterData {
      character(name: $name, serverSlug: $serverSlug, serverRegion: $serverRegion) {
        id
        name
        classID
        encounterRankings(encounterID: $encounterID, difficulty: $difficulty)
      }
    }
  }
`

export const WORLD_RANKINGS_QUERY = `
  query WorldRankings(
    $encounterID: Int!, $className: String, $specName: String, $difficulty: Int
  ) {
    worldData {
      encounter(id: $encounterID) {
        name
        characterRankings(
          className: $className, specName: $specName,
          difficulty: $difficulty, page: 1
        ) {
          rankings {
            name
            server { name region { name } }
            amount
            spec
            duration
            startTime
            rankPercent
            report { code startTime }
          }
        }
      }
    }
  }
`

export const PLAYER_SEARCH_QUERY = `
  query PlayerSearch(
    $name: String!, $serverSlug: String!, $serverRegion: String!,
    $encounterID: Int!, $difficulty: Int
  ) {
    characterData {
      character(name: $name, serverSlug: $serverSlug, serverRegion: $serverRegion) {
        id
        name
        classID
        encounterRankings(encounterID: $encounterID, difficulty: $difficulty)
      }
    }
  }
`
