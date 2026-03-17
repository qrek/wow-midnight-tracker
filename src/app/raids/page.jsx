'use client'
import { useState } from 'react'

const RAIDS = [
  {
    id: "voidspire",
    name: "The Voidspire",
    nameFr: "Le Voidspire",
    abbrev: "TVS",
    color: "#8b5cf6",
    bosses: 6,
    unlockDate: "17 mars 2026",
    unlockMythic: "24 mars 2026",
    description: "Le raid de progression principal de la Saison 1. Six boss aux mécaniques de corruption du Vide, positionnement forcé et manipulation du terrain. C'est ici que se jouera la progression des guildes.",
    lore: "Au coeur de l'empire de Minuit, le Voidspire est la tour depuis laquelle Xal'atath exerce sa domination sur Quel'Thalas corrompu.",
    guideUrl: "https://overgear.com/guides/wow/the-voidspire-raid/",
    wowheadUrl: "https://www.wowhead.com/guide/midnight/raids/the-voidspire-overview-location-rewards-boss",
    image: "https://overgear.com/guides/wp-content/uploads/2026/03/midnight-voidspire-raid.png",
    bossData: [
      {
        name: "Imperator Averzian",
        order: 1,
        role: "1er boss",
        image: "https://overgear.com/guides/wp-content/uploads/2026/03/midnight-imperator-averzian.jpg",
        difficulty: "Normale",
        mechanics: [
          { name: "Contrôle d'Arène", type: "tip", desc: "Le boss revendique progressivement des sections de l'arène — gérez l'espace disponible tout au long du combat." },
          { name: "Portails du Vide", type: "adds", desc: "Le boss crée des portails qui invoquent des Larmes Sombres avec des vagues d'ennemis de plus en plus puissantes — priorité aux portails." },
          { name: "Impact du Vide", type: "soak", desc: "Mécaniques d'impact nécessitant de se regrouper pour répartir les dégâts." },
          { name: "Vagues Escaladantes", type: "cooldown", desc: "Les vagues d'ennemis se renforcent avec le temps — utilisez vos cooldowns offensifs tôt pour éviter la saturation." },
        ],
      },
      {
        name: "Vorasius",
        order: 2,
        role: "2ème boss",
        image: "https://overgear.com/guides/wp-content/uploads/2026/03/midnight-vorasius.webp",
        difficulty: "Normale",
        mechanics: [
          { name: "Cristaux du Vide", type: "tip", desc: "Des Cristaux du Vide servent de barrières dans l'arène — positionnez-vous stratégiquement pour les utiliser." },
          { name: "Blistercreeps", type: "adds", desc: "Des adds explosent au contact des Cristaux pour les briser — laissez-les se déplacer vers les bons cristaux." },
          { name: "Souffle du Vide", type: "dodge", desc: "Balayage frontal en zone — esquivez la trajectoire." },
          { name: "Onde de Choc", type: "dodge", desc: "Modèles d'anneaux d'Aftershock rayonnant vers l'extérieur — identifiez les zones sûres et positionnez-vous en conséquence." },
        ],
      },
      {
        name: "Fallen-King Salhadaar",
        order: 3,
        role: "3ème boss",
        image: "https://overgear.com/guides/wp-content/uploads/2026/03/midnight-fallen-king-salhadaar.jpg",
        difficulty: "Modérée",
        mechanics: [
          { name: "Énergie Accumulée", type: "cooldown", desc: "Le boss accumule de l'énergie qui augmente sa dangerosité — gérez le rythme et utilisez des cooldowns défensifs aux seuils critiques." },
          { name: "Orbes du Vide Concentré", type: "dodge", desc: "Des orbes doivent être détruits avant d'atteindre le boss — assignez des joueurs pour les intercepter." },
          { name: "Démêlage Cosmique", type: "heal", desc: "Crée une pression de dégâts de raid en continu — les soigneurs doivent maintenir tout le monde en vie." },
          { name: "Débuffs de Tank", type: "tank", desc: "Débuffs en mêlée s'accumulant sur les tanks — rotation de tank nécessaire." },
        ],
      },
      {
        name: "Vaelgor & Ezzorak",
        order: 4,
        role: "4ème boss",
        image: "https://overgear.com/guides/wp-content/uploads/2026/03/midnight-vaelgor-ezzorak.webp",
        difficulty: "Élevée",
        mechanics: [
          { name: "Phases Alternées Air/Sol", type: "tip", desc: "Les deux dragons alternent entre phases aérienne et terrestre — adaptez votre positionnement à chaque transition." },
          { name: "Rayon Nul & Doom", type: "dodge", desc: "Nullbeam et Gloom créent des contraintes de mouvement sévères — planifiez vos déplacements à l'avance." },
          { name: "Mécanique de Lien", type: "spread", desc: "Des liens entre joueurs nécessitent un positionnement précis pour éviter de chaîner les dégâts." },
          { name: "Souffle Redouté", type: "dodge", desc: "Attaques de souffle des deux dragons — coordonnez les déplacements pour éviter les deux zones." },
          { name: "Invocations d'Adds", type: "adds", desc: "Des adds apparaissent pendant les transitions de phase — gérez-les rapidement pour ne pas saturer les soigneurs." },
        ],
      },
      {
        name: "Vanguard Aveuglé par la Lumière",
        order: 5,
        role: "5ème boss",
        image: "https://overgear.com/guides/wp-content/uploads/2026/03/midnight-lightblinded-vanguard.webp",
        difficulty: "Élevée",
        mechanics: [
          { name: "Combat en Conseil (3 cibles)", type: "tip", desc: "Trois ennemis simultanés (Lightblood, Bellamy, Senn) avec des menaces différentes — assignez des cibles et coordonnez les kills." },
          { name: "Synergie à Pleine Énergie", type: "cooldown", desc: "Attaques synchronisées quand un ennemi atteint 100% d'énergie — utilisez des cooldowns défensifs de groupe." },
          { name: "Bouclier Sacré", type: "interrupt", desc: "Bloque les interruptions — chronométrez vos interruptions hors de la fenêtre du bouclier." },
          { name: "Colère de Tyr", type: "heal", desc: "Buff qui augmente les dégâts et réduit les soins reçus — priorité à l'élimination de l'ennemi porteur." },
        ],
      },
      {
        name: "Couronne du Cosmos (Xal'atath)",
        order: 6,
        role: "Boss final",
        image: "https://overgear.com/guides/wp-content/uploads/2026/03/midnight-crown-of-the-cosmos.webp",
        difficulty: "Très élevée",
        mechanics: [
          { name: "Phase des Sentinelles Immortelles", type: "adds", desc: "Phase d'adds en début de combat — utilisez la Flèche d'Argent Frappante pour nettoyer les effets du Vide." },
          { name: "Flèche d'Argent Frappante", type: "tip", desc: "Capacité clé pour effacer les effets du Vide — coordonnez son utilisation avec les phases d'adds." },
          { name: "Aspect de la Fin", type: "heal", desc: "Réduit les soins reçus par le raid — les soigneurs doivent optimiser leur output." },
          { name: "Corona Nulle", type: "interrupt", desc: "Crée une absorption de soins dispelable — dispellez immédiatement." },
          { name: "Pression des Adds du Vide", type: "adds", desc: "Adds continus tout au long du combat — équilibrez DPS boss et gestion des adds." },
          { name: "Vulnérabilité de Tank", type: "tank", desc: "Débuffs de vulnérabilité en mêlée — rotation de tank obligatoire aux stacks élevés." },
        ],
      },
    ],
  },
  {
    id: "dreamrift",
    name: "The Dreamrift",
    nameFr: "Le Dreamrift",
    abbrev: "TDR",
    color: "#10b981",
    bosses: 1,
    unlockDate: "17 mars 2026",
    unlockMythic: "24 mars 2026",
    description: "Un raid d'un seul boss, conçu comme un checkpoint hebdomadaire. Ne vous y fiez pas — Chimaerus est mécaniquement dense et punit sévèrement les erreurs de priorité.",
    lore: "Le Dreamrift est une fissure entre le rêve et la réalité dans laquelle Chimaerus, le Dieu Non-Rêvé, cherche à fusionner les deux plans d'existence.",
    guideUrl: "https://overgear.com/guides/wow/the-dreamrift-guide/",
    wowheadUrl: "https://www.wowhead.com/guide/midnight/raids/the-dreamrift-overview-location-rewards-boss",
    image: "https://overgear.com/guides/wp-content/uploads/2026/03/midnight-voidspire-overview.png",
    bossData: [
      {
        name: "Chimaerus, le Dieu Non-Rêvé",
        order: 1,
        role: "Boss unique",
        image: "https://overgear.com/guides/wp-content/uploads/2026/03/midnight-voidspire-raid.png",
        difficulty: "Élevée",
        mechanics: [
          { name: "Manifestations (Rêve/Réalité)", type: "adds", desc: "Des Manifestations apparaissent hors de la réalité normale — elles ne peuvent être endommagées qu'en obtenant l'Alnsight. Si elles atteignent Chimaerus, elles le renforcent DÉFINITIVEMENT." },
          { name: "Liste de Priorité des Cibles", type: "tip", desc: "Composition nécessitant suffisamment d'interruptions et d'AoE burst. Les Essence Hantée lancent Fearsome Cry et Essence Bolt (interruptibles) — suivez strictement la priorité." },
          { name: "Dévéstation Corrompue", type: "cooldown", desc: "Quand Chimaerus atteint 100% d'énergie, il s'envole et inflige de lourds dégâts de raid — survivez tout en gérant les adds restants." },
          { name: "Plongée Vorace", type: "dodge", desc: "Fin de la phase aérienne — les Manifestations restantes sont instantanément absorbées. Assurez-vous que toutes sont mortes AVANT ce cast." },
          { name: "Renforcement Permanent", type: "tip", desc: "Chaque Manifestation absorbée renforce Chimaerus de façon permanente — zéro absorption tolérée sur les difficultés élevées." },
        ],
      },
    ],
  },
  {
    id: "queldanas",
    name: "March on Quel'Danas",
    nameFr: "Marche sur Quel'Danas",
    abbrev: "MQD",
    color: "#f59e0b",
    bosses: 2,
    unlockDate: "31 mars 2026",
    unlockMythic: "31 mars 2026",
    description: "Le raid de clôture de la Saison 1, déverrouillé 2 semaines après les autres. Deux boss compacts mais mécaniquement denses qui nécessitent une exécution précise plutôt que de l'endurance.",
    lore: "La Marche sur Quel'Danas représente l'affrontement final avec les forces de Minuit près du Puits du Soleil corrompu, menant à la révélation narrative ultime de la saison.",
    guideUrl: "https://www.wowhead.com/guide/midnight/raids/march-on-quel-danas-midnight-falls-boss-strategy-abilities",
    wowheadUrl: "https://www.wowhead.com/guide/midnight/raids/march-on-quel-danas-belo-ren-child-of-alar-boss-strategy-abilities",
    image: "https://overgear.com/guides/wp-content/uploads/2026/03/midnight-voidspire-loot.png",
    bossData: [
      {
        name: "Belo'ren, Enfant d'Al'ar",
        order: 1,
        role: "1er boss",
        image: "https://overgear.com/guides/wp-content/uploads/2026/03/midnight-imperator-averzian.jpg",
        difficulty: "Modérée",
        mechanics: [
          { name: "Phases Lumière / Vide", type: "tip", desc: "Le combat alterne entre phases dominées par la Lumière et le Vide — apprenez la mécanique d'alignement avant de le tenter." },
          { name: "Cônes Tank à Correspondance Couleur", type: "tank", desc: "Le tank avec la couleur correspondante DOIT absorber le cône de sa couleur. Rater une seule fois = buff de 30% dégâts pour Belo'ren (se stack)." },
          { name: "Cycle de Renaissance (Oeuf)", type: "tip", desc: "Après chaque mort, Belo'ren se transforme en oeuf géant pendant 30 sec — c'est sa barre de santé réelle. Attendez 2-3 cycles avant de tuer le boss." },
          { name: "Transitions de Phase", type: "cooldown", desc: "Chaque transition de phase inflige des dégâts de raid — utilisez des cooldowns défensifs de groupe." },
        ],
      },
      {
        name: "Chute de Minuit (L'ura)",
        order: 2,
        role: "Boss final",
        image: "https://overgear.com/guides/wp-content/uploads/2026/03/midnight-crown-of-the-cosmos.webp",
        difficulty: "Très élevée",
        mechanics: [
          { name: "Protection des Cristaux de l'Aube", type: "tip", desc: "Si un Cristal de l'Aube est détruit, L'ura déclenche Fin de Lumière : dégâts Sacrés massifs + debuff de 500% dégâts subis pendant 10 min. RAID WIPE GARANTI. Protégez les cristaux à tout prix." },
          { name: "Tentacules du Vide", type: "adds", desc: "Des adds apparaissent régulièrement et doivent être contrôlés — trop d'adds vivants simultanément saturent les soigneurs. Assignez des DPS dédiés." },
          { name: "Pression Croissante", type: "heal", desc: "Les zones sûres rétrécissent et les mécaniques se chevauchent de plus en plus — les soigneurs doivent maintenir un output constant sous pression." },
          { name: "Gestion de l'Espace", type: "dodge", desc: "La gestion de l'espace devient critique en fin de combat — les effets au sol s'accumulent, réduisant les zones de déplacement." },
          { name: "Dégâts de Raid Constants", type: "cooldown", desc: "Dégâts constants sur tout le raid pendant tout l'encounter — rotations de cooldowns défensifs essentielles." },
        ],
      },
    ],
  },
]

