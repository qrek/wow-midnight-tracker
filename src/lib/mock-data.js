// Données mock pour la guilde — remplacées automatiquement quand les vraies clés API sont ajoutées

const QUALITY_BY_ILVL = (ilvl) => ilvl >= 658 ? 'LEGENDARY' : ilvl >= 639 ? 'EPIC' : 'RARE'

const ENCHANTS = {
  NECK:       'Collier de Rapidité Stellaire',
  BACK:       'Enchantement : Esquive du Vide',
  CHEST:      'Enchantement : Endurance Primordiale',
  WRIST:      'Enchantement : Célérité Arcanîque',
  MAIN_HAND:  'Enchantement : Tranchant du Vide',
  FINGER_1:   'Enchantement : Vitesse Runique',
  FINGER_2:   'Enchantement : Vitesse Runique',
  LEGS:       'Renforts Arcanîques',
  FEET:       'Enchantement : Agilité du Vent',
}

const makeEquip = (base) => [
  { slot: 'HEAD',      name: 'Heaume de la Corruption du Vide',     ilvl: base,     quality: QUALITY_BY_ILVL(base),     enchant: null,              gem: null },
  { slot: 'NECK',      name: 'Pendentif des Étoiles Mourantes',     ilvl: base - 3, quality: QUALITY_BY_ILVL(base - 3), enchant: ENCHANTS.NECK,     gem: null },
  { slot: 'SHOULDER',  name: 'Épaulières du Pacte Brisé',           ilvl: base,     quality: QUALITY_BY_ILVL(base),     enchant: null,              gem: null },
  { slot: 'BACK',      name: 'Cape du Voyageur du Néant',           ilvl: base - 3, quality: QUALITY_BY_ILVL(base - 3), enchant: ENCHANTS.BACK,     gem: null },
  { slot: 'CHEST',     name: 'Plastron de la Couronne du Cosmos',   ilvl: base + 3, quality: QUALITY_BY_ILVL(base + 3), enchant: ENCHANTS.CHEST,    gem: 'Pierre du Vide Taillée' },
  { slot: 'WRIST',     name: 'Brassards du Marcheur des Ombres',    ilvl: base - 3, quality: QUALITY_BY_ILVL(base - 3), enchant: ENCHANTS.WRIST,    gem: null },
  { slot: 'HANDS',     name: 'Gantelets du Seigneur du Néant',      ilvl: base,     quality: QUALITY_BY_ILVL(base),     enchant: null,              gem: null },
  { slot: 'WAIST',     name: 'Ceinture de la Sentinelle Aveuglée',  ilvl: base - 3, quality: QUALITY_BY_ILVL(base - 3), enchant: null,              gem: null },
  { slot: 'LEGS',      name: 'Jambières du Roi Déchu',              ilvl: base,     quality: QUALITY_BY_ILVL(base),     enchant: ENCHANTS.LEGS,     gem: null },
  { slot: 'FEET',      name: 'Bottes du Traqueur du Vide',          ilvl: base - 3, quality: QUALITY_BY_ILVL(base - 3), enchant: ENCHANTS.FEET,     gem: null },
  { slot: 'FINGER_1',  name: 'Anneau de Xal\'atath',                ilvl: base,     quality: QUALITY_BY_ILVL(base),     enchant: ENCHANTS.FINGER_1, gem: null },
  { slot: 'FINGER_2',  name: 'Bague du Voidspire',                  ilvl: base - 3, quality: QUALITY_BY_ILVL(base - 3), enchant: ENCHANTS.FINGER_2, gem: null },
  { slot: 'TRINKET_1', name: 'Orbe du Cosmos Brisé',                ilvl: base,     quality: QUALITY_BY_ILVL(base),     enchant: null,              gem: null },
  { slot: 'TRINKET_2', name: 'Fragment de la Couronne de Minuit',   ilvl: base + 3, quality: QUALITY_BY_ILVL(base + 3), enchant: null,              gem: null },
  { slot: 'MAIN_HAND', name: 'Lame de la Chute de Minuit',          ilvl: base + 3, quality: QUALITY_BY_ILVL(base + 3), enchant: ENCHANTS.MAIN_HAND, gem: null },
  { slot: 'OFF_HAND',  name: 'Focalisateur du Vide Concentré',      ilvl: base,     quality: QUALITY_BY_ILVL(base),     enchant: null,              gem: null },
]

