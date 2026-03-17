// Couche de données centralisée — Blizzard API + WCL, avec fallback mock

import {
  getGuildRoster,
  getCharacterProfile,
  getCharacterMythicKeystone,
  getCharacterRaids,
} from './blizzard'
import { wclQuery, CHARACTER_ZONE_RANKINGS_QUERY } from './wcl'
import { MOCK_GUILD } from './mock-data'
import { RAIDS, DUNGEONS } from './constants'

const TANK_SPECS   = ['Blood', 'Protection', 'Guardian', 'Brewmaster', 'Vengeance']
const HEALER_SPECS = ['Holy', 'Discipline', 'Restoration', 'Mistweaver', 'Preservation']

function getSpecRole(spec) {
  if (TANK_SPECS.includes(spec))   return 'TANK'
  if (HEALER_SPECS.includes(spec)) return 'HEALER'
  return 'DPS'
}

const useBlizzard = () =>
  !!process.env.BLIZZARD_CLIENT_ID &&
  process.env.BLIZZARD_CLIENT_ID !== 'your_blizzard_client_id'

const useWCL = () =>
  !!process.env.WCL_CLIENT_ID &&
  process.env.WCL_CLIENT_ID !== 'your_wcl_client_id'

function guildMeta() {
  return {
    name:        process.env.NEXT_PUBLIC_GUILD_NAME         || MOCK_GUILD.name,
    displayName: process.env.NEXT_PUBLIC_GUILD_DISPLAY_NAME || MOCK_GUILD.displayName,
    realm:       process.env.NEXT_PUBLIC_GUILD_REALM        || MOCK_GUILD.realm,
    region:      (process.env.NEXT_PUBLIC_GUILD_REGION      || MOCK_GUILD.region).toUpperCase(),
    faction:     MOCK_GUILD.faction,
  }
}

// ─── Guild Roster ─────────────────────────────────────────────────────────────

export async function fetchGuildData() {
  const meta = guildMeta()

  if (!useBlizzard()) return { ...MOCK_GUILD, ...meta }

  try {
    const roster = await getGuildRoster(meta.realm.toLowerCase(), meta.name)
    if (!roster?.members?.length) return { ...MOCK_GUILD, ...meta }

    const chars = roster.members
      .filter(m => m.character?.level >= 70)
      .slice(0, 50)

    const results = await Promise.allSettled(
      chars.map(async (m) => {
        const n = m.character.name.toLowerCase()
        const r = m.character.realm?.slug || meta.realm.toLowerCase()

        const [profileRes, mkRes] = await Promise.allSettled([
          getCharacterProfile(r, n),
          getCharacterMythicKeystone(r, n),
        ])

        const profile = profileRes.status === 'fulfilled' ? profileRes.value : null
        const mk      = mkRes.status      === 'fulfilled' ? mkRes.value      : null
        if (!profile) return null

        const spec    = profile.active_spec?.name || '?'
        const classID = profile.character_class?.id || m.character.playable_class?.id || 0

        return {
          id:           profile.id || m.character.id,
          name:         profile.name,
          classID,
          spec,
          role:         getSpecRole(spec),
          realm:        r,
          region:       meta.region.toLowerCase(),
          itemLevel:    profile.average_item_level || 0,
          mythicRating: Math.round(mk?.current_mythic_rating?.rating || 0),
          weeklyKey:    null,
          raidProgress: { 40: { killed: 0, total: 7 }, 41: { killed: 0, total: 5 }, 42: { killed: 0, total: 6 } },
          wcl:          { best: 0, median: 0, kills: 0 },
          bestKeys:     {},
          performance:  { dps: 0, hps: 0 },
        }
      })
    )

    const members = results
      .filter(r => r.status === 'fulfilled' && r.value?.classID > 0)
      .map(r => r.value)
      .sort((a, b) =>
        ({ TANK: 0, HEALER: 1, DPS: 2 }[a.role] ?? 2) -
        ({ TANK: 0, HEALER: 1, DPS: 2 }[b.role] ?? 2)
      )

    return { ...meta, members: members.length ? members : MOCK_GUILD.members }
  } catch (err) {
    console.error('[fetchGuildData]', err)
    return { ...MOCK_GUILD, ...meta }
  }
}

