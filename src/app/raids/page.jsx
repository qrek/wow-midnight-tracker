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
    description: "Le raid de progression principal de la Saison 1 — 6 boss aux mécaniques de corruption du Vide, positionnement forcé et gestion de terrain. C'est ici que se jouera la progression des guildes.",
    lore: "Au coeur de l'empire de Minuit, le Voidspire est la tour depuis laquelle Xal'atath exerce sa domination sur Quel'Thalas corrompu.",
    guideUrl: "https://overgear.com/guides/wow/the-voidspire-raid/",
    wowheadUrl: "https://www.wowhead.com/guide/midnight/raids/the-voidspire-overview-location-rewards-boss",
    image: "https://overgear.com/guides/wp-content/uploads/2026/03/midnight-voidspire-raid.png",
    globalTips: [
      "Raid de progression principal — attendez-vous à des soirées de wipe sur les boss 4, 5 et 6.",
      "Le boss 4 (Vaelgor & Ezzorak) est le premier vrai DPS check de la saison.",
      "Le boss 5 (Vanguard) est un combat en conseil — assignez des cibles et synchronisez les kills.",
      "Conservez vos potions offensives pour le boss 6 (Xal'atath) — phase finale très exigeante.",
      "Rotation de tanks sur tous les boss — les debuffs de vulnérabilité s'accumulent rapidement.",
    ],
    bossData: [
      {
        name: "Imperator Averzian",
        order: 1,
        role: "1er boss",
        image: "https://overgear.com/guides/wp-content/uploads/2026/03/midnight-imperator-averzian.jpg",
        difficulty: "Normale",
        tip: "Gérez l'espace de l'arène dès le début — les sections revendiquées ne sont plus accessibles. Priorisez les portails avant qu'ils envoient trop de vagues.",
        mechanics: [
          { name: "Contrôle d'Arène", type: "tip", desc: "Le boss revendique progressivement des sections de l'arène entière. Gérez l'espace disponible et anticipez les déplacements de groupe.", interrupt: false, dispel: null },
          { name: "Portails du Vide", type: "adds", desc: "Portails qui invoquent des Larmes Sombres avec des vagues d'ennemis de plus en plus puissantes. Priorisez les portails avec du burst — chaque vague successive est plus dangereuse.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Impact du Vide", type: "soak", desc: "Mécaniques d'impact nécessitant de se regrouper pour répartir les dégâts. Coordonnez le regroupement à l'avance.", interrupt: false, dispel: null },
          { name: "Vagues Escaladantes", type: "cooldown", desc: "Les vagues d'ennemis se renforcent avec le temps. Utilisez vos cooldowns offensifs tôt pour éviter la saturation des soigneurs.", interrupt: false, dispel: null },
        ],
      },
      {
        name: "Vorasius",
        order: 2,
        role: "2ème boss",
        image: "https://overgear.com/guides/wp-content/uploads/2026/03/midnight-vorasius.webp",
        difficulty: "Normale",
        tip: "Positionnez stratégiquement les Cristaux du Vide — ils servent de barrières. Laissez les Blistercreeps se déplacer vers les bons cristaux avant qu'ils explosent.",
        mechanics: [
          { name: "Cristaux du Vide", type: "tip", desc: "Des Cristaux du Vide apparaissent et servent de barrières naturelles dans l'arène. Positionnez le groupe en tenant compte de leur emplacement.", interrupt: false, dispel: null },
          { name: "Blistercreeps", type: "adds", desc: "Des adds qui explosent au contact des Cristaux pour les briser. Laissez-les se diriger vers les cristaux stratégiquement — ne les tuez pas avant qu'ils atteignent le bon cristal.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Souffle du Vide", type: "dodge", desc: "Balayage frontal en zone. Le tank positionne le boss face au mur loin du raid.", interrupt: false, dispel: null },
          { name: "Onde de Choc (Aftershock)", type: "dodge", desc: "Anneaux d'Aftershock rayonnant vers l'extérieur. Identifiez les zones sûres entre les anneaux et positionnez-vous en conséquence.", interrupt: false, dispel: null },
        ],
      },
      {
        name: "Fallen-King Salhadaar",
        order: 3,
        role: "3ème boss",
        image: "https://overgear.com/guides/wp-content/uploads/2026/03/midnight-fallen-king-salhadaar.jpg",
        difficulty: "Modérée",
        tip: "Gérez le rythme d'énergie du boss. Assignez des joueurs dédiés aux Orbes du Vide Concentré. Rotations de tanks obligatoires aux stacks de debuff élevés.",
        mechanics: [
          { name: "Énergie Accumulée", type: "cooldown", desc: "L'énergie du boss augmente sa dangerosité globale. Gérez le rythme : utilisez des cooldowns défensifs aux seuils critiques d'énergie (30%, 60%, 100%).", interrupt: false, dispel: null },
          { name: "Orbes du Vide Concentré", type: "dodge", desc: "Des orbes se dirigent vers le boss et le renforcent s'ils le touchent. Assignez 2-3 joueurs dédiés pour les intercepter et les détruire.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Démêlage Cosmique", type: "heal", desc: "Pression de dégâts de raid constante. Les soigneurs ne doivent jamais être à court de ressources — gérez les cooldowns de soin sur toute la durée.", interrupt: false, dispel: null },
          { name: "Débuffs de Tank", type: "tank", desc: "Debuffs en mêlée s'accumulant sur les tanks. Rotation de tank obligatoire aux stacks définis (généralement 3-4 stacks).", interrupt: false, dispel: null },
        ],
      },
      {
        name: "Vaelgor & Ezzorak",
        order: 4,
        role: "4ème boss",
        image: "https://overgear.com/guides/wp-content/uploads/2026/03/midnight-vaelgor-ezzorak.webp",
        difficulty: "Élevée",
        tip: "Premier vrai DPS check — entraînez-vous aux transitions air/sol. Les liens entre joueurs nécessitent une conscience spatiale permanente. Coordonnez les déplacements AVANT les transitions.",
        mechanics: [
          { name: "Phases Alternées Air/Sol", type: "tip", desc: "Les deux dragons alternent entre phases aérienne et terrestre indépendamment. Apprenez les rotations de chaque dragon et adaptez votre positionnement à chaque transition.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Rayon Nul & Doom", type: "dodge", desc: "Nullbeam et Gloom créent des contraintes de mouvement sévères dans l'arène. Planifiez vos déplacements à l'avance — ces effets persistent.", interrupt: false, dispel: null },
          { name: "Mécanique de Lien", type: "spread", desc: "Des liens apparaissent entre certains joueurs. Le positionnement doit permettre de maintenir la distance requise sans gêner les autres mécaniques.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Souffle Redouté", type: "dodge", desc: "Attaques de souffle des deux dragons — potentiellement simultanées. Coordonnez les déplacements pour éviter les deux zones de souffle.", interrupt: false, dispel: null },
          { name: "Invocations d'Adds (Transitions)", type: "adds", desc: "Des adds apparaissent à chaque transition de phase. Tuez-les rapidement pour ne pas saturer les soigneurs pendant les nouvelles mécaniques.", interrupt: false, dispel: null },
          { name: "Effets de Support (Lightbound)", type: "tip", desc: "Les effets Lightbound renforcent temporairement certains membres du raid. Coordonnez leur utilisation avec les phases les plus exigeantes.", interrupt: false, dispel: null },
        ],
      },
      {
        name: "Vanguard Aveuglé par la Lumière",
        order: 5,
        role: "5ème boss",
        image: "https://overgear.com/guides/wp-content/uploads/2026/03/midnight-lightblinded-vanguard.webp",
        difficulty: "Élevée",
        tip: "Conseil à 3 cibles : Lightblood, Bellamy, Senn. Assignez des tanks et DPS par cible. Synchronisez les kills pour éviter les synergies à pleine énergie.",
        mechanics: [
          { name: "Combat en Conseil (3 cibles simultanées)", type: "tip", desc: "Lightblood, Bellamy et Senn doivent être gérés simultanément. Assignez 1 tank par cible, répartissez les DPS et coordonnez les kills pour éviter les synergies d'énergie.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Synergie à Pleine Énergie", type: "cooldown", desc: "Quand un ennemi atteint 100% d'énergie, tous les trois lancent une attaque synchronisée dévastatrice. Cooldowns défensifs de groupe obligatoires. Priorité à empêcher les cumulatifs.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Bouclier Sacré", type: "interrupt", desc: "Bloque toutes les interruptions pendant sa durée. Chronométrez vos kicks EN DEHORS de la fenêtre du bouclier — pas avant, pas pendant.", interrupt: true, dispel: null },
          { name: "Colère de Tyr", type: "heal", desc: "Buff augmentant les dégâts ET réduisant les soins reçus sur l'ennemi ciblé. Priorité absolue à l'élimination de l'ennemi porteur.", interrupt: false, dispel: null, priority: "HIGH" },
        ],
      },
      {
        name: "Couronne du Cosmos — Xal'atath",
        order: 6,
        role: "Boss final",
        image: "https://overgear.com/guides/wp-content/uploads/2026/03/midnight-crown-of-the-cosmos.webp",
        difficulty: "Très élevée",
        tip: "Boss final — préparez vos meilleures potions. Gardez la Flèche d'Argent pour nettoyer les adds en fin de phase. Dispellez Corona Nulle IMMÉDIATEMENT.",
        mechanics: [
          { name: "Phase des Sentinelles Immortelles", type: "adds", desc: "Phase d'adds en début de combat. Utilisez la Flèche d'Argent Frappante pour nettoyer les effets du Vide et progresser vers la phase de boss principale.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Flèche d'Argent Frappante", type: "tip", desc: "Capacité clé permettant d'effacer les effets du Vide et d'interagir avec les mécaniques de la phase. Coordonnez son utilisation avec le timing des phases d'adds.", interrupt: false, dispel: null },
          { name: "Aspect de la Fin", type: "heal", desc: "Réduit les soins reçus par tout le raid. Les soigneurs doivent augmenter leur output global et anticiper les fenêtres de dégâts élevés.", interrupt: false, dispel: null },
          { name: "Corona Nulle", type: "interrupt", desc: "Crée une absorption de soins dispelable sur des joueurs ciblés. Dispellez IMMÉDIATEMENT — laisser l'absorption se remplir peut tuer le joueur.", interrupt: false, dispel: "magie (absorption soins)", priority: "HIGH" },
          { name: "Pression des Adds du Vide", type: "adds", desc: "Adds continus tout au long du combat. Maintenez un équilibre entre DPS boss et gestion des adds — ne laissez jamais les adds s'accumuler.", interrupt: false, dispel: null },
          { name: "Vulnérabilité de Tank (Mêlée)", type: "tank", desc: "Debuffs de vulnérabilité s'accumulant sur les tanks en mêlée. Rotation de tank obligatoire aux stacks élevés.", interrupt: false, dispel: null },
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
    description: "Un raid d'un seul boss, conçu comme un checkpoint hebdomadaire. Chimaerus est mécaniquement dense et punit sévèrement les erreurs de priorité sur les Manifestations.",
    lore: "Le Dreamrift est une fissure entre le rêve et la réalité. Chimaerus, le Dieu Non-Rêvé, cherche à fusionner les deux plans d'existence pour régner sur un monde unifié sous sa corruption.",
    guideUrl: "https://overgear.com/guides/wow/the-dreamrift-guide/",
    wowheadUrl: "https://www.wowhead.com/guide/midnight/raids/the-dreamrift-overview-location-rewards-boss",
    image: "https://overgear.com/guides/wp-content/uploads/2026/03/midnight-voidspire-overview.png",
    globalTips: [
      "Raid court — idéal pour la progression des guildes en herbe sur une deuxième soirée.",
      "Composition : suffisamment d'interruptions ET de burst AoE pour les Manifestations.",
      "RÈGLE ABSOLUE : zéro Manifestation absorbée par le boss sur Mythique.",
      "Les 6 interruptions de Malignant Souls (pont) cumulent un buff de groupe massif.",
      "Chimaerus monte en difficulté graduellement — chaque renforcement permanent est irréversible.",
    ],
    bossData: [
      {
        name: "Chimaerus, le Dieu Non-Rêvé",
        order: 1,
        role: "Boss unique",
        image: "https://overgear.com/guides/wp-content/uploads/2026/03/midnight-voidspire-raid.png",
        difficulty: "Élevée",
        tip: "Tolérance zéro sur les Manifestations absorbées (renforcement permanent). Tuez-les avant Plongée Vorace. Interrompez toutes les Essences Hantées.",
        mechanics: [
          { name: "Manifestations (Rêve/Réalité)", type: "adds", desc: "Des Manifestations apparaissent hors de la réalité normale. Elles ne prennent des dégâts QUE si vous avez l'Alnsight actif. Si elles atteignent Chimaerus, il se renforce DÉFINITIVEMENT et IRRÉVERSIBLEMENT.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Alnsight (nécessaire pour DPS Manifestations)", type: "tip", desc: "Buff requis pour endommager les Manifestations. Coordonnez son activation avec les apparitions de Manifestations pour ne pas perdre de temps.", interrupt: false, dispel: null },
          { name: "Essences Hantées (Fearsome Cry + Essence Bolt)", type: "interrupt", desc: "Les Essences Hantées castent Fearsome Cry et Essence Bolt — tous deux interruptibles. Rotation d'interruptions stricte. Ne laissez jamais un cast passer.", interrupt: true, dispel: null, priority: "HIGH" },
          { name: "Dévéstation Corrompue (100% énergie)", type: "cooldown", desc: "Quand Chimaerus atteint 100% d'énergie, il s'envole et inflige de lourds dégâts de raid continus. Cooldowns défensifs de groupe obligatoires. Gérez aussi les adds restants.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Plongée Vorace (fin de phase aérienne)", type: "dodge", desc: "Fin de phase aérienne : toutes les Manifestations restantes sont INSTANTANÉMENT absorbées par le boss. Assurez-vous que toutes sont mortes AVANT ce cast.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Renforcement Permanent", type: "tip", desc: "Chaque absorption = buff permanent irréversible. Sur Mythique : aucune absorption tolérée. Sur Normal/Héroïque : les absorptions rendent le combat de plus en plus difficile.", interrupt: false, dispel: null },
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
    description: "Le raid de clôture de la Saison 1 — déverrouillé 2 semaines après les autres. Deux boss très compacts mais mécaniquement denses qui nécessitent une exécution précise.",
    lore: "La Marche sur Quel'Danas représente l'affrontement final avec les forces de Minuit près du Puits du Soleil corrompu, menant à la révélation narrative ultime de la saison.",
    guideUrl: "https://www.wowhead.com/guide/midnight/raids/march-on-quel-danas-midnight-falls-boss-strategy-abilities",
    wowheadUrl: "https://www.wowhead.com/guide/midnight/raids/march-on-quel-danas-belo-ren-child-of-alar-boss-strategy-abilities",
    image: "https://overgear.com/guides/wp-content/uploads/2026/03/midnight-voidspire-loot.png",
    globalTips: [
      "Ce raid déverrouille le 31 mars sur TOUTES les difficultés simultanément — préparez vos 2 compositions.",
      "Boss 1 (Belo'ren) : entraînez la mécanique de cônes colorés sur PTR/Normal avant le progression.",
      "Boss 2 (L'ura/Chute de Minuit) : la mort d'un Cristal de l'Aube = wipe assuré. Dédiez des joueurs à leur protection.",
      "Le raid ferme la saison — attendez des boss avec des dégâts de raid très élevés et peu de marge d'erreur.",
      "Deux boss seulement = possibilité de clear en 1h sur Normal une fois maîtrisé.",
    ],
    bossData: [
      {
        name: "Belo'ren, Enfant d'Al'ar",
        order: 1,
        role: "1er boss",
        image: "https://overgear.com/guides/wp-content/uploads/2026/03/midnight-imperator-averzian.jpg",
        difficulty: "Modérée",
        tip: "La mécanique de cône coloré tank est impitoyable — entraînez-la en Normal. Attendez 2-3 cycles de renaissance avant de conclure. Cooldowns défensifs de groupe à chaque transition.",
        mechanics: [
          { name: "Phases Lumière / Vide Alternées", type: "tip", desc: "Le combat alterne entre des phases dominées par la Lumière et le Vide. Apprenez les capacités spécifiques à chaque phase et adaptez votre positionnement.", interrupt: false, dispel: null },
          { name: "Cônes Tank à Correspondance Couleur", type: "tank", desc: "Le tank de la bonne couleur DOIT absorber le cône correspondant. Rater UNE SEULE FOIS = buff de +30% dégâts pour Belo'ren qui se stack. Sur Mythique : wipe rapide après 2 ratés.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Cycle de Renaissance (Oeuf géant)", type: "tip", desc: "Après chaque mort, Belo'ren se transforme en oeuf géant pendant 30 sec — c'est sa véritable barre de santé. Attendez 2-3 cycles avant de tuer le boss (impossible à tuer en 1 seul cycle).", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Transitions de Phase", type: "cooldown", desc: "Chaque transition entre phases Lumière/Vide inflige des dégâts de raid significatifs. Utilisez des cooldowns défensifs de groupe à chaque transition.", interrupt: false, dispel: null },
          { name: "Mécanique d'Alignement", type: "tip", desc: "Les joueurs peuvent s'aligner temporairement avec la Lumière ou le Vide pour des effets bonus. Apprenez quelle couleur appliquer à chaque phase.", interrupt: false, dispel: null },
        ],
      },
      {
        name: "Chute de Minuit — L'ura",
        order: 2,
        role: "Boss final",
        image: "https://overgear.com/guides/wp-content/uploads/2026/03/midnight-crown-of-the-cosmos.webp",
        difficulty: "Très élevée",
        tip: "Cristaux de l'Aube = objectif n°1. Assignez 2 joueurs dédiés à leur protection permanente. La gestion de l'espace devient critique en fin de combat — planifiez les déplacements.",
        mechanics: [
          { name: "Cristaux de l'Aube — Protection Absolue", type: "tip", desc: "Si UN cristal est détruit → L'ura déclenche Fin de Lumière : dégâts Sacrés massifs + debuff +500% dégâts subis pendant 10 MINUTES. WIPE INSTANTANÉ. Assignez 2 joueurs dédiés à leur protection en permanence.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Tentacules du Vide", type: "adds", desc: "Des Tentacules apparaissent régulièrement et doivent être contrôlés. Trop d'adds vivants simultanément sature les soigneurs. Assignez des DPS dédiés — ne laissez jamais s'accumuler.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Pression de Raid Croissante", type: "heal", desc: "Les zones sûres rétrécissent progressivement et les mécaniques se chevauchent de plus en plus en fin de combat. Les soigneurs doivent maintenir un output constant sous forte pression.", interrupt: false, dispel: null },
          { name: "Gestion de l'Espace", type: "dodge", desc: "Les effets au sol s'accumulent tout au long du combat, réduisant drastiquement les zones de déplacement. Planifiez les déplacements 10-15 sec à l'avance.", interrupt: false, dispel: null },
          { name: "Dégâts de Raid Constants", type: "cooldown", desc: "Dégâts constants sur tout le raid pendant toute la durée du combat. Rotations de cooldowns défensifs essentielles — ne gaspillez pas les CDs en début de combat.", interrupt: false, dispel: null },
          { name: "Fin de Lumière (si cristal brisé)", type: "cooldown", desc: "Wipe mécanique si déclenché. +500% dégâts subis pendant 10 min = impossible à soigner. Éviter à TOUT PRIX.", interrupt: false, dispel: null, priority: "HIGH" },
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

function YoutubeIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}

function getYoutubeId(url) {
  if (!url) return null
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return m?.[1] || null
}

function BossCard({ boss, raidName }) {
  const [open, setOpen] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const interruptCount = boss.mechanics.filter(m => m.interrupt).length
  const dispelCount = boss.mechanics.filter(m => m.dispel).length
  const highPrio = boss.mechanics.filter(m => m.priority === "HIGH").length
  const youtubeId = getYoutubeId(boss.videoUrl)
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`wow midnight ${raidName} ${boss.name} raid guide`)}`

  return (
    <div className="rounded-xl border border-void-700/60 bg-void-900/60 overflow-hidden">
      <div className="flex items-center gap-4 p-4">
        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-void-800 border border-void-600 relative">
          <img src={boss.image} alt={boss.name} className="w-full h-full object-cover"
            onError={e => { e.target.style.display = "none" }} />
          <div className="absolute bottom-0 left-0 right-0 text-center text-xs font-bold text-void-200 bg-void-900/80 py-0.5">
            {boss.order}
          </div>
        </div>
        <button onClick={() => setOpen(v => !v)} className="flex-1 min-w-0 text-left hover:opacity-80 transition-opacity">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-void-500 font-medium">{boss.role}</span>
            {boss.difficulty && (
              <span className={`text-xs font-medium ${DIFFICULTY_COLOR[boss.difficulty] || "text-void-400"}`}>
                · {boss.difficulty}
              </span>
            )}
          </div>
          <div className="font-semibold text-void-100 truncate">{boss.name}</div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-[10px] text-void-400">{boss.mechanics.length} mécaniques</span>
            {interruptCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-yellow-900/50 text-yellow-300 border border-yellow-700/50">
                {interruptCount} KICK{interruptCount > 1 ? "S" : ""}
              </span>
            )}
            {dispelCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-900/50 text-green-300 border border-green-700/50">
                {dispelCount} DISPEL{dispelCount > 1 ? "S" : ""}
              </span>
            )}
            {highPrio > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-900/50 text-red-300 border border-red-700/50">
                {highPrio} PRIO
              </span>
            )}
          </div>
        </button>
        {/* Video button */}
        {youtubeId ? (
          <button
            onClick={() => setShowVideo(v => !v)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border flex-shrink-0
              ${showVideo ? "bg-red-600/20 border-red-500/50 text-red-400" : "bg-red-900/20 border-red-800/40 text-red-400 hover:bg-red-600/20 hover:border-red-500/50"}`}
            title="Voir la vidéo guide"
          >
            <YoutubeIcon />
            <span className="hidden sm:inline">{showVideo ? "Fermer" : "Vidéo"}</span>
          </button>
        ) : (
          <a
            href={searchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-void-800/60 border border-void-700/40 text-void-500 hover:text-red-400 hover:border-red-800/40 transition-all flex-shrink-0"
            title="Rechercher une vidéo guide sur YouTube"
          >
            <YoutubeIcon />
            <span className="hidden sm:inline">Rechercher</span>
          </a>
        )}
        <button onClick={() => setOpen(v => !v)} className="flex-shrink-0">
          <svg className={`w-4 h-4 text-void-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* YouTube embed */}
      {showVideo && youtubeId && (
        <div className="border-t border-void-700/50 bg-black/30">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
              title={`Guide vidéo — ${boss.name}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {open && (
        <div className="border-t border-void-700/50 p-4">
          {boss.tip && (
            <div className="mb-3 p-3 rounded-lg bg-void-800/80 border border-void-600/50">
              <span className="text-[10px] font-bold text-void-400 tracking-widest">STRATÉGIE GLOBALE</span>
              <p className="text-void-200 text-xs mt-1 leading-relaxed">{boss.tip}</p>
            </div>
          )}
          <div className="space-y-2">
            {boss.mechanics.map(m => {
              const style = MECHANIC_COLORS[m.type] || MECHANIC_COLORS.tip
              return (
                <div key={m.name} className={`rounded-lg border p-3 ${style.bg} ${m.priority === "HIGH" ? "border-red-500/40" : style.border}`}>
                  <div className="flex items-start gap-2 flex-wrap mb-1">
                    <span className={`text-[10px] font-bold tracking-widest flex-shrink-0 ${style.text}`}>{style.label}</span>
                    {m.priority === "HIGH" && (
                      <span className="text-[9px] font-black tracking-widest px-1 rounded bg-red-900/60 text-red-300 border border-red-600/50">PRIORITÉ HAUTE</span>
                    )}
                    {m.interrupt && (
                      <span className="text-[9px] font-bold px-1 rounded bg-yellow-900/60 text-yellow-200 border border-yellow-600/50">KICK</span>
                    )}
                    {m.dispel && (
                      <span className="text-[9px] font-bold px-1 rounded bg-teal-900/60 text-teal-200 border border-teal-600/50">DISPEL {m.dispel}</span>
                    )}
                  </div>
                  <span className="text-void-100 font-medium text-sm">{m.name}</span>
                  <p className="text-void-300 text-xs mt-0.5 leading-relaxed">{m.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function RaidsPage() {
  const [activeId, setActiveId] = useState(RAIDS[0].id)
  const [showTips, setShowTips] = useState(false)
  const raid = RAIDS.find(r => r.id === activeId)

  return (
    <div className="min-h-screen bg-void-950 text-void-100">
      <div className="border-b border-void-800 bg-void-900/50 px-8 py-6">
        <h1 className="text-2xl font-bold text-void-50">Raids Saison 1</h1>
        <p className="text-void-400 text-sm mt-1">Midnight · 3 raids · 9 boss au total</p>
      </div>

      <div className="border-b border-void-800 bg-void-900/30 px-6">
        <div className="flex gap-1 py-3">
          {RAIDS.map(r => {
            const isActive = r.id === activeId
            return (
              <button key={r.id} onClick={() => { setActiveId(r.id); setShowTips(false) }}
                className={`flex items-center gap-3 px-5 py-2.5 rounded-lg text-sm font-medium transition-all border
                  ${isActive ? "" : "text-void-400 hover:text-void-200 hover:bg-void-800/50 border-transparent"}`}
                style={isActive ? { backgroundColor: `${r.color}20`, borderColor: `${r.color}50`, color: r.color } : {}}
              >
                <span className="text-xs font-bold font-mono px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: `${r.color}25`, color: r.color }}>{r.abbrev}</span>
                <span className="hidden sm:inline">{r.name}</span>
                <span className="text-xs px-1.5 py-0.5 rounded-full font-mono"
                  style={{ backgroundColor: `${r.color}20`, color: r.color }}>{r.bosses}B</span>
              </button>
            )
          })}
        </div>
      </div>

      {raid && (
        <div key={raid.id} className="max-w-5xl mx-auto px-6 py-8">

          {/* Raid hero */}
          <div className="rounded-2xl border overflow-hidden mb-6" style={{ borderColor: `${raid.color}30` }}>
            <div className="h-40 relative"
              style={{ background: `linear-gradient(135deg, ${raid.color}25 0%, #030711 100%)` }}>
              <img src={raid.image} alt={raid.name} className="w-full h-full object-cover opacity-30"
                onError={e => { e.target.style.display = "none" }} />
              <div className="absolute inset-0 flex items-end p-6">
                <div>
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-xs font-bold font-mono px-2 py-1 rounded"
                      style={{ backgroundColor: `${raid.color}30`, color: raid.color }}>{raid.abbrev}</span>
                    <span className="text-xs text-void-300 bg-void-900/70 px-2 py-1 rounded">{raid.bosses} boss</span>
                    <span className="text-xs text-void-300 bg-void-900/70 px-2 py-1 rounded">
                      &#128197; {raid.unlockDate}
                    </span>
                    {raid.unlockMythic !== raid.unlockDate && (
                      <span className="text-xs bg-void-900/70 px-2 py-1 rounded" style={{ color: raid.color }}>
                        Mythique : {raid.unlockMythic}
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl font-bold drop-shadow-lg" style={{ color: raid.color }}>{raid.name}</h2>
                  <p className="text-void-300 text-sm italic">{raid.nameFr}</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-void-900/40">
              <p className="text-void-200 text-sm leading-relaxed mb-3">{raid.description}</p>
              <p className="text-void-400 text-xs italic leading-relaxed border-l-2 pl-3" style={{ borderColor: `${raid.color}50` }}>
                {raid.lore}
              </p>
              <div className="flex gap-3 mt-4 flex-wrap">
                <a href={raid.guideUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-void-800 hover:bg-void-700 text-void-300 hover:text-void-100 transition-colors border border-void-700">
                  <span>&#128218;</span><span>Guide complet</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
                <a href={raid.wowheadUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-void-800 hover:bg-void-700 text-void-300 hover:text-void-100 transition-colors border border-void-700">
                  <span>&#128269;</span><span>Wowhead</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Global Tips */}
          {raid.globalTips && raid.globalTips.length > 0 && (
            <div className="mb-6 rounded-xl border border-void-700/40 overflow-hidden">
              <button onClick={() => setShowTips(v => !v)}
                className="w-full flex items-center justify-between px-4 py-3 bg-void-900/60 hover:bg-void-800/40 transition-colors">
                <div className="flex items-center gap-2">
                  <span>&#128161;</span>
                  <span className="text-sm font-semibold text-void-200">Conseils généraux & Notes de Raid</span>
                  <span className="text-xs text-void-500">({raid.globalTips.length} conseils)</span>
                </div>
                <svg className={`w-4 h-4 text-void-400 transition-transform ${showTips ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showTips && (
                <div className="px-4 py-3 bg-void-900/20 border-t border-void-700/30">
                  <ul className="space-y-2">
                    {raid.globalTips.map((tip, i) => (
                      <li key={i} className="flex gap-2 text-xs text-void-300 leading-relaxed">
                        <span className="text-void-500 flex-shrink-0">•</span><span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Legend */}
          <div className="mb-4 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-void-500 mr-1">Légende :</span>
            {Object.entries(MECHANIC_COLORS).map(([key, style]) => (
              <span key={key} className={`text-[10px] font-bold tracking-widest px-2 py-1 rounded border ${style.bg} ${style.border} ${style.text}`}>
                {style.label}
              </span>
            ))}
          </div>

          {/* Boss cards */}
          <div className="space-y-3">
            {raid.bossData.map((boss, i) => <BossCard key={i} boss={boss} raidName={raid.name} />)}
          </div>

          {raid.id === "queldanas" && (
            <div className="mt-6 p-4 rounded-xl border border-amber-700/40 bg-amber-900/20">
              <p className="text-amber-300 text-sm font-medium">
                &#9888;&#65039; Ce raid déverrouille le <strong>31 mars 2026</strong> sur toutes les difficultés simultanément.
              </p>
              <p className="text-amber-400/70 text-xs mt-1">
                Préparez vos cooldowns et votre composition pour les deux boss en une seule soirée de progression.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