const rp = (m40, h40, n40, m41, h41, n41, m42, h42, n42) => ({
  40: { mythic: { killed: m40, total: 7 }, heroic: { killed: h40, total: 7 }, normal: { killed: n40, total: 7 } },
  41: { mythic: { killed: m41, total: 5 }, heroic: { killed: h41, total: 5 }, normal: { killed: n41, total: 5 } },
  42: { mythic: { killed: m42, total: 6 }, heroic: { killed: h42, total: 6 }, normal: { killed: n42, total: 6 } },
})

export const MOCK_GUILD = {
  name: 'Void Covenant',
  displayName: 'Void Covenant',
  realm: 'Kirin Tor',
  region: 'EU',
  faction: 'Alliance',
  members: [
    // ─── Tanks ───────────────────────────────────────────────────────────────
    {
      id: 1, name: 'Valdran',   classID: 6,  spec: 'Blood',        role: 'TANK',
      realm: 'kirin-tor', region: 'eu', itemLevel: 652, mythicRating: 2847,
      weeklyKey: { dungeon: "Magister's Terrace", level: 17, inTime: true },
      raidProgress: rp(5, 7, 7, 3, 5, 5, 0, 3, 2),
      wcl: { best: 81, median: 74, kills: 23 },
      bestKeys: { 1: 18, 2: 17, 3: 16, 4: 19, 5: 15, 6: 17, 7: 14, 8: 18 },
      performance: { dps: 0, hps: 0 },
    },
    {
      id: 2, name: 'Aesira',    classID: 1,  spec: 'Protection',   role: 'TANK',
      realm: 'kirin-tor', region: 'eu', itemLevel: 648, mythicRating: 2694,
      weeklyKey: { dungeon: 'Windrunner Spire', level: 16, inTime: true },
      raidProgress: rp(5, 7, 7, 3, 5, 5, 0, 2, 1),
      wcl: { best: 75, median: 68, kills: 21 },
      bestKeys: { 1: 17, 2: 15, 3: 16, 4: 18, 5: 14, 6: 16, 7: 15, 8: 17 },
      performance: { dps: 0, hps: 0 },
    },

    // ─── Healers ──────────────────────────────────────────────────────────────
    {
      id: 3, name: 'Lyrath',    classID: 5,  spec: 'Holy',         role: 'HEALER',
      realm: 'kirin-tor', region: 'eu', itemLevel: 649, mythicRating: 2756,
      weeklyKey: { dungeon: 'Pit of Saron', level: 16, inTime: false },
      raidProgress: rp(5, 7, 7, 3, 5, 5, 0, 3, 2),
      wcl: { best: 85, median: 79, kills: 24 },
      bestKeys: { 1: 16, 2: 16, 3: 15, 4: 17, 5: 15, 6: 18, 7: 15, 8: 16 },
      performance: { dps: 0, hps: 128450 },
    },
    {
      id: 4, name: 'Thornwick', classID: 11, spec: 'Restoration',  role: 'HEALER',
      realm: 'kirin-tor', region: 'eu', itemLevel: 646, mythicRating: 2623,
      weeklyKey: { dungeon: 'Skyreach', level: 15, inTime: true },
      raidProgress: rp(4, 7, 7, 2, 4, 4, 0, 1, 0),
      wcl: { best: 70, median: 63, kills: 18 },
      bestKeys: { 1: 15, 2: 14, 3: 15, 4: 16, 5: 14, 6: 15, 7: 14, 8: 16 },
      performance: { dps: 0, hps: 112300 },
    },
    {
      id: 5, name: 'Kaelindra', classID: 2,  spec: 'Holy',         role: 'HEALER',
      realm: 'kirin-tor', region: 'eu', itemLevel: 651, mythicRating: 2801,
      weeklyKey: { dungeon: "Al'gethar Academy", level: 17, inTime: true },
      raidProgress: rp(5, 7, 7, 3, 5, 5, 0, 3, 2),
      wcl: { best: 88, median: 82, kills: 25 },
      bestKeys: { 1: 17, 2: 16, 3: 17, 4: 17, 5: 17, 6: 16, 7: 16, 8: 17 },
      performance: { dps: 0, hps: 141200 },
    },

    // ─── DPS ──────────────────────────────────────────────────────────────────
    {
      id: 6, name: 'Nexaris',   classID: 12, spec: 'Havoc',        role: 'DPS',
      realm: 'kirin-tor', region: 'eu', itemLevel: 654, mythicRating: 3124,
      weeklyKey: { dungeon: "Magister's Terrace", level: 20, inTime: true },
      raidProgress: rp(6, 7, 7, 4, 5, 5, 1, 4, 3),
      wcl: { best: 94, median: 89, kills: 31 },
      bestKeys: { 1: 20, 2: 19, 3: 20, 4: 21, 5: 19, 6: 20, 7: 18, 8: 20 },
      performance: { dps: 487650, hps: 0 },
    },
    {
      id: 7, name: 'Solmyr',    classID: 8,  spec: 'Fire',         role: 'DPS',
      realm: 'kirin-tor', region: 'eu', itemLevel: 652, mythicRating: 2987,
      weeklyKey: { dungeon: 'Nexus-Point Xenas', level: 19, inTime: true },
      raidProgress: rp(6, 7, 7, 4, 5, 5, 1, 4, 3),
      wcl: { best: 91, median: 85, kills: 29 },
      bestKeys: { 1: 19, 2: 18, 3: 19, 4: 19, 5: 18, 6: 18, 7: 17, 8: 19 },
      performance: { dps: 462100, hps: 0 },
    },
    {
      id: 8, name: 'Vaelith',   classID: 3,  spec: 'Marksmanship', role: 'DPS',
      realm: 'kirin-tor', region: 'eu', itemLevel: 649, mythicRating: 2845,
      weeklyKey: { dungeon: 'Windrunner Spire', level: 18, inTime: true },
      raidProgress: rp(5, 7, 7, 3, 5, 5, 0, 3, 2),
      wcl: { best: 83, median: 76, kills: 26 },
      bestKeys: { 1: 18, 2: 17, 3: 18, 4: 18, 5: 16, 6: 17, 7: 16, 8: 18 },
      performance: { dps: 421300, hps: 0 },
    },
    {
      id: 9, name: 'Duskborne', classID: 4,  spec: 'Assassination', role: 'DPS',
      realm: 'kirin-tor', region: 'eu', itemLevel: 647, mythicRating: 2712,
      weeklyKey: { dungeon: 'Pit of Saron', level: 16, inTime: false },
      raidProgress: rp(5, 7, 7, 2, 4, 4, 0, 2, 1),
      wcl: { best: 72, median: 65, kills: 20 },
      bestKeys: { 1: 16, 2: 15, 3: 16, 4: 17, 5: 14, 6: 16, 7: 14, 8: 15 },
      performance: { dps: 398700, hps: 0 },
    },
    {
      id: 10, name: 'Eirador',  classID: 1,  spec: 'Arms',         role: 'DPS',
      realm: 'kirin-tor', region: 'eu', itemLevel: 650, mythicRating: 2778,
      weeklyKey: { dungeon: 'Seat of the Triumvirate', level: 17, inTime: true },
      raidProgress: rp(5, 7, 7, 3, 5, 5, 0, 3, 2),
      wcl: { best: 79, median: 73, kills: 24 },
      bestKeys: { 1: 17, 2: 16, 3: 17, 4: 17, 5: 15, 6: 16, 7: 17, 8: 17 },
      performance: { dps: 412800, hps: 0 },
    },
    {
      id: 11, name: 'Pyraxis',  classID: 9,  spec: 'Destruction',  role: 'DPS',
      realm: 'kirin-tor', region: 'eu', itemLevel: 648, mythicRating: 2734,
      weeklyKey: { dungeon: 'Skyreach', level: 17, inTime: true },
      raidProgress: rp(5, 7, 7, 2, 4, 4, 0, 2, 1),
      wcl: { best: 77, median: 70, kills: 22 },
      bestKeys: { 1: 17, 2: 16, 3: 17, 4: 16, 5: 15, 6: 16, 7: 15, 8: 17 },
      performance: { dps: 408500, hps: 0 },
    },
    {
      id: 12, name: 'Thelanis', classID: 7,  spec: 'Elemental',    role: 'DPS',
      realm: 'kirin-tor', region: 'eu', itemLevel: 646, mythicRating: 2689,
      weeklyKey: { dungeon: 'Maisara Caverns', level: 16, inTime: true },
      raidProgress: rp(4, 7, 7, 2, 4, 4, 0, 1, 0),
      wcl: { best: 68, median: 62, kills: 19 },
      bestKeys: { 1: 16, 2: 16, 3: 15, 4: 16, 5: 14, 6: 15, 7: 14, 8: 16 },
      performance: { dps: 389200, hps: 0 },
    },
    {
      id: 13, name: 'Miraveil', classID: 11, spec: 'Balance',      role: 'DPS',
      realm: 'kirin-tor', region: 'eu', itemLevel: 651, mythicRating: 2812,
      weeklyKey: { dungeon: "Al'gethar Academy", level: 18, inTime: true },
      raidProgress: rp(5, 7, 7, 3, 5, 5, 0, 3, 2),
      wcl: { best: 82, median: 76, kills: 25 },
      bestKeys: { 1: 18, 2: 17, 3: 18, 4: 18, 5: 17, 6: 17, 7: 16, 8: 18 },
      performance: { dps: 432100, hps: 0 },
    },
    {
      id: 14, name: 'Corveth',  classID: 6,  spec: 'Unholy',       role: 'DPS',
      realm: 'kirin-tor', region: 'eu', itemLevel: 648, mythicRating: 2745,
      weeklyKey: { dungeon: 'Nexus-Point Xenas', level: 17, inTime: true },
      raidProgress: rp(5, 7, 7, 2, 4, 4, 0, 2, 1),
      wcl: { best: 74, median: 67, kills: 21 },
      bestKeys: { 1: 17, 2: 16, 3: 17, 4: 17, 5: 15, 6: 16, 7: 15, 8: 17 },
      performance: { dps: 404300, hps: 0 },
    },
  ].map(m => ({ ...m, equipment: makeEquip(m.itemLevel) })),
}

