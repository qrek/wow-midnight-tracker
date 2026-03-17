export const dynamic = 'force-dynamic'

import { getGuildRoster } from '@/lib/blizzard'

const REGION = process.env.BLIZZARD_REGION || 'eu'

async function getToken() {
  const credentials = Buffer.from(
    `${process.env.BLIZZARD_CLIENT_ID}:${process.env.BLIZZARD_CLIENT_SECRET}`
  ).toString('base64')
  const res = await fetch('https://oauth.battle.net/token', {
    method: 'POST',
    headers: { Authorization: `Basic ${credentials}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  })
  if (!res.ok) throw new Error(`Auth failed: ${res.status}`)
  const data = await res.json()
  return data.access_token
}

async function bfetchRaw(path, namespace) {
  const token = await getToken()
  const url = `https://${REGION}.api.blizzard.com${path}?namespace=${namespace}&locale=fr_FR&access_token=${token}`
  const res = await fetch(url, { cache: 'no-store' })
  return { status: res.status, url, data: res.ok ? await res.json() : null }
}

export async function GET() {
  const displayName = process.env.NEXT_PUBLIC_GUILD_DISPLAY_NAME ||
                      process.env.NEXT_PUBLIC_GUILD_NAME || '?'
  const realm  = process.env.NEXT_PUBLIC_GUILD_REALM || '?'

  const slug = displayName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

  // 1. Check realm info to find connected realm / correct slug
  let realmInfo = null
  let realmError = null
  try {
    const r = await bfetchRaw(`/data/wow/realm/${realm.toLowerCase()}`, `dynamic-${REGION}`)
    realmInfo = { status: r.status, slug: r.data?.slug, name: r.data?.name, connectedRealm: r.data?.connected_realm?.href }
  } catch (e) { realmError = e.message }

  // 2. Try guild base endpoint (no roster)
  let guildBase = null
  try {
    const r = await bfetchRaw(`/data/wow/guild/${realm.toLowerCase()}/${slug}`, `profile-${REGION}`)
    guildBase = { status: r.status, name: r.data?.name, realm: r.data?.realm?.slug }
  } catch (e) { guildBase = { error: e.message } }

  // 3. Try guild roster
  let rosterResult = null
  let rosterError  = null
  try {
    const r = await getGuildRoster(realm, displayName)
    rosterResult = r ? `OK — ${r.members?.length} membres` : 'null (404)'
  } catch (e) { rosterError = e.message }

  return Response.json({
    config: {
      BLIZZARD_CLIENT_ID:             process.env.BLIZZARD_CLIENT_ID ? '✓ set' : '✗ missing',
      BLIZZARD_CLIENT_SECRET:         process.env.BLIZZARD_CLIENT_SECRET ? '✓ set' : '✗ missing',
      BLIZZARD_REGION:                REGION,
      NEXT_PUBLIC_GUILD_DISPLAY_NAME: displayName,
      NEXT_PUBLIC_GUILD_REALM:        realm,
    },
    computed: {
      guildSlug: slug,
      rosterUrl: `https://${REGION}.api.blizzard.com/data/wow/guild/${realm.toLowerCase()}/${slug}/roster`,
    },
    realmCheck:  realmInfo  || { error: realmError },
    guildCheck:  guildBase,
    rosterCheck: { result: rosterResult, error: rosterError },
  })
}
