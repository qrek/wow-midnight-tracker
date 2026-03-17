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
    cache: 'no-store',
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
    $name: String!, $serverSlug: String!, $serverRegion: String!, $zoneID: Int!
  ) {
    characterData {
      character(name: $name, serverSlug: $serverSlug, serverRegion: $serverRegion) {
        id
        name
        classID
        zoneRankings(zoneID: $zoneID)
      }
    }
  }
`

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
