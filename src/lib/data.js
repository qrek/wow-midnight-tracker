// Couche de données centralisée — Blizzard API + WCL, avec fallback mock

import {
  getGuildRoster,
  getCharacterProfile,
  getCharacterMythicKeystone,
  getCharacterRaids,
  getCharacterEquipment,
} from './blizzard'
import {
  wclQuery,
  CHARACTER_ZONE_RANKINGS_QUERY,
  parseWclZoneRankings,
  aggregateWclParsesFromZones,
  getWclZoneRankingMetric,
  getWclParseKind,
} from './wcl'
import { MOCK_GUILD } from './mock-data'
import { RAIDS, DUNGEONS, getWclZoneIdsForParses } from './constants'

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

/**
 * Parses WCL : métrique `hps` (soigneur) ou `dps` (tank + DPS), une requête par zone, puis agrégation.
 */
async function fetchZoneWclParses(name, serverSlug, serverRegion, role) {
  const parseKind = getWclParseKind(role)
  const empty = () => ({
    best: 0,
    median: 0,
    kills: 0,
    parseKind,
    zoneIds: [],
    metric: null,
    difficulty: null,
    partition: null,
    size: null,
    bestPerformanceRaw: null,
    medianPerformanceRaw: null,
    allStars: [],
    encounters: [],
  })
  if (!useWCL()) return empty()
  const zoneIds = getWclZoneIdsForParses()
  if (!zoneIds.length) return empty()
  const metric = getWclZoneRankingMetric(role)
  if (process.env.DEBUG_WCL === '1') {
    console.warn('[fetchZoneWclParses]', { name, metric, zoneIds })
  }
  try {
    const parts = await Promise.all(
      zoneIds.map(async zoneID => {
        try {
          const wclResult = await wclQuery(CHARACTER_ZONE_RANKINGS_QUERY, {
            name,
            serverSlug,
            serverRegion: String(serverRegion).toLowerCase(),
            zoneID,
            metric,
          })
          const z = wclResult?.characterData?.character?.zoneRankings
          return parseWclZoneRankings(z, zoneID)
        } catch (err) {
          if (process.env.DEBUG_WCL === '1') {
            console.warn('[fetchZoneWclParses] zone failed', { name, zoneID, metric, message: err?.message })
          }
          return parseWclZoneRankings(null, zoneID)
        }
      })
    )
    return { ...aggregateWclParsesFromZones(parts), parseKind }
  } catch (e) {
    console.error('[fetchZoneWclParses]', name, e.message)
    return empty()
  }
}

/** Ajoute `wcl` à chaque membre (API WCL ou zéros si désactivé). Par paquets pour limiter la charge. */
async function enrichMembersWithWclParses(members, meta) {
  const reg = meta.region.toLowerCase()
  const chunkSize = 8
  const out = []
  for (let i = 0; i < members.length; i += chunkSize) {
    const slice = members.slice(i, i + chunkSize)
    const chunk = await Promise.all(
      slice.map(async m => ({
        ...m,
        wcl: await fetchZoneWclParses(m.name, m.realm, reg, m.role),
      }))
    )
    out.push(...chunk)
  }
  return out
}

function guildMeta() {
  // displayName (ex: "Le Chalet du Bonheur") est utilisé pour le slug Blizzard
  const displayName = process.env.NEXT_PUBLIC_GUILD_DISPLAY_NAME ||
                      process.env.NEXT_PUBLIC_GUILD_NAME         ||
                      MOCK_GUILD.displayName
  return {
    name:        displayName,
    displayName: displayName,
    realm:       process.env.NEXT_PUBLIC_GUILD_REALM   || MOCK_GUILD.realm,
    region:      (process.env.NEXT_PUBLIC_GUILD_REGION || MOCK_GUILD.region).toUpperCase(),
    faction:     MOCK_GUILD.faction,
  }
}

// ─── Guild Roster ─────────────────────────────────────────────────────────────

