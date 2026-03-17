import {
  getCharacterProfile,
  getCharacterMythicKeystone,
  getCharacterRaids,
  getCharacterEquipment,
} from '@/lib/blizzard'
import { MOCK_GUILD } from '@/lib/mock-data'

const USE_MOCK =
  !process.env.BLIZZARD_CLIENT_ID ||
  process.env.BLIZZARD_CLIENT_ID === 'your_blizzard_client_id'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const name  = searchParams.get('name')
  const realm = searchParams.get('realm') || process.env.NEXT_PUBLIC_GUILD_REALM || 'kirin-tor'

  if (!name) return Response.json({ error: 'name required' }, { status: 400 })

  try {
    if (USE_MOCK) {
      const member = MOCK_GUILD.members.find(
        m => m.name.toLowerCase() === name.toLowerCase()
      )
      return Response.json({
        profile: { name, item_level: member?.itemLevel, realm: { name: realm } },
        mythicKeystone: { current_mythic_rating: { rating: member?.mythicRating } },
        raids: null,
        source: 'mock',
      })
    }

    // Fetch all in parallel
    const [profile, mythicKeystone, raids] = await Promise.allSettled([
      getCharacterProfile(realm, name),
      getCharacterMythicKeystone(realm, name),
      getCharacterRaids(realm, name),
    ])

    return Response.json({
      profile:        profile.status === 'fulfilled'        ? profile.value        : null,
      mythicKeystone: mythicKeystone.status === 'fulfilled' ? mythicKeystone.value : null,
      raids:          raids.status === 'fulfilled'          ? raids.value          : null,
      source: 'blizzard',
    })
  } catch (err) {
    console.error('[Blizzard/character]', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