// ─── Player Detail ────────────────────────────────────────────────────────────

export async function fetchPlayerData(name) {
  const meta   = guildMeta()
  const realm  = meta.realm.toLowerCase()
  const region = meta.region.toLowerCase()

  if (!useBlizzard()) {
    return MOCK_GUILD.members.find(m => m.name.toLowerCase() === name.toLowerCase()) || null
  }

  try {
    const [profileRes, mkRes, raidsRes] = await Promise.allSettled([
      getCharacterProfile(realm, name.toLowerCase()),
      getCharacterMythicKeystone(realm, name.toLowerCase()),
      getCharacterRaids(realm, name.toLowerCase()),
    ])

    const profile = profileRes.status === 'fulfilled' ? profileRes.value : null
    if (!profile) return null

    const mk    = mkRes.status    === 'fulfilled' ? mkRes.value    : null
    const raids = raidsRes.status === 'fulfilled' ? raidsRes.value : null

    const spec    = profile.active_spec?.name || '?'
    const classID = profile.character_class?.id || 0

    // ── M+ best keys ──────────────────────────────────────────────────────────
    const bestKeys = {}
    const allRuns  = mk?.best_runs || mk?.current_period?.best_runs || []
    for (const run of allRuns) {
      const dungeonName = run.dungeon?.name || ''
      const dungeon = DUNGEONS.find(d =>
        d.name.toLowerCase() === dungeonName.toLowerCase() ||
        dungeonName.toLowerCase().includes(d.name.split("'")[0].toLowerCase())
      )
      if (dungeon) {
        const level = run.keystone_level || run.mythic_level || 0
        bestKeys[dungeon.id] = Math.max(bestKeys[dungeon.id] || 0, level)
      }
    }

    // ── Raid progress ─────────────────────────────────────────────────────────
    const raidProgress = {
      40: { killed: 0, total: 7 },
      41: { killed: 0, total: 5 },
      42: { killed: 0, total: 6 },
    }
    if (raids?.expansions) {
      for (const exp of raids.expansions) {
        for (const inst of (exp.instances || [])) {
          const raid = RAIDS.find(r =>
            r.name.toLowerCase() === inst.instance?.name?.toLowerCase()
          )
          if (raid) {
            const mythicMode = inst.modes?.find(m => m.difficulty?.type === 'MYTHIC')
            if (mythicMode?.progress) {
              raidProgress[raid.id] = {
                killed: mythicMode.progress.completed_count || 0,
                total:  mythicMode.progress.total_count     || raid.bosses.length,
              }
            }
          }
        }
      }
    }

    // ── WCL parses (optional) ─────────────────────────────────────────────────
    let wcl = { best: 0, median: 0, kills: 0 }
    if (useWCL()) {
      try {
        const wclResult = await wclQuery(CHARACTER_ZONE_RANKINGS_QUERY, {
          name:         profile.name,
          serverSlug:   realm,
          serverRegion: region,
          zoneID:       40,
        })
        const z = wclResult?.characterData?.character?.zoneRankings
        if (z) {
          wcl = {
            best:   Math.round(z.bestPerformanceAverage   || 0),
            median: Math.round(z.medianPerformanceAverage || 0),
            kills:  z.kills || 0,
          }
        }
      } catch { /* WCL optionnel */ }
    }

    return {
      id:           profile.id,
      name:         profile.name,
      classID,
      spec,
      role:         getSpecRole(spec),
      realm:        profile.realm?.slug || realm,
      region,
      itemLevel:    profile.average_item_level || 0,
      mythicRating: Math.round(mk?.current_mythic_rating?.rating || 0),
      weeklyKey:    null,
      raidProgress,
      wcl,
      bestKeys,
      performance: { dps: 0, hps: 0 },
    }
  } catch (err) {
    console.error('[fetchPlayerData]', err)
    // Fallback mock si le joueur est dans la guilde
    return MOCK_GUILD.members.find(m => m.name.toLowerCase() === name.toLowerCase()) || null
  }
}
