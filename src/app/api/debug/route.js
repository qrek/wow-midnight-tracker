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
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Auth failed: ${res.status} — ${body}`)
  }
  const data = await res.json()
  return data.access_token
}

async function bfetchRaw(path, namespace, token) {
  const url = `https://${REGION}.api.blizzard.com${path}?namespace=${namespace}&locale=en_GB`
  const res = await fetch(url, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` },
  })
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

  let token = null
  let tokenStatus = 'unknown'
  try {
    token = await getToken()
    tokenStatus = `✓ obtained (${token.slice(0, 8)}...)`
  } catch (e) { tokenStatus = `✗ ${e.message}` }

  if (!token) {
    return Response.json({ tokenStatus, error: 'Cannot proceed without token' })
  }

  // 1. Realm index
  const realmIndexRes = await bfetchRaw('/data/wow/realm/index', `dynamic-${REGION}`, token)
  let realmIndex
  if (realmIndexRes.status === 200) {
    const allRealms = realmIndexRes.data?.realms || []
    const found = allRealms.filter(x =>
      x.name?.toLowerCase().includes('ysondre') ||
      x.slug?.toLowerCase().includes('ysondre')
    )
    realmIndex = {
      status: 200,
      totalRealms: allRealms.length,
      ysondreMatches: found,
      sampleFrench: allRealms
        .filter(x => ['kirin', 'croisade', 'eldre', 'ysondre', 'arak', 'chants', 'la-croisade'].some(k => x.slug?.includes(k)))
        .slice(0, 10),
    }
  } else {
    realmIndex = { status: realmIndexRes.status, url: realmIndexRes.url, body: realmIndexRes.data }
  }

  // 2. Guild check with current realm slug
  const guildRes = await bfetchRaw(
    `/data/wow/guild/${realm.toLowerCase()}/${guildSlug}`,
    `profile-${REGION}`,
    token
  )
  const guildCheck = { status: guildRes.status, url: guildRes.url, data: guildRes.data }

  return Response.json({
    config: {
      BLIZZARD_CLIENT_ID:             process.env.BLIZZARD_CLIENT_ID ? '✓ set' : '✗ missing',
      BLIZZARD_CLIENT_SECRET:         process.env.BLIZZARD_CLIENT_SECRET ? '✓ set' : '✗ missing',
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