const MECHANIC_COLORS = {
  tank:      { bg: "bg-blue-900/40",   border: "border-blue-700/50",   text: "text-blue-300",   label: "TANK" },
  heal:      { bg: "bg-green-900/40",  border: "border-green-700/50",  text: "text-green-300",  label: "SOIN" },
  dodge:     { bg: "bg-red-900/40",    border: "border-red-700/50",    text: "text-red-300",    label: "ESQUIVE" },
  interrupt: { bg: "bg-yellow-900/40", border: "border-yellow-700/50", text: "text-yellow-300", label: "INTERRUPT" },
  spread:    { bg: "bg-orange-900/40", border: "border-orange-700/50", text: "text-orange-300", label: "ÉCART" },
  soak:      { bg: "bg-cyan-900/40",   border: "border-cyan-700/50",   text: "text-cyan-300",   label: "ABSORB" },
  adds:      { bg: "bg-pink-900/40",   border: "border-pink-700/50",   text: "text-pink-300",   label: "ADDS" },
  cooldown:  { bg: "bg-purple-900/40", border: "border-purple-700/50", text: "text-purple-300", label: "CD GROUPE" },
  tip:       { bg: "bg-void-800/60",   border: "border-void-600/50",   text: "text-void-300",   label: "CONSEIL" },
}