export async function fetchGuildData() {
  const meta = guildMeta()

  if (!useBlizzard()) return { ...MOCK_GUILD, ...meta }

  try {
    const roster = await getGuildRoster(meta.realm.toLowerCase(), meta.name)
    if (!roster?.members?.length) {
      console.error('[fetchGuildData] Roster vide ou null:', roster)
      return { ...MOCK_GUILD, ...meta }
    }

    const chars = roster.members
      .filter(m => m.character?.level >= 90)
      .slice(0, 50)

    const results = await Promise.allSettled(
      chars.map(async (m) => {
        const n = m.character.name.toLowerCase()
        const r = m.character.realm?.slug || meta.realm.toLowerCase()

        const [profileRes, mkRes, raidsRes] = await Promise.allSettled([
          getCharacterProfile(r, n),
          getCharacterMythicKeystone(r, n),
          getCharacterRaids(r, n),
        ])

        const profile = profileRes.status === 'fulfilled' ? profileRes.value : null
        const mk      = mkRes.status      === 'fulfilled' ? mkRes.value      : null
        const raids   = raidsRes.status   === 'fulfilled' ? raidsRes.value   : null
        if (!profile) return null

        const spec    = profile.active_spec?.name || '?'
        const classID = profile.character_class?.id || m.character.playable_class?.id || 0

        // ── Raid progress ──────────────────────────────────────────────────────
        const raidProgress = {
          40: { mythic: { killed: 0, total: 6 }, heroic: { killed: 0, total: 6 }, normal: { killed: 0, total: 6 } },
          41: { mythic: { killed: 0, total: 1 }, heroic: { killed: 0, total: 1 }, normal: { killed: 0, total: 1 } },
          42: { mythic: { killed: 0, total: 2 }, heroic: { killed: 0, total: 2 }, normal: { killed: 0, total: 2 } },
        }
        if (raids?.expansions) {
          for (const exp of raids.expansions) {
            for (const inst of (exp.instances || [])) {
              const raid = RAIDS.find(r2 =>
                r2.name.toLowerCase() === inst.instance?.name?.toLowerCase()
              )
              if (raid) {
                const mythicMode = inst.modes?.find(m2 => m2.difficulty?.type === 'MYTHIC')
                const heroicMode  = inst.modes?.find(m2 => m2.difficulty?.type === 'HEROIC')
                const normalMode  = inst.modes?.find(m2 => m2.difficulty?.type === 'NORMAL')
                if (mythicMode?.progress) {
                  raidProgress[raid.id].mythic = {
                    killed: mythicMode.progress.completed_count || 0,
                    total:  mythicMode.progress.total_count     || raid.bosses.length,
                  }
                }
                if (heroicMode?.progress) {
                  raidProgress[raid.id].heroic = {
                    killed: heroicMode.progress.completed_count || 0,
                    total:  heroicMode.progress.total_count     || raid.bosses.length,
                  }
                }
                if (normalMode?.progress) {
                  raidProgress[raid.id].normal = {
                    killed: normalMode.progress.completed_count || 0,
                    total:  normalMode.progress.total_count     || raid.bosses.length,
                  }
                }
              }
            }
          }
        }

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
          raidProgress,
          bestKeys:     {},
          performance:  { dps: 0, hps: 0 },
        }
      })
    )

    const sorted = results
      .filter(r => r.status === 'fulfilled' && r.value?.classID > 0)
      .map(r => r.value)
      .sort((a, b) =>
        ({ TANK: 0, HEALER: 1, DPS: 2 }[a.role] ?? 2) -
        ({ TANK: 0, HEALER: 1, DPS: 2 }[b.role] ?? 2)
      )

    const members = await enrichMembersWithWclParses(sorted, meta)

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
    const [profileRes, mkRes, raidsRes, equipRes] = await Promise.allSettled([
      getCharacterProfile(realm, name.toLowerCase()),
      getCharacterMythicKeystone(realm, name.toLowerCase()),
      getCharacterRaids(realm, name.toLowerCase()),
      getCharacterEquipment(realm, name.toLowerCase()),
    ])

    const profile = profileRes.status === 'fulfilled' ? profileRes.value : null
    if (!profile) return null

    const mk      = mkRes.status    === 'fulfilled' ? mkRes.value    : null
    const raids   = raidsRes.status === 'fulfilled' ? raidsRes.value : null
    const equip   = equipRes.status === 'fulfilled' ? equipRes.value : null

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
      40: { mythic: { killed: 0, total: 6 }, heroic: { killed: 0, total: 6 }, normal: { killed: 0, total: 6 } },
      41: { mythic: { killed: 0, total: 1 }, heroic: { killed: 0, total: 1 }, normal: { killed: 0, total: 1 } },
      42: { mythic: { killed: 0, total: 2 }, heroic: { killed: 0, total: 2 }, normal: { killed: 0, total: 2 } },
    }
    if (raids?.expansions) {
      for (const exp of raids.expansions) {
        for (const inst of (exp.instances || [])) {
          const raid = RAIDS.find(r =>
            r.name.toLowerCase() === inst.instance?.name?.toLowerCase()
          )
          if (raid) {
            const mythicMode = inst.modes?.find(m => m.difficulty?.type === 'MYTHIC')
            const heroicMode  = inst.modes?.find(m => m.difficulty?.type === 'HEROIC')
            const normalMode  = inst.modes?.find(m => m.difficulty?.type === 'NORMAL')
            if (mythicMode?.progress) {
              raidProgress[raid.id].mythic = {
                killed: mythicMode.progress.completed_count || 0,
                total:  mythicMode.progress.total_count     || raid.bosses.length,
              }
            }
            if (heroicMode?.progress) {
              raidProgress[raid.id].heroic = {
                killed: heroicMode.progress.completed_count || 0,
                total:  heroicMode.progress.total_count     || raid.bosses.length,
              }
            }
            if (normalMode?.progress) {
              raidProgress[raid.id].normal = {
                killed: normalMode.progress.completed_count || 0,
                total:  normalMode.progress.total_count     || raid.bosses.length,
              }
            }
          }
        }
      }
    }

    // ── WCL parses (optional) ─────────────────────────────────────────────────
    const wcl = await fetchZoneWclParses(
      profile.name,
      profile.realm?.slug || realm,
      region,
      getSpecRole(spec)
    )

    // ── Equipment ─────────────────────────────────────────────────────────────
    const equipment = (equip?.equipped_items || []).map(item => ({
      slot:    item.slot?.type || 'UNKNOWN',
      name:    item.name || item.item?.name || 'Unknown Item',
      ilvl:    item.level?.value || 0,
      quality: item.quality?.type || 'COMMON',
      enchant: item.enchantments?.[0]?.display_string?.replace(/<[^>]+>/g, '') || null,
      gem:     item.sockets?.find(s => s.item)?.item?.name || null,
      itemId:  item.item?.id || null,
    }))

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
      equipment,
      performance: { dps: 0, hps: 0 },
    }
  } catch (err) {
    console.error('[fetchPlayerData]', err)
    // Fallback mock si le joueur est dans la guilde
    return MOCK_GUILD.members.find(m => m.name.toLowerCase() === name.toLowerCase()) || null
  }
}
