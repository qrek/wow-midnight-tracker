export const dynamic = 'force-dynamic'

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
  const url = `https://${REGION}.api.blizzard.com${path}?namespace=${namespace}&access_token=${token}`
  const res = await fetch(url, { cache: 'no-store' })
  let body = null
  try { body = await res.json() } catch {}
  return { status: res.status, url, data: body }
}

export async function GET() {
  const displayName = process.env.NEXT_PUBLIC_GUILD_DISPLAY_NAME || '?'
  const realm  = process.env.NEXT_PUBLIC_GUILD_REALM || '?'

  const guildSlug = displayName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

  // 1. Token check
  let tokenStatus = 'unknown'
  let token = null
  try {
    token = await getToken()
    tokenStatus = token ? '✓ obtained' : '✗ empty'
  } catch (e) { tokenStatus = `✗ ${e.message}` }

  // 2. Realm index — confirms if Game Data API access works at all
  let realmIndex = null
  try {
    const r = await bfetchRaw('/data/wow/realm/index', `dynamic-${REGION}`)
    if (r.status === 200) {
      // Search for ysondre in the list
      const allRealms = r.data?.realms || []
      const found = allRealms.filter(x =>
        x.name?.toLowerCase().includes('ysondre') ||
        x.slug?.toLowerCase().includes('ysondre')
      )
      realmIndex = {
        status: 200,
        totalRealms: allRealms.length,
        ysondreMatches: found,
        // Also show first 5 French-sounding realms
        sampleFrench: allRealms
          .filter(x => ['kirin', 'croisade', 'eldre', 'ysondre', 'arak', 'chants'].some(k => x.slug?.includes(k)))
          .slice(0, 10)
      }
    } else {
      realmIndex = { status: r.status, error: r.data }
    }
  } catch (e) { realmIndex = { error: e.message } }

  // 3. Try guild with current realm slug
  let guildCheck = null
  try {
    const r = await bfetchRaw(`/data/wow/guild/${realm.toLowerCase()}/${guildSlug}`, `profile-${REGION}`)
    guildCheck = { status: r.status, data: r.data }
  } catch (e) { guildCheck = { error: e.message } }

  return Response.json({
    config: {
      BLIZZARD_CLIENT_ID:    process.env.BLIZZARD_CLIENT_ID ? '✓ set' : '✗ missing',
      BLIZZARD_CLIENT_SECRET: process.env.BLIZZARD_CLIENT_SECRET ? '✓ set' : '✗ missing',
      BLIZZARD_REGION: REGION,
      NEXT_PUBLIC_GUILD_DISPLAY_NAME: displayName,
      NEXT_PUBLIC_GUILD_REALM: realm,
    },
    tokenStatus,
    computed: { guildSlug },
    realmIndex,
    guildCheck,
  })
}
