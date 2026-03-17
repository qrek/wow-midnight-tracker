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

async function bfetchRaw(path, namespace, params = '') {
  const token = await getToken()
  const url = `https://${REGION}.api.blizzard.com${path}?namespace=${namespace}&locale=fr_FR${params}&access_token=${token}`
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

  // 1. Search realm by name to find correct slug
  let realmSearch = null
  try {
    const r = await bfetchRaw(
      `/data/wow/search/realm`,
      `dynamic-${REGION}`,
      `&name.fr_FR=Ysondre&_pageSize=5`
    )
    realmSearch = {
      status: r.status,
      results: r.data?.results?.map(x => ({
        slug: x.data?.slug,
        name_fr: x.data?.name?.fr_FR,
        name_en: x.data?.name?.en_GB,
        id: x.data?.id,
      }))
    }
  } catch (e) { realmSearch = { error: e.message } }

  // 2. Also try realm slug directly
  let realmDirect = null
  try {
    const r = await bfetchRaw(`/data/wow/realm/${realm.toLowerCase()}`, `dynamic-${REGION}`)
    realmDirect = { status: r.status, slug: r.data?.slug, name: r.data?.name }
  } catch (e) { realmDirect = { error: e.message } }

  // 3. If we found a realm slug from search, try guild with that slug
  let guildCheck = null
  const foundSlug = realmSearch?.results?.[0]?.slug
  if (foundSlug) {
    try {
      const r = await bfetchRaw(`/data/wow/guild/${foundSlug}/${slug}`, `profile-${REGION}`)
      guildCheck = { status: r.status, realmUsed: foundSlug, name: r.data?.name, realm: r.data?.realm?.slug }
      if (r.status === 200) {
        // Also try roster
        const r2 = await bfetchRaw(`/data/wow/guild/${foundSlug}/${slug}/roster`, `profile-${REGION}`)
        guildCheck.rosterStatus = r2.status
        guildCheck.memberCount = r2.data?.members?.length
      }
    } catch (e) { guildCheck = { error: e.message } }
  }

  return Response.json({
    config: {
      BLIZZARD_CLIENT_ID:             process.env.BLIZZARD_CLIENT_ID ? '✓ set' : '✗ missing',
      BLIZZARD_CLIENT_SECRET:         process.env.BLIZZARD_CLIENT_SECRET ? '✓ set' : '✗ missing',
      BLIZZARD_REGION:                REGION,
      NEXT_PUBLIC_GUILD_DISPLAY_NAME: displayName,
      NEXT_PUBLIC_GUILD_REALM:        realm,
    },
    computed: { guildSlug: slug },
    realmSearch,
    realmDirect,
    guildCheck,
  })
}