const DIFFICULTY_COLOR = {
  "Normale":      "text-green-400",
  "Modérée":      "text-blue-400",
  "Élevée":       "text-purple-400",
  "Très élevée":  "text-orange-400",
}

function BossCard({ boss }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-xl border border-void-700/60 bg-void-900/60 overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-4 p-4 hover:bg-void-800/40 transition-colors text-left"
      >
        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-void-800 border border-void-600 relative">
          <img
            src={boss.image}
            alt={boss.name}
            className="w-full h-full object-cover"
            onError={e => { e.target.style.display = "none" }}
          />
          <div className="absolute bottom-0 left-0 right-0 text-center text-xs font-bold text-void-200 bg-void-900/80 py-0.5">
            {boss.order}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-void-500 font-medium">{boss.role}</span>
            {boss.difficulty && (
              <span className={`text-xs font-medium ${DIFFICULTY_COLOR[boss.difficulty] || "text-void-400"}`}>
                · {boss.difficulty}
              </span>
            )}
          </div>
          <div className="font-semibold text-void-100 truncate">{boss.name}</div>
          <div className="text-xs text-void-400 mt-0.5">{boss.mechanics.length} mécaniques clés</div>
        </div>
        <svg
          className={`w-4 h-4 text-void-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-void-700/50 p-4 space-y-2">
          {boss.mechanics.map(m => {
            const style = MECHANIC_COLORS[m.type] || MECHANIC_COLORS.tip
            return (
              <div
                key={m.name}
                className={`flex gap-3 rounded-lg border p-3 ${style.bg} ${style.border}`}
              >
                <span className={`text-[10px] font-bold tracking-widest flex-shrink-0 mt-0.5 w-16 ${style.text}`}>
                  {style.label}
                </span>
                <div className="min-w-0">
                  <span className="text-void-100 font-medium text-sm">{m.name}</span>
                  <p className="text-void-300 text-xs mt-0.5 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function RaidsPage() {
  const [activeId, setActiveId] = useState(RAIDS[0].id)
  const raid = RAIDS.find(r => r.id === activeId)

  return (
    <div className="min-h-screen bg-void-950 text-void-100">
      {/* Header */}
      <div className="border-b border-void-800 bg-void-900/50 px-8 py-6">
        <h1 className="text-2xl font-bold text-void-50">Raids Saison 1</h1>
        <p className="text-void-400 text-sm mt-1">Midnight · 3 raids · 9 boss au total</p>
      </div>

      {/* Raid tab bar */}
      <div className="border-b border-void-800 bg-void-900/30 px-6">
        <div className="flex gap-1 py-3">
          {RAIDS.map(r => {
            const isActive = r.id === activeId
            return (
              <button
                key={r.id}
                onClick={() => setActiveId(r.id)}
                className={`flex items-center gap-3 px-5 py-2.5 rounded-lg text-sm font-medium transition-all border
                  ${isActive ? "" : "text-void-400 hover:text-void-200 hover:bg-void-800/50 border-transparent"}`}
                style={isActive ? {
                  backgroundColor: `${r.color}20`,
                  borderColor: `${r.color}50`,
                  color: r.color,
                } : {}}
              >
                <span
                  className="text-xs font-bold font-mono px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: `${r.color}25`, color: r.color }}
                >
                  {r.abbrev}
                </span>
                <span>{r.name}</span>
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full font-mono"
                  style={{ backgroundColor: `${r.color}20`, color: r.color }}
                >
                  {r.bosses}B
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {raid && (
        <div key={raid.id} className="max-w-5xl mx-auto px-6 py-8">

          {/* Raid hero banner */}
          <div
            className="rounded-2xl border overflow-hidden mb-8"
            style={{ borderColor: `${raid.color}30` }}
          >
            {/* Banner image */}
            <div
              className="h-40 relative"
              style={{ background: `linear-gradient(135deg, ${raid.color}25 0%, #030711 100%)` }}
            >
              <img
                src={raid.image}
                alt={raid.name}
                className="w-full h-full object-cover opacity-30"
                onError={e => { e.target.style.display = "none" }}
              />
              <div className="absolute inset-0 flex items-end p-6">
                <div>
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span
                      className="text-xs font-bold font-mono px-2 py-1 rounded"
                      style={{ backgroundColor: `${raid.color}30`, color: raid.color }}
                    >
                      {raid.abbrev}
                    </span>
                    <span className="text-xs text-void-300 bg-void-900/70 px-2 py-1 rounded">
                      {raid.bosses} boss
                    </span>
                    <span className="text-xs text-void-300 bg-void-900/70 px-2 py-1 rounded">
                      &#128197; {raid.unlockDate}
                    </span>
                    {raid.unlockMythic !== raid.unlockDate && (
                      <span className="text-xs bg-void-900/70 px-2 py-1 rounded" style={{ color: raid.color }}>
                        Mythique : {raid.unlockMythic}
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl font-bold drop-shadow-lg" style={{ color: raid.color }}>
                    {raid.name}
                  </h2>
                  <p className="text-void-300 text-sm italic">{raid.nameFr}</p>
                </div>
              </div>
            </div>

            {/* Info band */}
            <div className="p-6 bg-void-900/40">
              <p className="text-void-200 text-sm leading-relaxed mb-3">{raid.description}</p>
              <p className="text-void-400 text-xs italic leading-relaxed border-l-2 pl-3" style={{ borderColor: `${raid.color}50` }}>
                {raid.lore}
              </p>
              <div className="flex gap-3 mt-4 flex-wrap">
                <a
                  href={raid.guideUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-void-800 hover:bg-void-700 text-void-300 hover:text-void-100 transition-colors border border-void-700"
                >
                  <span>&#128218;</span>
                  <span>Guide complet</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <a
                  href={raid.wowheadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-void-800 hover:bg-void-700 text-void-300 hover:text-void-100 transition-colors border border-void-700"
                >
                  <span>&#128269;</span>
                  <span>Wowhead</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mb-6 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-void-500 mr-1">Légende :</span>
            {Object.entries(MECHANIC_COLORS).map(([key, style]) => (
              <span
                key={key}
                className={`text-[10px] font-bold tracking-widest px-2 py-1 rounded border ${style.bg} ${style.border} ${style.text}`}
              >
                {style.label}
              </span>
            ))}
          </div>

          {/* Boss cards */}
          <div className="space-y-3">
            {raid.bossData.map((boss, i) => (
              <BossCard key={i} boss={boss} />
            ))}
          </div>

          {/* Unlock note for MQD */}
          {raid.id === "queldanas" && (
            <div className="mt-6 p-4 rounded-xl border border-amber-700/40 bg-amber-900/20">
              <p className="text-amber-300 text-sm font-medium">
                &#9888;&#65039; Ce raid déverrouille le <strong>31 mars 2026</strong> sur toutes les difficultés simultanément.
              </p>
              <p className="text-amber-400/70 text-xs mt-1">
                Préparez vos cooldowns et votre comp pour les deux boss en une seule soirée de progression.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
