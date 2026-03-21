// ─── WoW Class Data ────────────────────────────────────────────────────────
export const WOW_CLASSES = {
  1:  { name: 'Warrior',      color: '#C69B3A', icon: '⚔️' },
  2:  { name: 'Paladin',      color: '#F48CBA', icon: '🛡️' },
  3:  { name: 'Hunter',       color: '#AAD372', icon: '🏹' },
  4:  { name: 'Rogue',        color: '#FFF468', icon: '🗡️' },
  5:  { name: 'Priest',       color: '#FFFFFF', icon: '✨' },
  6:  { name: 'Death Knight', color: '#C41E3A', icon: '💀' },
  7:  { name: 'Shaman',       color: '#0070DD', icon: '⚡' },
  8:  { name: 'Mage',         color: '#3FC7EB', icon: '🔮' },
  9:  { name: 'Warlock',      color: '#8788EE', icon: '👁️' },
  10: { name: 'Monk',         color: '#00FF98', icon: '🥋' },
  11: { name: 'Druid',        color: '#FF7C0A', icon: '🌿' },
  12: { name: 'Demon Hunter', color: '#A330C9', icon: '😈' },
  13: { name: 'Evoker',       color: '#33937F', icon: '🐉' },
}

// ─── Parse Color (WoW standard) ────────────────────────────────────────────
export function getParseColor(parse) {
  if (parse >= 100) return '#e5cc80'  // Artifact (gold)
  if (parse >= 95)  return '#e268a8'  // Pink
  if (parse >= 90)  return '#ff8000'  // Orange
  if (parse >= 75)  return '#a335ee'  // Purple
  if (parse >= 50)  return '#0070dd'  // Blue
  if (parse >= 25)  return '#1eff00'  // Green
  return '#9d9d9d'                    // Gray
}

// ─── M+ Rating Color ────────────────────────────────────────────────────────
export function getRatingColor(rating) {
  if (rating >= 3500) return '#e5cc80'
  if (rating >= 3000) return '#ff8000'
  if (rating >= 2500) return '#a335ee'
  if (rating >= 2000) return '#0070dd'
  if (rating >= 1500) return '#1eff00'
  return '#9d9d9d'
}

// ─── WoW Midnight Season 1 — Raids ────────────────────────────────────────
// NOTE: `id` = clé interne Blizzard/UI. `wclZoneId` = ID zone Warcraft Logs (parses), un par raid.
// NOTE: Encounter IDs WCL à aligner quand Midnight est référencé sur WCL.
export const RAIDS = [
  {
    id: 40,
    wclZoneId: 46,
    name: 'The Voidspire',
    shortName: 'TVS',
    bosses: [
      { id: 9001, name: 'Imperator Averzian',    order: 1 },
      { id: 9002, name: 'Vorasius',              order: 2 },
      { id: 9003, name: 'Fallen-King Salhadaar', order: 3 },
      { id: 9004, name: 'Vaelgor & Ezzorak',     order: 4 },
      { id: 9005, name: 'Lightblinded Vanguard', order: 5 },
      { id: 9006, name: 'Crown of the Cosmos',   order: 6 },
    ],
  },
  {
    id: 41,
    wclZoneId: null,
    name: 'The Dreamrift',
    shortName: 'TDR',
    bosses: [
      { id: 9010, name: 'Chimaerus', order: 1 },
    ],
  },
  {
    id: 42,
    wclZoneId: null,
    name: "March on Quel'Danas",
    shortName: 'MQD',
    bosses: [
      { id: 9020, name: "Belo'ren, Child of Al'ar", order: 1 },
      { id: 9021, name: "Midnight Falls (L'ura)",   order: 2 },
    ],
  },
]

/**
 * IDs zones Warcraft Logs pour les parses : un `wclZoneId` par entrée de `RAIDS` (plusieurs raids possibles).
 * Si aucun `wclZoneId` n’est renseigné, repli optionnel sur `WCL_ZONE_ID` dans `.env.local` (un seul ID, pratique pour tester).
 */
export function getWclZoneIdsForParses() {
  const fromRaids = RAIDS.map(r => r.wclZoneId)
    .filter(id => id != null && Number(id) > 0)
    .map(Number)
  if (fromRaids.length) return [...new Set(fromRaids)]
  const envOne = parseInt(process.env.WCL_ZONE_ID || '', 10)
  if (!Number.isNaN(envOne) && envOne > 0) return [envOne]
  return []
}

// ─── WoW Midnight Season 1 — M+ Dungeons ──────────────────────────────────
export const DUNGEONS = [
  { id: 1, name: "Magister's Terrace",      short: 'MGT'  },
  { id: 2, name: 'Maisara Caverns',         short: 'MC'   },
  { id: 3, name: 'Nexus-Point Xenas',       short: 'NPX'  },
  { id: 4, name: 'Windrunner Spire',        short: 'WRS'  },
  { id: 5, name: "Al'gethar Academy",       short: 'AA'   },
  { id: 6, name: 'Pit of Saron',           short: 'PoS'  },
  { id: 7, name: 'Seat of the Triumvirate', short: 'SotT' },
  { id: 8, name: 'Skyreach',               short: 'SKY'  },
]

// ─── WCL Difficulty IDs ─────────────────────────────────────────────────────
export const DIFFICULTIES = {
  NORMAL:  3,
  HEROIC:  4,
  MYTHIC:  5,
}

// ─── WoW Class Specs by role ─────────────────────────────────────────────────
const TANK_SPECS   = ['Blood', 'Protection', 'Guardian', 'Brewmaster', 'Vengeance']
const HEALER_SPECS = ['Holy', 'Discipline', 'Restoration', 'Mistweaver', 'Preservation']

export function getSpecRole(spec) {
  if (TANK_SPECS.includes(spec))   return 'TANK'
  if (HEALER_SPECS.includes(spec)) return 'HEALER'
  return 'DPS'
}

export const ROLE_META = {
  TANK:   { label: 'Tank',     color: '#60a5fa', bg: 'rgba(96,165,250,0.15)',  icon: '🛡️' },
  HEALER: { label: 'Soigneur', color: '#4ade80', bg: 'rgba(74,222,128,0.15)',  icon: '✚'  },
  DPS:    { label: 'DPS',      color: '#f87171', bg: 'rgba(248,113,113,0.15)', icon: '⚔️' },
}

/** Libellé court du type de parse WCL (aligné sur `wcl.parseKind` : hps | dps). */
export const WCL_PARSE_KIND_LABEL = {
  hps: 'HPS',
  dps: 'DPS',
}

/** IDs difficulté WCL (zoneRankings.difficulty). */
export const WCL_DIFFICULTY_LABEL = {
  1: 'LFR',
  2: 'Facile',
  3: 'Normal',
  4: 'Héroïque',
  5: 'Mythique',
}

/** Affiche le throughput boss (DPS ou HPS selon parseKind). */
export function formatWclThroughput(amount, parseKind) {
  if (amount == null || Number.isNaN(Number(amount))) return '—'
  const n = Number(amount)
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}k`
  return Math.round(n).toLocaleString()
}
