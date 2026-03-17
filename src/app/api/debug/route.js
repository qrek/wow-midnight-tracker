export const dynamic = 'force-dynamic'

import { getGuildRoster } from '@/lib/blizzard'

export async function GET() {
  const displayName = process.env.NEXT_PUBLIC_GUILD_DISPLAY_NAME ||
                      process.env.NEXT_PUBLIC_GUILD_NAME || '?'
  const realm  = process.env.NEXT_PUBLIC_GUILD_REALM   || '?'
  const region = process.env.BLIZZARD_REGION            || 'eu'

  // Recalcule le slug exactement comme blizzard.js le fait
  const slug = displayName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

  const url = `https://${region}.api.blizzard.com/data/wow/guild/${realm.toLowerCase()}/${slug}/roster`

  let rosterResult = null
  let rosterError  = null
  try {
    rosterResult = await getGuildRoster(realm, displayName)
    rosterResult = rosterResult
      ? `OK — ${rosterResult.members?.length} membres`
      : 'null (404)'
  } catch (e) {
    rosterError = e.message
  }

  return Response.json({
    config: {
      BLIZZARD_CLIENT_ID:             process.env.BLIZZARD_CLIENT_ID ? '✓ set' : '✗ missing',
      BLIZZARD_CLIENT_SECRET:         process.env.BLIZZARD_CLIENT_SECRET ? '✓ set' : '✗ missing',
      BLIZZARD_REGION:                region,
      NEXT_PUBLIC_GUILD_DISPLAY_NAME: displayName,
      NEXT_PUBLIC_GUILD_REALM:        realm,
    },
    computed: {
      guildSlug: slug,
      apiUrl:    url,
    },
    result: rosterResult,
    error:  rosterError,
  })
}
