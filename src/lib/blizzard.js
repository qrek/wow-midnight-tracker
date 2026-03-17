// Blizzard Battle.net API — Client (server-side only)

let _token = null
let _tokenExpiry = 0

const REGION = process.env.BLIZZARD_REGION || 'eu'
const BASE_URL = `https://${REGION}.api.blizzard.com`

async function getToken() {
  if (_token && Date.now() < _tokenExpiry) return _token

  const credentials = Buffer.from(
    `${process.env.BLIZZARD_CLIENT_ID}:${process.env.BLIZZARD_CLIENT_SECRET}`
  ).toString('base64')

  const res = await fetch('https://oauth.battle.net/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!res.ok) throw new Error(`Blizzard auth failed: ${res.status}`)
  const data = await res.json()
  _token = data.access_token
  _tokenExpiry = Date.now() + (data.expires_in - 60) * 1000
  return _token
}

async function bfetch(path, namespace, locale = 'en_GB') {
  const token = await getToken()
  const url = `${BASE_URL}${path}?namespace=${namespace}&locale=${locale}`
  const res = await fetch(url, {
    next: { revalidate: 300 },
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    console.error(`[Blizzard] ${res.status} — ${url}`)
    if (res.status === 404) return null
    throw new Error(`Blizzard ${res.status}: ${path}`)
  }
  return res.json()
}

// ─── Profile endpoints ────────────────────────────────────────────────────────

export async function getCharacterProfile(realm, name) {
  return bfetch(
    `/profile/wow/character/${realm.toLowerCase()}/${name.toLowerCase()}`,
    `profile-${REGION}`
  )
}

export async function getCharacterMythicKeystone(realm, name) {
  return bfetch(
    `/profile/wow/character/${realm.toLowerCase()}/${name.toLowerCase()}/mythic-keystone-profile`,
    `profile-${REGION}`
  )
}

export async function getCharacterRaids(realm, name) {
  return bfetch(
    `/profile/wow/character/${realm.toLowerCase()}/${name.toLowerCase()}/encounters/raids`,
    `profile-${REGION}`
  )
}

export async function getCharacterEquipment(realm, name) {
  return bfetch(
    `/profile/wow/character/${realm.toLowerCase()}/${name.toLowerCase()}/equipment`,
    `profile-${REGION}`
  )
}

export async function getGuildRoster(realm, guildName) {
  // Blizzard slug: lowercase, accents stripped, spaces → hyphens, special chars removed
  const slug = guildName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents (é→e, è→e, etc.)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
  console.log('[Blizzard] guild slug:', slug, 'realm:', realm.toLowerCase())
  return bfetch(
    `/data/wow/guild/${realm.toLowerCase()}/${slug}/roster`,
    `profile-${REGION}`
  )
}

// ─── Static data ─────────────────────────────────────────────────────────────

export async function getRealmIndex() {
  return bfetch('/data/wow/realm/index', `dynamic-${REGION}`)
}
