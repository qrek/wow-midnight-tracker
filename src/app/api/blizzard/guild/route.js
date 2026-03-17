export const dynamic = 'force-dynamic'

import { getGuildRoster } from '@/lib/blizzard'
import { MOCK_GUILD } from '@/lib/mock-data'

const USE_MOCK =
  !process.env.BLIZZARD_CLIENT_ID ||
  process.env.BLIZZARD_CLIENT_ID === 'your_blizzard_client_id'

export async function GET() {
  try {
    if (USE_MOCK) {
      return Response.json({ data: MOCK_GUILD, source: 'mock' })
    }

    const data = await getGuildRoster(
      process.env.NEXT_PUBLIC_GUILD_REALM || 'kirin-tor',
      process.env.NEXT_PUBLIC_GUILD_NAME  || 'VoidCovenant'
    )

    return Response.json({ data, source: 'blizzard' })
  } catch (err) {
    console.error('[Blizzard/guild]', err)
    return Response.json({ data: MOCK_GUILD, source: 'mock', error: err.message })
  }
}
