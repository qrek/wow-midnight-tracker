'use client'
import { useState } from 'react'

const DUNGEONS = [
  {
    id: "sr",
    name: "Orée-du-Ciel",
    englishName: "Skyreach",
    abbrev: "SR",
    expansion: "Warlords of Draenor",
    color: "#f59e0b",
    theinsaneUrl: "https://theinsane.fr/oree-du-ciel-guide-du-donjon-mythique-sr/",
    methodUrl: "https://www.method.gg/guides/dungeons/skyreach",
    description: "Sanctuaire des Arakkoa perché dans les nuages de Draenor. Retour en Mythique+, il exige une gestion précise des tornades, chakrams et ajouts, ainsi qu'une rotation d'interruptions solide.",
    timer: "35 min",
    globalTips: [
      "Rotation d'interruptions solide requise sur le trash (Gale-Caller, Prêtresse, Initié).",
      "Purge très utile : Bouclier Solaire de la Prêtresse, buff de l'Outcast Warrior.",
      "Dispel de saignement nécessaire pour Adorned Bladetalon et les adds d'Araknath.",
      "Haute mobilité recommandée : Chakram Vortex, Searing Quills, Lens Flare.",
      "Stun / CC indispensable pour ralentir le Solar Zealot de Viryx.",
      "Rotez toujours dans le même sens autour de l'arène sur Ranjit — ne revenez JAMAIS en arrière.",
    ],
    route: "Chemin linéaire : Ranjit → Araknath (zone solaire) → Rukhran (gardez le pilier accessible) → Viryx. Interrompez les Gale-Callers à chaque pack, surtout près des bords de plateforme.",
    trash: [
      { mob: "Gale-Caller", action: "INTERRUPT Repel (knockback de masse) — priorité n°1 sur bord de plateforme." },
      { mob: "Adorned Bladetalon", action: "Cleanse le saignement Shear sur le tank. Coordonnez les défensifs sur Blade Rush." },
      { mob: "Blinding Sun Priestess", action: "INTERRUPT Blinding Light. PURGE Solar Barrier sur son allié." },
      { mob: "Outcast Warrior", action: "PURGE Rushing Winds si disponible." },
      { mob: "Solar Elemental", action: "Swap immédiat sur Solar Orb à sa mort. Évitez les cercles de feu." },
    ],
    bosses: [
      {
        name: "Ranjit",
        image: "https://www.method.gg/images/guides/dungeons/ranjit-440.jpg",
        role: "1er boss",
        tip: "Rotez en cercle dans un sens constant. Ne revenez jamais en arrière dans les orbes posés.",
        mechanics: [
          { name: "Chakram des Vents", type: "dodge", desc: "Projectile en ligne vers une cible aléatoire qui revient au boss. Repérez la ligne de tir et esquivez latéralement — ne jamais se trouver dans la trajectoire retour.", interrupt: false, dispel: null },
          { name: "Éventail de Lames", type: "heal", desc: "Applique un saignement à TOUS les joueurs simultanément. Coordination des cleanse requise — dispellez par rotation pour éviter de saturer le soigneur.", interrupt: false, dispel: "saignement" },
          { name: "Surge de Rafale", type: "dodge", desc: "Repousse légèrement et laisse des orbes de vent persistants 1 minute à l'impact. Déposez-les en suivant votre rotation circulaire, dans votre sillage — jamais devant vous.", interrupt: false, dispel: null },
          { name: "Vortex de Chakrams", type: "cooldown", desc: "À 100 énergie : AoE centrale + tornades rotatives pendant 20 sec. Restez mobiles et suivez le mouvement des tornades. Utilisez vos cooldowns défensifs de groupe ici.", interrupt: false, dispel: null, priority: "HIGH" },
        ],
      },
      {
        name: "Araknath",
        image: "https://www.method.gg/images/guides/dungeons/araknath-444.jpg",
        role: "2ème boss",
        tip: "Le tank ne doit JAMAIS quitter le corps à corps — Onde de Choc en boucle si vous partez. Absorbez tous les faisceaux des Constructs avant Supernova.",
        mechanics: [
          { name: "Protocole Défensif", type: "tank", desc: "Crée un anneau de feu à 5m autour du boss. Le tank et les mêlées ne doivent jamais sortir de cette zone. Le boss reste immobile — parfait pour aligner les interruptions.", interrupt: false, dispel: null },
          { name: "Onde de Choc", type: "tank", desc: "Lancé en boucle si le tank sort du corps à corps. Restez collé au boss en permanence.", interrupt: false, dispel: null },
          { name: "Constructs Énergisés (3 vagues)", type: "soak", desc: "Chaque vague dure 12 sec. Les Constructs tirent des lasers de soin vers le boss → Infusion Solaire. Les joueurs NON-TANK doivent s'interposer pour absorber les faisceaux. Utilisez défensifs + potions avant chaque vague.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Coup de Chaleur (Construct)", type: "dodge", desc: "Après leur canal, les Constructs tirent un frontal. Écartez-vous sur les côtés ou passez sous le boss.", interrupt: false, dispel: null },
          { name: "Supernova", type: "cooldown", desc: "Dégâts de groupe augmentés de 5% par stack d'Infusion Solaire. Si tous les faisceaux ont été absorbés = 0 stack = dégâts minimes. Utilisez un CD défensif de groupe par sécurité.", interrupt: false, dispel: null },
        ],
      },
      {
        name: "Rukhran",
        image: "https://www.method.gg/images/guides/dungeons/rukhran-447.jpg",
        role: "3ème boss",
        tip: "Gardez le pilier central accessible en permanence pour la ligne de vue sur Piquants Brûlants. Ne tuez JAMAIS deux Sunwings superposées.",
        mechanics: [
          { name: "Fracture Solaire (Sunwing)", type: "adds", desc: "Invoque un add Sunwing qui fixate aléatoirement. Le tank l'attire, les DPS le tuent immédiatement. À sa mort, il laisse un oeuf — tuer un autre Sunwing sur l'oeuf le ressuscite.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Serres Ardentes", type: "tank", desc: "Forte attaque sur le tank. Utilisez un cooldown défensif à chaque cast.", interrupt: false, dispel: null },
          { name: "Cri Strident (Enrage)", type: "tank", desc: "Lancé uniquement si le tank sort du corps à corps. Restez toujours en contact — c'est une condition d'enrage mou.", interrupt: false, dispel: null },
          { name: "Piquants Brûlants (Searing Quills)", type: "dodge", desc: "Canal létal sur tous les joueurs en ligne de vue. TOUT le groupe doit se cacher derrière le pilier central AVANT la fin du cast. Préparez la position à l'avance.", interrupt: false, dispel: null, priority: "HIGH" },
        ],
      },
      {
        name: "Grand Sage Viryx",
        image: "https://www.method.gg/images/guides/dungeons/high-sage-viryx-440.jpg",
        role: "Boss final",
        tip: "Stackez le groupe près de l'entrée — maximize la distance avant le bord. Rotation d'interruptions sur Solar Blast obligatoire. Un joueur dédié kite Lens Flare vers les bords.",
        mechanics: [
          { name: "Rayon Scorchant", type: "spread", desc: "3 faisceaux simultanés sur 3 joueurs différents + DoT de 5 sec. Pression de soin continue tout au long du combat. Étalez-vous légèrement pour éviter le cumul.", interrupt: false, dispel: null },
          { name: "Explosion Solaire", type: "interrupt", desc: "Attaque puissante ciblant le tank. Rotation d'interruptions obligatoire sur chaque cast — c'est la priorité n°1 de tout le combat.", interrupt: true, dispel: null, priority: "HIGH" },
          { name: "Plaqué au Sol (Cast Down)", type: "dodge", desc: "Un Solar Zealot apparaît et traîne un joueur vers le bord le plus proche. Le groupe burst l'add immédiatement + stuns. Positionnez le groupe près de l'ENTRÉE pour maximiser la distance avant la chute.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Reflet Aveuglant (Lens Flare)", type: "dodge", desc: "Faisceau poursuivant la cible en laissant une traînée de flaques. La cible kite vers les bords, jamais vers le groupe. Utilisez un défensif personnel si faible mobilité.", interrupt: false, dispel: null },
        ],
      },
    ],
  },
  {
    id: "seat",
    name: "Siège du Triumvirat",
    englishName: "Seat of the Triumvirate",
    abbrev: "SEAT",
    expansion: "Légion",
    color: "#8b5cf6",
    theinsaneUrl: "https://theinsane.fr/siege-du-triumvirat-guide-du-donjon-mythique-seat/",
    methodUrl: "https://www.method.gg/guides/dungeons/seat-of-the-triumvirate",
    description: "Situé dans Mac'Aree sur Argus, le Siège abrite des créatures corrompues par le Vide. Donjon très exigeant en soins — répartissez vos cooldowns sur tous les boss. Timer serré à 34 min.",
    timer: "34 min",
    globalTips: [
      "Plusieurs types de dispels requis : magie (Essence du Rift, Vide Suintant), malédiction.",
      "CC / ralentissements critiques pour les adds de Zuraal, les Gardiens du Rift et les tentacules de Nezhar.",
      "Rotation d'interruptions requise en permanence (Mind Blast de Nezhar, Cri Terreur de Saprish).",
      "Apaisement (Soothe) pour l'enrage du Champion de la Garde des Ombres.",
      "Le check de soins est le plus élevé de la rotation — répartissez les cooldowns sur les 4 boss.",
      "Timer : 34 min, le plus lent — ne rushez pas imprudemment.",
    ],
    route: "4 Subjugueurs Impitoyables → Zuraal → 4 Gardiens du Rift (restez à 30m sinon explosion létale) → Saprish → Vice-Roi Nezhar → L'ura.",
    trash: [
      { mob: "Subjugateurs Impitoyables", action: "DISPEL magie sur Chaines de Subjugation. DISPEL magie sur Vide Suintant (absorb soin)." },
      { mob: "Conjurateur Sombre", action: "INTERRUPT Invoquer Appeleur du Vide en priorité absolue. Kicks de secours sur Éclair d'Ombre." },
      { mob: "Appeleur du Vide Lié", action: "DPS prioritaire — ses pulsations de Vide font des dégâts de groupe constants." },
      { mob: "Traqueur du Rift Impitoyable", action: "INTERRUPT Ombre Soignante (auto-soin). Immunité CC." },
      { mob: "Champion de la Garde", action: "SOOTHE Frénésie de Combat — impératif." },
    ],
    bosses: [
      {
        name: "Zuraal l'Ascendant",
        image: "https://www.method.gg/images/guides/dungeons/zuraal-the-ascended-431.jpg",
        role: "1er boss",
        tip: "Les adds Vide Coagulé doivent être morts ou CC avant chaque Vide Fracassant. Déposez les flaques de Décimer en bordure.",
        mechanics: [
          { name: "Décimer", type: "dodge", desc: "Le boss bondit sur une cible aléatoire et crée une flaque persistante au sol. Déplacez-vous pour déposer les flaques en bordure de salle — jamais au centre.", interrupt: false, dispel: null },
          { name: "Taillade du Vide", type: "tank", desc: "Combo physique + ombre sur le tank. Utilisez vos cooldowns défensifs régulièrement.", interrupt: false, dispel: null },
          { name: "Paume Nulle", type: "dodge", desc: "Frontal sur cible aléatoire. Esquivez latéralement.", interrupt: false, dispel: null },
          { name: "Assaut Suintant → Vide Coagulé", type: "adds", desc: "Applique un DoT sur un joueur ET invoque 2 Vides Coagulés. Si ces adds touchent le boss, ils l'empuissancent massivement. CC (Piège, Paralysie, Peur), ralentissez ou tuez-les AVANT Vide Fracassant.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Vide Fracassant (100 énergie)", type: "cooldown", desc: "Accélère les Vides Coagulés + aspire tous les joueurs vers le centre + explosion de groupe. LES ADDS DOIVENT ÊTRE MORTS OU CC AVANT CE CAST. Soignez tout le monde à pleine santé à l'avance.", interrupt: false, dispel: null, priority: "HIGH" },
        ],
      },
      {
        name: "Saprish",
        image: "https://www.method.gg/images/guides/dungeons/saprish-439.jpg",
        role: "2ème boss",
        tip: "Boss + 2 familiers partagent la santé — stackez-les pour le cléave. Au moins 2 interrupteurs assignés à Cri de Terreur (distanciers requis car le boss repositionne).",
        mechanics: [
          { name: "Pool de Vie Partagé", type: "tip", desc: "Saprish, Shadewing et Darkfang partagent 100% de leur vie. Maintenez-les regroupés pour maximiser le cléave AoE.", interrupt: false, dispel: null },
          { name: "Bombe du Vide + Phase Dash", type: "dodge", desc: "Bombes du Vide apparaissent au sol. Saprish charge vers un joueur — si la charge touche une bombe, déclenche Implosion Ombrale (dégâts massifs). Cléavez les bombes avec les cercles de Phase Dash intentionnellement.", interrupt: false, dispel: null },
          { name: "Surcharge (100 énergie)", type: "cooldown", desc: "Détone toutes les bombes restantes + applique Vide Suintant (DoT magic, +20% dégâts d'ombre par stack). DISPEL magie immédiatement. Soignez le groupe à pleine santé avant ce cast.", interrupt: false, dispel: "magie (Vide Suintant)", priority: "HIGH" },
          { name: "Cri de Terreur (Shadewing)", type: "interrupt", desc: "Désorientation de TOUS les joueurs. Minimum 2 interruptions assignées. Requiert des interrupteurs à distance car Phase Dash repositionne le boss. PRIORITÉ ABSOLUE.", interrupt: true, dispel: null, priority: "HIGH" },
          { name: "Bond de l'Ombre (Darkfang)", type: "heal", desc: "Bond sur cible aléatoire + DoT. Dispellez le saignement ou utilisez un défensif personnel.", interrupt: false, dispel: "saignement/DoT" },
        ],
      },
      {
        name: "Vice-Roi Nezhar",
        image: "https://www.method.gg/images/guides/dungeons/viceroy-nezhar-432.jpg",
        role: "3ème boss",
        tip: "À 100% énergie, Vide Collapsant : après le knockback, SPRINTEZ immédiatement sous le boss — c'est la seule zone sûre. Pré-positionnez avant l'énergie pleine.",
        mechanics: [
          { name: "Explosion Mentale", type: "interrupt", desc: "Attaque puissante sur le tank. Rotation d'interruptions continue — c'est le kick le plus important du combat.", interrupt: true, dispel: null, priority: "HIGH" },
          { name: "Portails de l'Abîsse + Vagues Ombrales", type: "dodge", desc: "3 portails spawns qui tirent des Vagues Ombrales en motif. Identifiez les couloirs sûrs entre les vagues.", interrupt: false, dispel: null },
          { name: "Infusion du Vide Massive", type: "tank", desc: "Cible 3 joueurs avec un fort DoT magique. Dispel magie. Utilisez des défensifs personnels.", interrupt: false, dispel: "magie" },
          { name: "Tentacules Ombraux (5 adds)", type: "adds", desc: "5 tentacules apparaissent et canalisent chacun un Affaissement Mental sur un joueur différent. Cléavez-les IMMÉDIATEMENT — ils sont la priorité absolue.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Vide Collapsant (100 énergie)", type: "dodge", desc: "Knockback sur tout le raid, puis anneau de Vide mortel s'étend vers l'extérieur depuis le boss. Zone sûre = directement sous le boss en mêlée serrée. Sprintez/téléportez sous lui dès le knockback.", interrupt: false, dispel: null, priority: "HIGH" },
        ],
      },
      {
        name: "L'ura",
        image: "https://www.method.gg/images/guides/dungeons/lura-431.jpg",
        role: "Boss final",
        tip: "Lust pendant l'intermission Siphon du Vide (200% dégâts subis sur le boss). Silenciez toutes les Notes AVANT Symphony — c'est un wipe instantané si elle se cast.",
        mechanics: [
          { name: "Notes du Désespoir (6)", type: "adds", desc: "6 Notes spawns et pulsent des dégâts constants (Lamentation). Toutes doivent être silenciées via Rayon Discordant avant que Symphony se caste (wipe instantané).", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Rayon Discordant", type: "tip", desc: "Vos faisceaux personnels — visez les Notes actives pour les silencer. Quand toutes 6 sont silenciées → Siphon du Vide s'active (LUST, 200% dégâts boss).", interrupt: false, dispel: null },
          { name: "Chœur Sinistre", type: "dodge", desc: "Repositionne les Notes + crée des cercles dangereux + applique Angoisse (dégâts croissants toutes les 2 sec). Passez en intermission Siphon AVANT que les stacks deviennent ingérables.", interrupt: false, dispel: "magie (Angoisse)" },
          { name: "Désintégrer", type: "dodge", desc: "Faisceaux rotatifs autour du boss. Déplacez-vous en cercle dans le même sens que les faisceaux.", interrupt: false, dispel: null },
          { name: "Lance Abyssale (tank)", type: "tank", desc: "À 3 stacks de Lance Abyssale, forte frappe d'ombre avec délai. Utilisez un défensif au 3ème stack.", interrupt: false, dispel: null },
        ],
      },
    ],
  },
  {
    id: "aa",
    name: "Académie d'Algeth'ar",
    englishName: "Algeth'ar Academy",
    abbrev: "AA",
    expansion: "Dragonflight",
    color: "#10b981",
    theinsaneUrl: "https://theinsane.fr/academie-dalgethar-guide-du-donjon-mythique-aa/",
    methodUrl: "https://www.method.gg/guides/dungeons/algethar-academy",
    description: "Considérée comme le donjon le plus accessible de la rotation Midnight S1. Interruptions, dispels de poison et execution des mécaniques de balle sur Crawth sont les points clés.",
    timer: "35 min",
    globalTips: [
      "Le donjon le plus accessible de la rotation Midnight S1.",
      "Dispel de poison requis pour Lasher Toxin (Griffes Affamées sur l'Ancien).",
      "Pré-assignez les absorbeurs d'orbes (Vexamus) AVANT le pull — 5 positions distinctes.",
      "Pré-assignez 2-3 joueurs aux balles sur Crawth avant chaque phase de transition.",
      "Lust sur la fenêtre Tempête de Feu à 45% sur Crawth (12 sec d'ampli dégâts sur le boss).",
      "Sur Écho de Doragosa : remontez le groupe à pleine santé AVANT d'engager (Libérer l'Énergie pull immédiat).",
    ],
    route: "Ancien Envahi → Vexamus → Crawth → Écho de Doragosa. Pull le boss vers l'entrée sur Doragosa. Pré-spreadez les positions pour Vexamus.",
    trash: [
      { mob: "Ancien Envahi (trash)", action: "Poison dispel sur les DotS des Lashers. Interrupt Toucher Guérisseur de l'add Branche Ancienne." },
      { mob: "Adds magiques divers", action: "Coordination des interruptions sur les casters. Cleanse les états de contrôle magiques." },
    ],
    bosses: [
      {
        name: "Ancien Envahi",
        image: "https://www.method.gg/images/guides/dungeons/overgrown-ancient-168.jpg",
        role: "1er boss",
        tip: "Restez groupés et bougez ensemble sur Germer. Interrompez Toucher Guérisseur de la Branche Ancienne immédiatement. Dispellez le poison des Griffes Affamées par rotation.",
        mechanics: [
          { name: "Germer", type: "adds", desc: "Canal invoquant des Griffes Affamées (adds). Restez groupés et déplacez-vous ensemble pour les maintenir dans le cléave AoE.", interrupt: false, dispel: null },
          { name: "Ramification → Branche Ancienne", type: "interrupt", desc: "Spawn un add Branche Ancienne qui caste Toucher Guérisseur (soin massif sur le boss). INTERROMPEZ immédiatement. Restez dans le cercle d'Abondance à sa mort pour cleanse le saignement Splinterbark.", interrupt: true, dispel: null, priority: "HIGH" },
          { name: "Jaillir (100 énergie)", type: "adds", desc: "Active toutes les Griffes Affamées dormantes. Le tank les capte, les DPS les nettoient. Rotation de dispels de poison (Lasher Toxin) pendant cette phase.", interrupt: false, dispel: "poison (rotation)" },
          { name: "Briseur d'Écorce", type: "tank", desc: "AoE tank + debuff d'ampli physique. Particulièrement dangereux si des Griffes sont encore vivantes — tuez les adds en priorité.", interrupt: false, dispel: null },
          { name: "Cercle d'Abondance", type: "tip", desc: "Laissé par chaque Griffe tuée. Restez dedans pour cleanse le saignement Splinterbark sur vous. Coordonnez les déplacements autour de ces zones.", interrupt: false, dispel: null },
        ],
      },
      {
        name: "Vexamus",
        image: "https://www.method.gg/images/guides/dungeons/vexamus-167.jpg",
        role: "2ème boss",
        tip: "Pré-assignez 5 positions d'orbes avant le pull. Chaque joueur absorbe UN seul orbe (Débordement empêche d'en absorber deux). Frontal du tank loin du groupe.",
        mechanics: [
          { name: "Surge (cible aléatoire)", type: "interrupt", desc: "Cast arcanîque sur cible aléatoire. Interrompez à chaque fois — priorité n°1 du combat.", interrupt: true, dispel: null, priority: "HIGH" },
          { name: "Expulsion Arcanique", type: "tank", desc: "Grand frontal du tank. Orientez le boss face à un mur, loin du groupe.", interrupt: false, dispel: null },
          { name: "Orbes Arcaniques (5)", type: "soak", desc: "5 orbes spawns en bordure. Chaque joueur absorbe un orbe individuellement avant qu'il atteigne le boss (Débordement = ne peut pas en absorber deux). Pré-assignez les positions avant le pull.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Bombes de Mana", type: "dodge", desc: "3 joueurs ciblés. Déplacez-vous vers les bords de la salle pour déposer les flaques sans gêner l'espace central.", interrupt: false, dispel: null },
          { name: "Fissure Arcanique (100 énergie)", type: "dodge", desc: "Knockback sur tout le groupe + 3 cercles spawns sous les pieds. Attention au knockback vers les flaques existantes. Bougez après le push.", interrupt: false, dispel: null },
        ],
      },
      {
        name: "Crawth",
        image: "https://www.method.gg/images/guides/dungeons/crawth-169.jpg",
        role: "3ème boss",
        tip: "Lust sur la Tempête de Feu (45%). Pré-assignez 2-3 joueurs pour marquer les buts. Le but FEU donne un bonus DPS — scorez-le en priorité.",
        mechanics: [
          { name: "Coup de Bec Sauvage", type: "tank", desc: "Frappe lourde + DoT sur le tank. Utilisez un défensif à chaque cast.", interrupt: false, dispel: null },
          { name: "Rafale Impétueuse", type: "dodge", desc: "Frontal sur cible aléatoire. Esquivez latéralement dès que vous voyez l'animation.", interrupt: false, dispel: null },
          { name: "Cri Assourdissant", type: "spread", desc: "AoE de groupe. Légèrement écarté pour réduire le splash.", interrupt: false, dispel: null },
          { name: "Vents Ravageurs (75% + 45% PV)", type: "tip", desc: "Canal non-interruptible par les sorts standards. 3 balles spawns — pré-assignez 2-3 joueurs pour les scorer. BUT FEU (45%) = Tempête de Feu : 12 sec d'ampli dégâts boss → LUST ICI.", interrupt: false, dispel: null, priority: "HIGH" },
        ],
      },
      {
        name: "Écho de Doragosa",
        image: "https://www.method.gg/images/guides/dungeons/echo-of-doragosa-167.jpg",
        role: "Boss final",
        tip: "Soignez TOUT LE MONDE à pleine santé avant d'engager (Libérer l'Énergie au pull). Spread large en permanence. Tank kite les Fissures Arcaniques loin du groupe.",
        mechanics: [
          { name: "Libérer l'Énergie (pull immédiat)", type: "cooldown", desc: "Dégâts AoE massifs dès que le combat commence. Remontez TOUT le groupe à 100% PV avant d'engager. Pullez vers l'entrée pour orienter les Fissures loin du groupe.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Marque Mystique", type: "interrupt", desc: "Cast sur cible aléatoire — priorité d'interruption n°1. Chaque interrupt raté applique des dégâts et un debuff. Secondaire : Éclair Arcanien avec les kicks restants.", interrupt: true, dispel: null, priority: "HIGH" },
          { name: "Puissance Écrasante (3 stacks)", type: "dodge", desc: "Debuff s'accumulant à chaque dégât reçu. À 3 stacks : une Fissure Arcanique spawn sous vos pieds. Évitez tout ce que vous pouvez pour limiter les stacks.", interrupt: false, dispel: null },
          { name: "Bombe d'Énergie", type: "spread", desc: "Cible aléatoire + explosion au sol. Restez étalés — tout contact par un allié double les dégâts.", interrupt: false, dispel: null },
          { name: "Aspiration de Puissance", type: "dodge", desc: "Aspire tous les joueurs vers le boss. Utilisez dash/bond/clignotement pour ne pas atterrir sur une Fissure Arcanique.", interrupt: false, dispel: null },
        ],
      },
    ],
  },
  {
    id: "pos",
    name: "Fosse de Saron",
    englishName: "Pit of Saron",
    abbrev: "POS",
    expansion: "Wrath of the Lich King",
    color: "#60a5fa",
    theinsaneUrl: "https://theinsane.fr/fosse-de-saron-mythic-dungeon-guide-pos/",
    methodUrl: "https://www.method.gg/guides/dungeons/pit-of-saron",
    description: "Mine glaciale de la Couronne de Glace — le donjon le plus axé dégâts physiques de la rotation. Tank mitigation primordiale. Gestion des lignes de vue, maladies et malédictions essentielle.",
    timer: "33 min",
    globalTips: [
      "Donjon le plus physique de la rotation — tank mitigation maximale indispensable.",
      "Dispel maladie requis : Rôtlings, Ghoules Pourrissantes, Rotting Strikes de Tyrannus.",
      "Dispel malédiction requis : Tourmenteur de Carrière (Curse of Torment).",
      "Dispel magie requis : Permeating Cold (Coldwraith), debuff Cryostomp de Garfrost.",
      "Rotation d'interruptions critique sur tout le trash.",
      "Route : 2 chemins (Garfrost ou Ick/Krick), libérez les 6 camps de prisonniers, rejoignez pour Tyrannus.",
    ],
    route: "Fourche : gauche (Ick/Krick) ou droite (Garfrost). Libérez les 6 camps de prisonniers. Reconvergez avant la grotte de glace → Tyrannus. Généralement Garfrost en premier (positionnement plus simple).",
    trash: [
      { mob: "Liche Dreadpulse", action: "INTERRUPT Icy Blast — cast létal sur le tank. Priorité absolue." },
      { mob: "Cadavre Arcaniste", action: "INTERRUPT Netherburst (AoE massive)." },
      { mob: "Coldwraith Rimebone", action: "INTERRUPT Icebolt. DISPEL magie Permeating Cold." },
      { mob: "Tourmenteur de Carrière", action: "DISPEL malédiction Curse of Torment (+dégâts au-dessus de 65% PV)." },
      { mob: "Ghoul Pourrissant", action: "DISPEL maladie — aura passif." },
    ],
    bosses: [
      {
        name: "Maître-Forgeron Garfrost",
        image: "https://www.method.gg/images/guides/dungeons/forgemaster-garfrost-456.jpg",
        role: "1er boss",
        tip: "Placez les blocs de minerai entre vous et la forge AVANT Surcharge Glaciale. Dispellez le debuff Cryostomp (magie) immédiatement. Un bloc de minerai DOIT rester intact pour chaque Surcharge.",
        mechanics: [
          { name: "Lancer de Saronite", type: "tip", desc: "Invoque 2 blocs de minerai sur des joueurs. Ces blocs sont vitaux — ils servent de couverture pour la ligne de vue sur Surcharge Glaciale. Placez-les entre vous et la forge.", interrupt: false, dispel: null },
          { name: "Surcharge Glaciale (100 énergie)", type: "dodge", desc: "Canal vers la forge la plus proche — dégâts de givre x2 par demi-seconde sur tous en ligne de vue. SEULE protection : se cacher derrière un bloc de minerai. Préparez la LOS avant que l'énergie soit pleine.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Briseur de Minerai", type: "tank", desc: "Slam AoE autour du tank. Si aucun bloc de minerai n'est détruit à l'impact, le tank est étourdi 8 sec. Détruire le bloc laisse une flaque de 2 min — placez-les avec soin.", interrupt: false, dispel: null },
          { name: "Cryopiétinement", type: "heal", desc: "Détruit les blocs restants + applique un debuff magique (+50% dégâts de givre) sur 2 joueurs. DISPEL magie IMMÉDIATEMENT avant la prochaine Surcharge Glaciale.", interrupt: false, dispel: "magie (+50% givre)", priority: "HIGH" },
          { name: "Frisson Radiant / Siphonnant", type: "heal", desc: "Pulsations de dégâts de givre constantes sur tout le groupe. Létal combiné avec le debuff Cryostomp non-dispelé.", interrupt: false, dispel: null },
        ],
      },
      {
        name: "Ick et Krick",
        image: "https://www.method.gg/images/guides/dungeons/ick-and-krick-458.jpg",
        role: "2ème boss",
        tip: "Ick et Krick partagent la santé (Nécrolien). Traînez Ick à travers les Ombres pour le cléave. Déposez les flaques de Déplacement aux bords. Interrompez Rayon de Mort sur le VRAI Krick.",
        mechanics: [
          { name: "Nécrolien", type: "tip", desc: "Ick et Krick partagent passivement la santé. Maintenez-les groupés pour le cléave. À la phase boss (Get em, Ick!), kite Ick en évitant toutes les flaques.", interrupt: false, dispel: null },
          { name: "Décalage d'Ombre + Phase d'Adds", type: "adds", desc: "DoT de groupe → phase d'adds : 2 Ombres de Krick spawns. Traînez Ick à travers les ombres pour les cléaver. Tuez-les avant 1 minute (explosion massive).", interrupt: false, dispel: null },
          { name: "Rayon de Mort", type: "interrupt", desc: "Cast du VRAI Krick (pas les ombres) sur cible aléatoire. Identifiez le vrai Krick et interrompez. Les ombres ne castent pas Rayon de Mort.", interrupt: true, dispel: null, priority: "HIGH" },
          { name: "Lier l'Ombre", type: "interrupt", desc: "Canal des Ombres de Krick. Dispel malédiction OU interrompez avant qu'il finisse.", interrupt: true, dispel: "malédiction" },
          { name: "Explosion de Pestilence", type: "dodge", desc: "AoE avec flaques sous 4 joueurs. Dispersez-vous légèrement pour déposer les flaques aux bords sans superposition. Flaques durent 75 sec.", interrupt: false, dispel: null },
          { name: "Déplacement de Fléau", type: "dodge", desc: "Crée des flaques persistantes (75 sec) autour du tank. Déposez-les aux bords de l'arène uniquement.", interrupt: false, dispel: null },
        ],
      },
      {
        name: "Seigneur du Fléau Tyrannus",
        image: "https://www.method.gg/images/guides/dungeons/scourgelord-tyrannus-450.jpg",
        role: "Boss final",
        tip: "Utilisez Éclat de Givre (Rimefang) pour geler les piles d'os infusées AVANT Army of the Dead. Tuez les Propagateurs instantanément — Pulsation Pestilentielle est un wipe accéléré.",
        mechanics: [
          { name: "Armée des Morts", type: "adds", desc: "Convertit les piles d'os non-gelées en adds. Piles infusées (lueur verte) → Propagateurs du Fléau (dégâts AoE massifs). Gelées par Éclat de Givre (Rimefang) = safely prevented.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Éclat de Givre (Rimefang, dragon)", type: "tip", desc: "Rimefang vole au-dessus et tire. Orientez-le intentionnellement vers les piles infusées pour les geler avant Army of the Dead. Idéal : gelez 4/5 piles → 1 seul Propagateur au max.", interrupt: false, dispel: null },
          { name: "Pulsation Pestilentielle (Propagateur)", type: "adds", desc: "AoE de groupe constante tant qu'un Propagateur est en vie. SWAP IMMÉDIAT dès qu'il spawn — c'est la priorité n°1 absolue.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Éclair de Fléau (Propagateur)", type: "interrupt", desc: "Cast du Propagateur. Interrompez avec les kicks de réserve.", interrupt: true, dispel: null },
          { name: "Marque du Seigneur du Fléau", type: "tank", desc: "Knockback sur le tank + debuff +200% dégâts d'ombre pris. Ensuite Châtiment bond vers la position du tank avec AoE à esquiver. Positionnez-vous loin du groupe avant l'expiration du debuff.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Barrage de Glace", type: "dodge", desc: "Canal créant des cercles d'impact à esquiver en permanence. Restez mobiles.", interrupt: false, dispel: null },
        ],
      },
    ],
  },
  {
    id: "mt",
    name: "Terrasse des Magistères",
    englishName: "Magisters' Terrace",
    abbrev: "MT",
    expansion: "Midnight",
    color: "#f97316",
    theinsaneUrl: "https://theinsane.fr/terrasse-des-magisteres-guide-du-donjon-mythique-mt/",
    methodUrl: "https://www.method.gg/guides/dungeons/magisters-terrace",
    description: "Ancienne citadelle Sanssoif redessinée pour Midnight. Gestion de l'espace critique (flaques permanentes), purge et dispels de magie nombreux. Bonus : Tome Arcanîque (+5% haste 30 min).",
    timer: "33 min",
    globalTips: [
      "Bonus : trouvez le Tome Arcanîque dans la bibliothèque → Empuissance Arcanîque (+5% haste, 30 min, persiste à la mort).",
      "Gestion de l'espace cruciale — les flaques persistent 2 min+. Planifiez où les déposer avant chaque combat.",
      "2+ dispels de magie requis (Entraves Éthérées, Fragment Colossal, Vide Consumant, Feu Sacré).",
      "2+ interruptions fiables par pack. POLYMORPH (Magistère Arcanîque) est la priorité n°1 de tout le donjon.",
      "PURGE utile : Lame Arcanique sur Exécuteurs, Garde Précipitante de Seranel.",
      "Sur Arcanotron : utilisez les CDs offensifs pendant la phase d'absorption des orbes (boss prend 20% dégâts sup.).",
    ],
    route: "Petits pulls dans la bibliothèque (dégâts constants de Codex Animé). Décalez les morts de Wyrms pour collecter les buffs. LoS les Consumantes Ombres du Voidcaller si possible.",
    trash: [
      { mob: "Magistère Arcanîque", action: "INTERRUPT Polymorphe — priorité n°1 absolue de tout le donjon. Kicks de réserve sur Éclair Arcanîque." },
      { mob: "Sentinelle Arcanîque", action: "Entraves Éthérées sur le tank = root magique → DISPEL magie. Immunité CC." },
      { mob: "Exécuteur Lamebrisée", action: "PURGE Lame Arcanique (buff dégâts). Immunité CC." },
      { mob: "Infuseur du Vide", action: "INTERRUPT Vague de Terreur. DISPEL magie Vide Consumant (debuff joueur)." },
      { mob: "Pyromancien Ardent", action: "INTERRUPT chaque Pyroblaste — priorité n°1 quand présent. Immunité CC." },
      { mob: "Appeler du Vide Ombreux", action: "INTERRUPT Appel du Vide (invoque adds). Utiliser LoS sur Consumantes Ombres." },
    ],
    bosses: [
      {
        name: "Arcanotron Custos",
        image: "https://www.method.gg/images/guides/dungeons/arcanotron-custos-387.jpg",
        role: "1er boss",
        tip: "Explosez offensivement pendant la phase d'absorption (boss -20% PV, vous prenez 20% dégâts sup.). Gérez les flaques vers les bords dès le début.",
        mechanics: [
          { name: "Expulsion Arcanique", type: "dodge", desc: "AoE sur tout le groupe + knockback. Laisse une grande flaque pendant 2 min à l'impact. Utilisez les murs/escaliers pour limiter le knockback. Gérez les flaques vers les bords.", interrupt: false, dispel: null },
          { name: "Frappe Répulsive", type: "tank", desc: "Forte frappe arcanique + knockback sur le tank. Défensif recommandé. Positionner dos à un mur.", interrupt: false, dispel: null },
          { name: "Protocole de Rechargement (Intermission ~20 sec)", type: "soak", desc: "Boss immobile. Des Orbes d'Énergie se dirigent vers lui — chaque joueur les intercepte pour les bloquer. Absorption = DoT Énergie Instable + dépôt d'une flaque de 2 min. Le boss est PLUS VULNÉRABLE pendant cette phase — utilisez tous vos CDs offensifs.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Énergie Instable", type: "heal", desc: "DoT appliqué lors de l'absorption des orbes. Coordonnez les soins — chaque absorbeur prend des dégâts.", interrupt: false, dispel: null },
        ],
      },
      {
        name: "Seranel Coup-de-Fouet Runique",
        image: "https://www.method.gg/images/guides/dungeons/seranel-sunlash-381.jpg",
        role: "2ème boss",
        tip: "Décalez les entrées dans la Zone de Suppression — n'envoyez pas les 2 joueurs marqués en même temps. Assurez-vous que tout le monde est en bonne santé avant Vague de Silence.",
        mechanics: [
          { name: "Zone de Suppression", type: "tip", desc: "Zone centrale. Y entrer trop longtemps → Pacification. L'entrée déclenche Réaction Nulle (AoE + cercles + ralentissement). Sert à enlever les Marques Runiques.", interrupt: false, dispel: null },
          { name: "Marque Runique", type: "spread", desc: "DoT sur 2 joueurs simultanément avec splash d'AoE. Écartez-vous des autres joueurs. Uniquement removable en entrant dans la Zone de Suppression — décalez les entrées.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Garde Précipitante", type: "interrupt", desc: "Buff magique sur le boss augmentant ses dégâts. PURGE ou dispel magie immédiatement.", interrupt: false, dispel: "magie (purge)", priority: "HIGH" },
          { name: "Vague de Silence", type: "cooldown", desc: "Silences + pacifie tous les joueurs EN DEHORS de la Zone de Suppression pendant 8 sec. Entrez dans la zone avant la fin du cast pour l'éviter.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Réaction Nulle", type: "dodge", desc: "Déclenchée à chaque entrée dans la zone. Dégâts AoE + cercles à esquiver + ralentissement cumulatif.", interrupt: false, dispel: null },
        ],
      },
      {
        name: "Gemellus",
        image: "https://www.method.gg/images/guides/dungeons/gemellus-381.jpg",
        role: "3ème boss",
        tip: "Suivez la flèche du Lien Neural vers le BON clone. 2 clones arrivent au pull, 2 de plus à 50% — coordonnez les défensifs quand les 5 entités sont actives.",
        mechanics: [
          { name: "Triplication (Pull + 50% PV)", type: "adds", desc: "Au pull : 2 clones intankables. À 50% : 2 clones supplémentaires. Tous partagent le pool de santé. À 5 entités simultanées → chaque joueur est ciblé par toutes les capacités en même temps.", interrupt: false, dispel: null },
          { name: "Piqûre Cosmique", type: "dodge", desc: "Dégâts d'ombre + flaque sous les pieds de la cible. Déplacez-vous dès l'animation pour minimiser l'espace occupé par les flaques.", interrupt: false, dispel: null },
          { name: "Lien Neural", type: "tip", desc: "Debuff +20% dégâts subis. Une flèche sous vos pieds indique le clone lié. Rejoignez-le pour retirer le debuff IMMÉDIATEMENT.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Étreinte Astrale", type: "dodge", desc: "Aspire les joueurs vers les clones + dégâts d'ombre. Resistez avec les capacités de mouvement ou éloignez-vous avant le cast.", interrupt: false, dispel: null },
        ],
      },
      {
        name: "Degentrius",
        image: "https://www.method.gg/images/guides/dungeons/degentrius-381.jpg",
        role: "Boss final",
        tip: "Répartissez-vous en 4 quadrants dès le pull. Tank seul pour éviter le splash de Fragment Colossal. Rotation de soaking des orbes dans l'ordre des quadrants.",
        mechanics: [
          { name: "Faisceaux Torrent du Vide (4 statues)", type: "tip", desc: "Les statues divisent l'arène en 4 quadrants. 1 joueur minimum par quadrant obligatoire. Healer + DPS, + Tank seul, + 2 DPS à répartir.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Fragment Colossal (tank)", type: "tank", desc: "Frappe lourde sur le tank + TOUT joueur dans un rayon de 8m. Le tank DOIT être seul dans son quadrant. DoT magique de 30 sec → si dispelé, laisse une flaque modérée de 40 sec.", interrupt: false, dispel: "magie (attention : laisse flaque)" },
          { name: "Explosion d'Entropie", type: "tank", desc: "Attaque à distance sur le tank à la place des coups normaux. Pas d'auto-attaques en mêlée — le tank peut rester à distance.", interrupt: false, dispel: null },
          { name: "Essence du Vide Instable", type: "soak", desc: "Orbe rebondissant entre les quadrants dans l'ordre. Ratez l'absorption → DoT de 40 sec sur TOUT le groupe. Rotation des absorptions en suivant l'ordre des quadrants.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Entropie Dévorante", type: "heal", desc: "DoT variable sur un joueur aléatoire. Défensif/potion si c'est votre tour d'absorber simultanément.", interrupt: false, dispel: null },
        ],
      },
    ],
  },
  {
    id: "ws",
    name: "Flèche de Coursevent",
    englishName: "Windrunner Spire",
    abbrev: "WS",
    expansion: "Midnight",
    color: "#06b6d4",
    theinsaneUrl: "https://theinsane.fr/fleche-de-coursevent-guide-du-donjon-mythique-ws/",
    methodUrl: "https://www.method.gg/guides/dungeons/windrunner-spire",
    description: "Le mémorial de la famille Coursevent — Alleria, Vereesa, Sylvanas et Lyrath. Profil de dégâts feu/nature élevé. L'Étreinte de Latch arrêtant le Cri Débilitant de Kalis est la mécanique la plus importante du donjon.",
    timer: "36 min",
    globalTips: [
      "Profil de dégâts feu/nature élevé — soigneur avec bons CDs de groupe recommandé.",
      "Kalis ET Latch doivent mourir quasi-simultanément — sinon enrage Lien Brisé (+10% dégâts / 3 sec).",
      "Sur Kroluk : au moins 1 interrupt + Death Grip (ou équivalent) pour rapprocher l'Axethrower du Mystic.",
      "Sur Le Coeur Agité : gérez les stacks de Bond de Tempête en priorité absolue (DoT sans durée).",
      "Les Fire Spit des Dragonhawks Territoriaux ne sont PAS interruptibles par les sorts standards — utilisez des stuns/CC durs.",
      "Dispel malédiction requis (Malédiction des Ténèbres de Kalis).",
    ],
    route: "Emberdawn → Duo Délabré (Kalis & Latch) → Commandant Kroluk → Le Coeur Agité. Priorisez les CC durs sur les Dragonhawks Territoriaux. Gripper l'Axethrower sur le Mystique sur Kroluk.",
    trash: [
      { mob: "Dragonhawk Territorial", action: "Fire Spit non-interruptible par sorts. Utilisez stun/knockback. Immunité CC partielle." },
      { mob: "Mystique Fantamal", action: "INTERRUPT Éclair en Chaîne en permanence. Immunité CC." },
      { mob: "Magus de Garde", action: "Gérez les sphères de Protection de Garde via knockbacks." },
      { mob: "Grimpeur Fouisseur (héros)", action: "INTERRUPT Piqûre Fongique. Pulsations AoE constantes." },
      { mob: "Geôlier Ardent", action: "DISPEL magie Flammes Fortifiantes (buff purge)." },
    ],
    bosses: [
      {
        name: "Emberdawn",
        image: "https://www.method.gg/images/guides/dungeons/emberdawn-419.jpg",
        role: "1er boss",
        tip: "Restez groupés près du boss pendant la Tempête Ardente pour minimiser les déplacements dans les tourbillons. Déposez les Courants Ascendants aux bords AVANT l'explosion.",
        mechanics: [
          { name: "Bec Brûlant", type: "tank", desc: "Canal soutenu sur le tank avec DoT de feu persistant. Défensif à chaque cast.", interrupt: false, dispel: null },
          { name: "Courant Ascendant Enflammé", type: "dodge", desc: "Debuff sur 2 joueurs qui explose après 6 sec, créant une flaque de feu. Les 2 joueurs DOIVENT se déplacer aux bords AVANT l'explosion pour éviter de gêner l'espace central.", interrupt: false, dispel: null },
          { name: "Tempête Ardente (100 énergie)", type: "cooldown", desc: "Intermission de 16 sec. Dégâts de feu continus + flaques spawns créent des tourbillons toutes les 4 sec + 4 frontaux de souffle qui tournent. Restez PROCHES du boss — cela limite les déplacements dans les tourbillons. CD défensif de groupe obligatoire.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Souffle de Feu (x4 pendant intermission)", type: "dodge", desc: "4 frontaux successifs pendant la Tempête Ardente, ciblant d'abord le tank puis tournant. Mobilité constante requise.", interrupt: false, dispel: null },
        ],
      },
      {
        name: "Duo Délabré (Kalis & Latch)",
        image: "https://www.method.gg/images/guides/dungeons/derelict-duo-411.jpg",
        role: "2ème boss",
        tip: "RÈGLE CRITIQUE : kills simultanés ou enrage fatal. Positionnez Kalis entre Latch et la cible d'Étreinte pour que l'Étreinte stoppe le Cri Débilitant. Dispel Malédiction des Ténèbres immédiatement.",
        mechanics: [
          { name: "Kills Simultanés (Lien Brisé)", type: "tip", desc: "Si l'un meurt avant l'autre → Lien Brisé : +10% dégâts tous les 3 sec sur le survivant. WiPE EN QUELQUES SECONDES. Équilibrez les PV à ~15% et exécutez en même temps.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Éclair d'Ombre (Kalis)", type: "interrupt", desc: "Cast sur cible aléatoire — interruption n°1 du combat. Ne le laissez jamais se caster.", interrupt: true, dispel: null, priority: "HIGH" },
          { name: "Malédiction des Ténèbres (Kalis)", type: "adds", desc: "Debuff sur 2 joueurs → spawn une Entité Sombre qui fixate. Dispel malédiction IMMÉDIATEMENT ou kite et CC l'entité.", interrupt: false, dispel: "malédiction (urgence)", priority: "HIGH" },
          { name: "Cri Débilitant (Kalis)", type: "cooldown", desc: "Kalis téléporte et canalize des dégâts escaladants. NE PEUT PAS être interrompu par les joueurs — SEULE Latch peut l'arrêter via Étreinte. Positionnez Kalis entre Latch et un joueur.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Étreinte de Latch", type: "tip", desc: "Latch tire une ligne vers un joueur aléatoire — attire le premier objet sur la trajectoire (y compris Kalis). Positionnez Kalis entre Latch et la cible pour que Kalis soit attirée et interrompue.", interrupt: false, dispel: null },
          { name: "Bouillie Éclaboussante (Latch)", type: "dodge", desc: "Cercles AoE de nature autour de tous les joueurs + DoT + flaques croissantes. Spread léger — les flaques qui se superposent doublent les dégâts.", interrupt: false, dispel: null },
        ],
      },
      {
        name: "Commandant Kroluk",
        image: "https://www.method.gg/images/guides/dungeons/commander-kroluk-416.jpg",
        role: "3ème boss",
        tip: "Désignez un joueur à distance avec un défensif pour appâter le premier Bond Téméraire. Le reste du groupe stack en mêlée. Gripper/Attirer l'Axethrower sur le Mystique pendant la phase d'adds.",
        mechanics: [
          { name: "Bond Téméraire", type: "dodge", desc: "2 bonds consécutifs vers le joueur le plus éloigné : AoE + DoT + cercles. Stackez les mêlées, un distancier avec défensif légèrement en retrait comme appât. Le 2ème bond va sur le tank.", interrupt: false, dispel: null },
          { name: "Cri Intimidant", type: "tip", desc: "Peur de 6 sec sur tous les joueurs PAS près d'un allié. Désignez un point de regroupement mêlée ET distanciers. Retournez rapidement après le bond.", interrupt: false, dispel: null },
          { name: "Déchaînement", type: "tank", desc: "Canal sur le tank — dégâts physiques soutenus. Défensif à chaque cast.", interrupt: false, dispel: null },
          { name: "Rugissement de Ralliement (66% + 33% PV)", type: "adds", desc: "AoE modérée + 4 Hanteurs + 1 Lanceur de Hache + 1 Mystique Fantamal. Le boss prend 99% de réduction de dégâts et tourbillonne jusqu'à ce que tous les adds soient morts. Gripper/Attirer le Lanceur sur le Mystique pour double interruption.", interrupt: false, dispel: null, priority: "HIGH" },
        ],
      },
      {
        name: "Le Coeur Agité",
        image: "https://www.method.gg/images/guides/dungeons/the-restless-heart-415.jpg",
        role: "Boss final",
        tip: "Gérez les stacks de Bond de Tempête en priorité absolue — ce DoT SANS DURÉE tue si ignoré. Utilisez les cercles de flèches régulièrement. Sautez par-dessus le choc de vent via une flèche.",
        mechanics: [
          { name: "Bond de Tempête (Passif, sans durée)", type: "heal", desc: "DoT permanent sans durée qui ne disparaît JAMAIS seul. La seule façon de l'enlever est de marcher sur une flèche de Pluie de Flèches. Ne laissez pas les stacks monter haut.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Pluie de Flèches", type: "dodge", desc: "Canal créant des cercles de flèches au sol. Spread léger pour maximiser le nombre de flèches disponibles. Ces cercles servent à retirer Bond de Tempête.", interrupt: false, dispel: null },
          { name: "Tir à la Rafale", type: "dodge", desc: "AoE qui efface les flaques de flèches ET applique un DoT supplémentaire. Spread pour maximiser les flèches effacées par joueur.", interrupt: false, dispel: null },
          { name: "Rafale dans le Mille (100 énergie)", type: "dodge", desc: "Boss saute au bord, applique Bond de Tempête sur tous, puis tire un choc de vent balayant la salle. SAUTEZ sur un cercle de flèche juste avant l'impact pour sauter par-dessus. Blink/téléportation fonctionne aussi.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Frappe Tempête (tank)", type: "tank", desc: "Knockback massif + augmentation des dégâts physiques subis. Positionnez le tank près d'un bord pour permettre un knockback contrôlé vers une flèche. Défensif obligatoire.", interrupt: false, dispel: null },
        ],
      },
    ],
  },
  {
    id: "npx",
    name: "Point-Nexus Xenas",
    englishName: "Nexus-Point Xenas",
    abbrev: "NPX",
    expansion: "Midnight",
    color: "#a78bfa",
    theinsaneUrl: "https://theinsane.fr/point-nexus-xenas-guide-du-donjon-mythique-npx/",
    methodUrl: "https://www.method.gg/guides/dungeons/nexus-point-xenas",
    description: "3 boss dans 3 ailes (Arcanique, Vide, Lumière). Sur Lothraxion : le boss est le seul clone SANS cornes lumineuses. Hunter's Mark appliqué avant la phase révèle le vrai boss. Teleportez via les conduits entre les ailes (gain de temps majeur).",
    timer: "38 min",
    globalTips: [
      "3 boss uniquement — exigence de burst élevée pour la phase d'ampli de Nysarra.",
      "Après chaque boss d'aile, utilisez le CONDUIT pour téléporter au centre — économie de 1-2 min par run.",
      "Lothraxion : appliquez Hunter's Mark avant la phase Divine Ruse pour identifier le boss (pas de cornes lumineuses).",
      "Dispel malédiction requis (Appeleur du Vide Maudit dans l'aile Vide).",
      "Dispel magie fort requis : Lumière Brûlante (Lumière-Forgé), Entraves Éthérées (Sentinelle).",
      "Les Fils Arcanîques de l'aile Éthérée peuvent être désarmorcés par un Voleur/Ingénieur — gain sur les hautes clés.",
    ],
    route: "Aile Éthérée → Kasreth (conduit) → Aile du Vide → Nysarra (conduit) → Aile Lumière → Lothraxion. Rogue/Ingénieur : désarmorcez les fils de l'aile éthérée.",
    trash: [
      { mob: "Fils Arcanîques (aile éthérée)", action: "Étourdissement + arcane dégâts si touchés. Désarmorcez (Voleur/Ingénieur) sur hautes clés." },
      { mob: "Nexus Adepte", action: "INTERRUPT Éclair d'Ombre en continu." },
      { mob: "Gardien du Circuit", action: "Immunité CC. Canalise Mana Arcanîque — défensifs/CDs de soin. Évitez les cercles Impulsion Erratique." },
      { mob: "Grand Nullificateur", action: "INTERRUPT chaque cast Nullification. Devient Tache à la mort." },
      { mob: "Lumière-Forgé", action: "INTERRUPT Éclair Sacré. DISPEL magie Lumière Brûlante sur 2 joueurs (urgence)." },
    ],
    bosses: [
      {
        name: "Chef Architecte Kasreth",
        image: "https://www.method.gg/images/guides/dungeons/chief-corewright-kasreth-407.jpg",
        role: "1er boss",
        tip: "Gardez un bloc de Charge de Reflux disponible pour chaque Réseau de Lignes de Force. Déposez toutes les flaques aux bords depuis le début.",
        mechanics: [
          { name: "Réseau de Lignes de Force", type: "dodge", desc: "Faisceaux traversant la plateforme. Les joueurs avec Charge de Reflux (DoT) peuvent les détruire en les touchant → étourdissement des ennemis proches.", interrupt: false, dispel: null },
          { name: "Charge de Reflux", type: "tip", desc: "DoT sur un joueur. Quand il touche un faisceau, le faisceau explose (stun ennemis) et le DoT expire. Planifiez : tank positionne le boss près d'un faisceau pour que les joueurs puissent l'utiliser facilement.", interrupt: false, dispel: null },
          { name: "Effondrement de Flux", type: "dodge", desc: "Plusieurs petits cercles successifs ciblant un joueur. Chaque cercle laisse une petite flaque de 75 sec. Déposez-les aux bords — jamais au centre.", interrupt: false, dispel: null },
          { name: "Détonation de Noyau (100 énergie)", type: "cooldown", desc: "Orbe massif lancé vers un joueur : knockback + DoT absorbant les soins + grande flaque à l'impact. Défensifs de groupe. Déposez la flaque vers un coin inutilisé.", interrupt: false, dispel: null, priority: "HIGH" },
        ],
      },
      {
        name: "Garde du Noyau Nysarra",
        image: "https://www.method.gg/images/guides/dungeons/corewarden-nysarra-404.jpg",
        role: "2ème boss",
        tip: "TOUS les cooldowns offensifs + soigneurs pour la fenêtre Éclat de Lumière (18 sec de stun + 300% dégâts). Tuez TOUS les adds avant la fin de la fenêtre ou Dévorer l'Indigne = wipe.",
        mechanics: [
          { name: "Éclat de Lumière (toutes ~60 sec)", type: "cooldown", desc: "Lothraxion apparaît et tire — boss étourdie 18 sec + fenêtre +300% dégâts/+30% soins. SAUVEZ TOUS VOS CDs OFFENSIFS pour cette fenêtre. Utilisez Lust ici.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Dévorer l'Indigne", type: "adds", desc: "À la fin de la fenêtre d'ampli : le boss absorbe tous les adds vivants → se soigne et inflige des dégâts massifs au groupe. TUEZ TOUS LES ADDS AVANT LA FIN.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Pas Éclipsant", type: "spread", desc: "Grand AoE autour de 2 joueurs + DoT. Étalez-vous rapidement.", interrupt: false, dispel: null },
          { name: "Avant-Garde du Vide (adds)", type: "adds", desc: "Invoque 1 Fléau de Mort + 2 Grands Nullificateurs. Tank capte immédiatement. Orientez Fléau de Mort face au mur. Interrompez chaque Nullification des Nullificateurs.", interrupt: false, dispel: null },
          { name: "Coup de Flagelle Ombral", type: "tank", desc: "Canal sur le tank + knockback + +50% dégâts subis pendant 10 sec. Extrêmement dangereux si des adds sont encore vivants. Défensif obligatoire.", interrupt: false, dispel: null },
        ],
      },
      {
        name: "Lothraxion",
        image: "https://www.method.gg/images/guides/dungeons/lothraxion-409.jpg",
        role: "Boss final",
        tip: "Appliquez Hunter's Mark avant la phase Divine Ruse — la marque reste visible sur le vrai boss (sans cornes lumineuses). Interrompez le VRAI boss, pas un clone.",
        mechanics: [
          { name: "Pre-boss : Images Persistantes", type: "tip", desc: "2 Images Persistantes sur la plateforme avant l'engagement. Éliminez-les avant d'attirer le boss.", interrupt: false, dispel: null },
          { name: "Déchirure Brûlante", type: "tank", desc: "Crée des flaques de lumière qui PERSISTENT toute la rencontre. Placez-les immédiatement aux coins — espace limité sur la durée.", interrupt: false, dispel: null },
          { name: "Dispersion Brillante", type: "spread", desc: "3 joueurs ciblés + DoT sur les proches + 2 Images de Fracture spawns par joueur (6 images au total). Spread — utilisez des défensifs/CDs de soin.", interrupt: false, dispel: null },
          { name: "Ruse Divine (Divine Guile)", type: "interrupt", desc: "Le boss se camouffle parmi tous ses clones. Tous les clones pulsent des dégâts. INTERROMPEZ LE VRAI BOSS uniquement — il est le seul SANS cornes lumineuses sur la tête. Rater = explosion sacrée massive + +20% dégâts sacrés pendant 1 MINUTE.", interrupt: true, dispel: null, priority: "HIGH" },
          { name: "Scintillement (Images)", type: "dodge", desc: "Les images se dashes en ligne vers des joueurs aléatoires. Esquivez activement.", interrupt: false, dispel: null },
        ],
      },
    ],
  },
  {
    id: "mc",
    name: "Cavernes de Maïsara",
    englishName: "Maisara Caverns",
    abbrev: "MC",
    expansion: "Midnight",
    color: "#ef4444",
    theinsaneUrl: "https://theinsane.fr/cavernes-de-maisara-guide-du-donjon-mythique-mc/",
    methodUrl: "https://www.method.gg/guides/dungeons/maisara-caverns",
    description: "Le donjon le plus exigeant de la rotation Midnight. Seulement 3 boss aux mécaniques très élaborées. L'intermission du pont de Rak'tul récompense massivement les bons joueurs — interrompez toutes les Âmes Malignes.",
    timer: "34 min",
    globalTips: [
      "AVANT BOSS 1 : libérez 8 des 12 Prisonniers Desséchés (points jaunes sur la minimap) — sinon le boss ne spawn pas.",
      "Bonus DROIT : Ragoût de Vilebranch Costaud (+3% Leech et Esquive, 30 min) — prenez le chemin droit en premier.",
      "Bonus GAUCHE : Concoction Rituelle (bonus dégâts nature mineur).",
      "Les Pièges Gelants géants du début accordent 5 sec de stun utilisable sur boss/ennemis.",
      "Sur Rak'tul : interrompez TOUTES les 6 Âmes Malignes du pont — chaque interrupt = +25% dégâts/soins/vitesse.",
      "Rak'tul : positionnez le tank contre un brasier pour annuler le knockback de Brise-Esprit.",
    ],
    route: "Prenez le CHEMIN DROIT d'abord (buff Ragoût). Libérez 8 prisonniers. Muro'jin & Nekraxx → Vordaza → Pont Zil'jan → Rak'tul.",
    trash: [
      { mob: "Hexxeur Rituel", action: "INTERRUPT Sortilège — priorité n°1, polymorph un joueur." },
      { mob: "Chasseur de Têtes", action: "INTERRUPT Piège Crochu (réduction de soins)." },
      { mob: "Exécuteur Sinistre", action: "Immunité CC. Pulsations AoE constantes — limitez la taille des pulls." },
      { mob: "Dévore-Âme du Péril", action: "Réduction de soins soutenue sur le groupe. Échelonnez les défensifs." },
      { mob: "Guerrier Réanimé", action: "Cast Réanimation à 0 PV — CC pour empêcher. Dégâts de tank élevés en fin de combat." },
    ],
    bosses: [
      {
        name: "Muro'jin et Nekraxx",
        image: "https://www.method.gg/images/guides/dungeons/murojin-and-nekraxx-397.jpg",
        role: "1er boss",
        tip: "Équilibrez les PV à ~15% et tuez simultanément. Positionnez le tank avec le dos à un mur (Flanquement). Laissez volontairement un joueur dans un piège pour que Nekraxx brise le bloc.",
        mechanics: [
          { name: "Mort Simultanée (Priorité absolue)", type: "tip", desc: "Si Nekraxx meurt en premier → Muro'jin ressuscite son compagnon. Si Muro'jin meurt en premier → Nekraxx gagne Instinct Bestial (stacks de dégâts toutes les 4 sec = wipe). Equilibrez les PV.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Lance de Flanquement (Muro'jin)", type: "tank", desc: "Knockback + saignement de 10 sec sur le tank. Dos à un mur pour éviter d'être repoussé hors de position.", interrupt: false, dispel: null },
          { name: "Pièges Gelants (Muro'jin)", type: "tip", desc: "Immobilise 8 sec un joueur dans un bloc de glace. Un autre joueur doit VOLONTAIREMENT se mettre dans le piège pour que Nekraxx vole dessus et brise le bloc.", interrupt: false, dispel: null },
          { name: "Barrage (Muro'jin)", type: "dodge", desc: "Canal frontal vers le tank avec slow magique cumulatif. Tank face à un mur, loin du groupe. Dispel magie si les stacks montent.", interrupt: false, dispel: "magie (slow)" },
          { name: "Plumes Infectées (Nekraxx)", type: "heal", desc: "Maladie de 30 sec sur TOUT le groupe. DISPEL maladie en priorité — dangereux combiné avec Barrage.", interrupt: false, dispel: "maladie (tout le groupe)", priority: "HIGH" },
          { name: "Plongée Charognarde (Nekraxx)", type: "dodge", desc: "Charge en ligne infligeant des dégâts massifs. Esquivez la trajectoire de charge.", interrupt: false, dispel: null },
        ],
      },
      {
        name: "Vordaza",
        image: "https://www.method.gg/images/guides/dungeons/vordaza-397.jpg",
        role: "2ème boss",
        tip: "Ne touchez PAS les Phantômes (3 yards = mort). Burst prioritaire sur le bouclier de Convergence Nécrotique. Immunités si collision accidentelle.",
        mechanics: [
          { name: "Miasme Dépérissant (Passif)", type: "heal", desc: "Pulsations de dégâts constantes sur tout le groupe pendant tout le combat. Le soigneur ne doit jamais être à court de mana.", interrupt: false, dispel: null },
          { name: "Arracher les Phantômes (4 adds)", type: "adds", desc: "Invoque 4 Phantômes avec 99% réduction de dégâts près des piliers. Ils EXPLOSENT si un joueur les touche à 3 yards : AoE mortelle + DoT cumulatif. IMMUNITÉ si collision accidentelle.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Convergence Nécrotique", type: "interrupt", desc: "Le boss applique d'abord un bouclier immunisant les interruptions, puis canalize des dégâts AoE croissants. BURST le bouclier avec des dégâts focalisés pour interrompre la canalisation.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Drainer l'Âme", type: "tank", desc: "Canal sur le tank. Défensif obligatoire.", interrupt: false, dispel: null },
          { name: "Annihiler", type: "dodge", desc: "Ligne d'attaque balayant la salle vers une cible aléatoire. Esquivez la trajectoire de balayage.", interrupt: false, dispel: null },
        ],
      },
      {
        name: "Rak'tul, Vaisseau d'Âmes",
        image: "https://www.method.gg/images/guides/dungeons/vordaza-397.jpg",
        role: "Boss final",
        tip: "Pont : INTERROMPEZ toutes les 6 Âmes Malignes (+25% dégâts/soins/vitesse chacune). Tank contre un brasier. Le stun de 45 sec sur le boss pendant l'intermission = fenêtre de DPS majeure.",
        mechanics: [
          { name: "Vaisseau Dévoré de Mort (Passif)", type: "heal", desc: "Dégâts de groupe passifs + cercles à esquiver en permanence.", interrupt: false, dispel: null },
          { name: "Broyer les Âmes", type: "spread", desc: "Marque 3 joueurs séquentiellement. Spawn des Totems d'Enchaînement là où chaque joueur était. Les totems infligent des dégâts dans un rayon de 3m. Étalez-vous et bougez dès que vous êtes marqué.", interrupt: false, dispel: null },
          { name: "Brise-Esprit", type: "tank", desc: "Canal sur le tank + knockup + knockback. Positionnez le tank CONTRE UN BRASIER pour annuler le knockback. Défensif obligatoire.", interrupt: false, dispel: null },
          { name: "Rugissement Déchirant d'Âme (Intermission)", type: "tip", desc: "Stun le boss 45 sec + envoie tout le groupe sur le PONT. Fenêtre de DPS majeure au retour. Sur le pont : évitez les Âmes Perdues (root), interrompez TOUTES les Âmes Malignes.", interrupt: false, dispel: null, priority: "HIGH" },
          { name: "Âme Malignes (Pont) — 6 au total", type: "interrupt", desc: "Canalisent Souffrance Éternelle (zones lentes). INTERROMPEZ CHAQUE CAST → détruites + buff au groupe : +25% dégâts/soins/vitesse pendant 30 sec. Interrompre les 6 = +150% cumulatif. PRIORITÉ ABSOLUE sur le pont.", interrupt: true, dispel: null, priority: "HIGH" },
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

function BossCard({ boss, dungeonName }) {
  const [open, setOpen] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const interruptCount = boss.mechanics.filter(m => m.interrupt).length
  const dispelCount = boss.mechanics.filter(m => m.dispel).length
  const highPrio = boss.mechanics.filter(m => m.priority === "HIGH").length
  const youtubeId = getYoutubeId(boss.videoUrl)
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`wow midnight ${dungeonName} ${boss.name} guide mythic plus`)}`

  return (
    <div className="rounded-xl border border-void-700/60 bg-void-900/60 overflow-hidden">
      <div className="flex items-center gap-4 p-4">
        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-void-800 border border-void-600">
          <img src={boss.image} alt={boss.name} className="w-full h-full object-cover"
            onError={e => { e.target.style.display = "none" }} />
        </div>
        <button onClick={() => setOpen(v => !v)} className="flex-1 min-w-0 text-left hover:opacity-80 transition-opacity">
          <div className="text-xs text-void-500 font-medium">{boss.role}</div>
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

export default function StrategiesPage() {
  const [activeId, setActiveId] = useState(DUNGEONS[0].id)
  const [showTips, setShowTips] = useState(false)
  const [showTrash, setShowTrash] = useState(false)
  const dungeon = DUNGEONS.find(d => d.id === activeId)

  return (
    <div className="min-h-screen bg-void-950 text-void-100">
      <div className="border-b border-void-800 bg-void-900/50 px-8 py-6">
        <h1 className="text-2xl font-bold text-void-50">Mythique+ — Stratégies</h1>
        <p className="text-void-400 text-sm mt-1">Saison 1 · 8 donjons · Guides boss, mécaniques, interruptions & trash</p>
      </div>

      <div className="border-b border-void-800 bg-void-900/30 px-6 overflow-x-auto">
        <div className="flex gap-1 py-3 min-w-max">
          {DUNGEONS.map(d => {
            const isActive = d.id === activeId
            return (
              <button key={d.id} onClick={() => { setActiveId(d.id); setShowTips(false); setShowTrash(false) }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap border
                  ${isActive ? "" : "text-void-400 hover:text-void-200 hover:bg-void-800/50 border-transparent"}`}
                style={isActive ? { backgroundColor: `${d.color}20`, borderColor: `${d.color}50`, color: d.color } : {}}
              >
                <span className="text-xs font-bold font-mono px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: `${d.color}25`, color: d.color }}>{d.abbrev}</span>
                <span className="hidden md:inline">{d.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {dungeon && (
        <div key={dungeon.id} className="max-w-5xl mx-auto px-6 py-8">

          {/* Header */}
          <div className="rounded-2xl border p-6 mb-6"
            style={{ borderColor: `${dungeon.color}30`, background: `linear-gradient(135deg, ${dungeon.color}10 0%, transparent 60%)` }}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="text-xs font-bold font-mono px-2 py-1 rounded"
                    style={{ backgroundColor: `${dungeon.color}25`, color: dungeon.color }}>{dungeon.abbrev}</span>
                  <span className="text-xs text-void-400 bg-void-800 px-2 py-1 rounded">{dungeon.expansion}</span>
                  <span className="text-xs text-void-400 bg-void-800 px-2 py-1 rounded">&#9201; {dungeon.timer}</span>
                  <span className="text-xs text-void-400 bg-void-800 px-2 py-1 rounded">{dungeon.bosses.length} boss</span>
                </div>
                <h2 className="text-2xl font-bold" style={{ color: dungeon.color }}>{dungeon.name}</h2>
                <p className="text-void-300 text-sm italic">{dungeon.englishName}</p>
                <p className="text-void-300 text-sm mt-2 leading-relaxed">{dungeon.description}</p>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <a href={dungeon.theinsaneUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-void-800 hover:bg-void-700 text-void-300 hover:text-void-100 transition-colors border border-void-700">
                  <span>&#127467;&#127479;</span><span>theinsane.fr</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
                <a href={dungeon.methodUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-void-800 hover:bg-void-700 text-void-300 hover:text-void-100 transition-colors border border-void-700">
                  <span>&#9876;&#65039;</span><span>method.gg</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Route */}
          {dungeon.route && (
            <div className="mb-4 p-3 rounded-xl border border-void-700/40 bg-void-900/40 flex gap-3 items-start">
              <span className="text-base flex-shrink-0">&#128506;</span>
              <div>
                <span className="text-xs font-bold text-void-400 tracking-widest">ROUTE</span>
                <p className="text-void-300 text-xs mt-0.5 leading-relaxed">{dungeon.route}</p>
              </div>
            </div>
          )}

          {/* Global Tips (collapsible) */}
          {dungeon.globalTips && dungeon.globalTips.length > 0 && (
            <div className="mb-4 rounded-xl border border-void-700/40 overflow-hidden">
              <button onClick={() => setShowTips(v => !v)}
                className="w-full flex items-center justify-between px-4 py-3 bg-void-900/60 hover:bg-void-800/40 transition-colors">
                <div className="flex items-center gap-2">
                  <span>&#128161;</span>
                  <span className="text-sm font-semibold text-void-200">Conseils généraux & Composition</span>
                  <span className="text-xs text-void-500">({dungeon.globalTips.length} conseils)</span>
                </div>
                <svg className={`w-4 h-4 text-void-400 transition-transform ${showTips ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showTips && (
                <div className="px-4 py-3 bg-void-900/20 border-t border-void-700/30">
                  <ul className="space-y-2">
                    {dungeon.globalTips.map((tip, i) => (
                      <li key={i} className="flex gap-2 text-xs text-void-300 leading-relaxed">
                        <span className="text-void-500 flex-shrink-0">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Trash (collapsible) */}
          {dungeon.trash && dungeon.trash.length > 0 && (
            <div className="mb-6 rounded-xl border border-void-700/40 overflow-hidden">
              <button onClick={() => setShowTrash(v => !v)}
                className="w-full flex items-center justify-between px-4 py-3 bg-void-900/60 hover:bg-void-800/40 transition-colors">
                <div className="flex items-center gap-2">
                  <span>&#9876;&#65039;</span>
                  <span className="text-sm font-semibold text-void-200">Trash — Priorités clés</span>
                  <span className="text-xs text-void-500">({dungeon.trash.length} mobs)</span>
                </div>
                <svg className={`w-4 h-4 text-void-400 transition-transform ${showTrash ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showTrash && (
                <div className="px-4 py-3 bg-void-900/20 border-t border-void-700/30 space-y-2">
                  {dungeon.trash.map((t, i) => (
                    <div key={i} className="flex gap-3 items-start text-xs">
                      <span className="text-pink-400 font-bold flex-shrink-0 w-40 truncate">{t.mob}</span>
                      <span className="text-void-300 leading-relaxed">{t.action}</span>
                    </div>
                  ))}
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
            {dungeon.bosses.map((boss, i) => <BossCard key={i} boss={boss} dungeonName={dungeon.englishName} />)}
          </div>

          <div className="mt-8 pt-6 border-t border-void-800 text-center">
            <p className="text-xs text-void-600">
              Données issues de{" "}
              <a href={dungeon.theinsaneUrl} target="_blank" rel="noopener noreferrer" className="text-void-400 hover:text-void-200 underline">theinsane.fr</a>
              {", "}
              <a href={dungeon.methodUrl} target="_blank" rel="noopener noreferrer" className="text-void-400 hover:text-void-200 underline">method.gg</a>
              {" et "}
              <a href="https://www.icy-veins.com/wow/" target="_blank" rel="noopener noreferrer" className="text-void-400 hover:text-void-200 underline">icy-veins.com</a>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