// ─── Mock World Rankings ────────────────────────────────────────────────────
export function getMockWorldTop(specName = 'Fire') {
  return [
    { rank: 1, name: 'Dorki',    server: 'Tarren Mill',  region: 'EU', amount: 856420, rankPercent: 100,  spec: specName, reportCode: 'aXXX1234' },
    { rank: 2, name: 'Tettles',  server: 'Illidan',      region: 'US', amount: 842100, rankPercent: 98.3, spec: specName, reportCode: 'bXXX5678' },
    { rank: 3, name: 'Zaruel',   server: 'Tarren Mill',  region: 'EU', amount: 831500, rankPercent: 97.1, spec: specName, reportCode: 'cXXX9012' },
    { rank: 4, name: 'Naowh',    server: 'Tarren Mill',  region: 'EU', amount: 819200, rankPercent: 95.7, spec: specName, reportCode: 'dXXX3456' },
    { rank: 5, name: 'Preheat',  server: "Mal'Ganis",    region: 'US', amount: 807800, rankPercent: 94.3, spec: specName, reportCode: 'eXXX7890' },
  ]
}

// ─── Mock Guild Boss Logs ────────────────────────────────────────────────────
export function getMockGuildLogs(encounterName, specFilter = null) {
  const base = MOCK_GUILD.members
    .filter(m => m.role === 'DPS' || specFilter)
    .map(m => ({
      name: m.name,
      classID: m.classID,
      spec: m.spec,
      amount: m.performance.dps || m.performance.hps || Math.floor(Math.random() * 100000 + 350000),
      rankPercent: m.wcl.best,
      ilvl: m.itemLevel,
      deaths: Math.floor(Math.random() * 3),
      interrupts: Math.floor(Math.random() * 8),
      reportCode: 'guildXXXX',
    }))
  return base
}
