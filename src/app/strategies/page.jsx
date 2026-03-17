'use client'
import { useState } from 'react'

const DUNGEONS = [
  {
    id: 'sr',
    name: 'Orée-du-Ciel',
    englishName: 'Skyreach',
    abbrev: 'SR',
    expansion: 'Warlords of Draenor',
    color: '#f59e0b',
    bgGradient: 'from-amber-900/30 to-void-900',
    theinsaneUrl: 'https://theinsane.fr/oree-du-ciel-guide-du-donjon-mythique-sr/',
    methodUrl: 'https://www.method.gg/guides/dungeons/skyreach',
    description:
      "Sanctuaire des Arakkoa perché dans les nuages de Draenor, l'Orée-du-Ciel abrite des fanatiques du soleil. Ce retour en Mythique+ exige une gestion précise des tornades, des chakrams et des ajouts.",
    timer: '35 min',
    bosses: [
      {
        name: 'Ranjit',
        image: 'https://www.method.gg/images/guides/dungeons/ranjit-440.jpg',
        role: 'Ouverture',
        mechanics: [
          { name: 'Surge de Rafale', type: 'dodge', desc: 'Repousse et laisse des orbes de vent persistants 1 min — placez-les en bordure de salle.' },
          { name: 'Éventail de Lames', type: 'heal', desc: 'Applique des saignements à tous les joueurs — le soigneur doit réagir vite.' },
          { name: 'Chakram des Vents', type: 'dodge', desc: 'Projectile en ligne vers une cible aléatoire qui revient au boss — esquivez la ligne.' },
          { name: 'Vortex de Chakrams', type: 'cooldown', desc: 'À pleine énergie, fait apparaître des tornades rotatives pendant 20 sec — restez mobiles.' },
        ],
      },
      {
        name: 'Araknath',
        image: 'https://www.method.gg/images/guides/dungeons/araknath-444.jpg',
        role: '2ème boss',
        mechanics: [
          { name: 'Protocole Défensif', type: 'tank', desc: 'Crée un anneau de feu à 5m — le boss reste immobile, ne sortez pas de la zone.' },
          { name: 'Onde de Choc', type: 'tank', desc: 'Lancé en boucle si le tank sort du corps à corps — restez collé au boss.' },
          { name: 'Énergiser', type: 'interrupt', desc: 'Des constructs tirent des lasers vers le boss, le soignant et déclenchant Infusion Solaire — tuez ou interrompez les constructs.' },
          { name: 'Supernova', type: 'cooldown', desc: 'Dégâts de groupe augmentés de 5% par stack d'Infusion Solaire — utilisez des cooldowns défensifs.' },
        ],
      },
      {
        name: 'Rukhran',
        image: 'https://www.method.gg/images/guides/dungeons/rukhran-447.jpg',
        role: '3ème boss',
        mechanics: [
          { name: 'Fracture Solaire', type: 'adds', desc: 'Invoque des Ailes Brûlantes avec fixation — le tank les attrape, les DPS les éliminent.' },
          { name: 'Serres Ardentes', type: 'tank', desc: 'Attaque de tank nécessitant des cooldowns défensifs.' },
          { name: 'Cri Strident', type: 'tank', desc: 'Lancé si le tank sort du corps à corps — maintenez le contact.' },
          { name: 'Piquants Brûlants', type: 'dodge', desc: 'Canal létale — bloquez la ligne de vue pour l'éviter.' },
        ],
      },
      {
        name: 'Grand Sage Viryx',
        image: 'https://www.method.gg/images/guides/dungeons/high-sage-viryx-440.jpg',
        role: 'Boss final',
        mechanics: [
          { name: 'Rayon Scorchant', type: 'spread', desc: 'Cible 3 joueurs avec faisceau + DoT de 5 sec — étalez-vous.' },
          { name: 'Explosion Solaire', type: 'interrupt', desc: 'Attaque ciblant le tank — maintenez une rotation d'interruptions.' },
          { name: 'Plaqué au Sol', type: 'dodge', desc: 'Invoque un Zélateur Solaire qui traîne un joueur vers le bord — détruisez-le vite.' },
          { name: 'Reflet Aveuglant', type: 'dodge', desc: 'Faisceau poursuivant avec lourds dégâts à l'impact — restez mobiles.' },
        ],
      },
    ],
  },
  {
    id: 'seat',
    name: 'Siège du Triumvirat',
    englishName: 'Seat of the Triumvirate',
    abbrev: 'SEAT',
    expansion: 'Légion',
    color: '#8b5cf6',
    bgGradient: 'from-violet-900/30 to-void-900',
    theinsaneUrl: 'https://theinsane.fr/siege-du-triumvirat-guide-du-donjon-mythique-seat/',
    methodUrl: 'https://www.method.gg/guides/dungeons/seat-of-the-triumvirate',
    description:
      'Situé dans Mac\'Aree sur la planète Argus, le Siège du Triumvirat abrite des créatures corrompues par le Vide. Gestion des tentacules, créatures du Vide et coopération d'équipe sont essentielles.',
    timer: '33 min',
    bosses: [
      {
        name: "Zuraal l'Ascendant",
        image: 'https://www.method.gg/images/guides/dungeons/zuraal-the-ascended-431.jpg',
        role: '1er boss',
        mechanics: [
          { name: 'Décimer', type: 'dodge', desc: 'Le boss bondit et crée une flaque — placez les flaques en bordure de salle.' },
          { name: 'Taillade du Vide', type: 'tank', desc: 'Combo de tank — utilisez vos cooldowns défensifs.' },
          { name: 'Paume Nulle', type: 'dodge', desc: 'Frontal sur cible aléatoire — esquivez.' },
          { name: 'Assaut Suintant', type: 'adds', desc: 'Applique un DoT et invoque deux Vide Coagulé qui explosent au contact du boss — CC, ralentissez ou tuez-les.' },
          { name: 'Vide Fracassant', type: 'cooldown', desc: 'Accélère les suintements et aspire les joueurs — les suintements doivent être morts ou CC avant ce cast.' },
        ],
      },
      {
        name: 'Saprish',
        image: 'https://www.method.gg/images/guides/dungeons/saprish-439.jpg',
        role: '2ème boss',
        mechanics: [
          { name: 'Bombe du Vide', type: 'dodge', desc: 'Zones de danger à cléaver avec les cercles de Phase Sprint — les bombes restantes absorbées par le tank.' },
          { name: 'Surcharge', type: 'cooldown', desc: 'Dégâts de groupe lourds — soyez à pleine santé avant le cast. Applique un DoT.' },
          { name: 'Cri de Terreur (Darkfang)', type: 'interrupt', desc: 'Nécessite 2+ interruptions — alternez les interrupteurs à distance.' },
          { name: 'Bond de l\'Ombre (Darkfang)', type: 'heal', desc: 'Dégâts sur cible aléatoire — dispellez le saignement ou utilisez un défensif.' },
          { name: 'Pool de Vie Partagé', type: 'tip', desc: 'Boss et familiers partagent la santé — stackez-les pour le cléave.' },
        ],
      },
      {
        name: 'Vice-Roi Nezhar',
        image: 'https://www.method.gg/images/guides/dungeons/viceroy-nezhar-432.jpg',
        role: '3ème boss',
        mechanics: [
          { name: 'Vagues Ombrales', type: 'dodge', desc: 'Projectiles depuis 3 Portails de l\'Abîsse — esquivez les faisceaux.' },
          { name: 'Infusion du Vide Massive', type: 'tank', desc: 'Cible 3 joueurs — utilisez vos défensifs.' },
          { name: 'Explosion Mentale', type: 'interrupt', desc: 'Attaque sur le tank — maintenez une rotation d\'interruptions pour mitiger les dégâts.' },
          { name: 'Tentacules Ombraux', type: 'adds', desc: '5 tentacules canalisent Fléchissement Mental — cléavez-les rapidement.' },
          { name: 'Vide Collapsant', type: 'dodge', desc: 'À pleine énergie — positionnez-vous SOUS le boss pendant le canal (zone sûre).' },
        ],
      },
      {
        name: "L'ura",
        image: 'https://www.method.gg/images/guides/dungeons/lura-431.jpg',
        role: 'Boss final',
        mechanics: [
          { name: 'Dirge du Désespoir', type: 'heal', desc: 'Impact de groupe invoquant 6 Notes du Désespoir qui pulsent des dégâts constants.' },
          { name: 'Rayon Discordant', type: 'tip', desc: 'Les joueurs ciblés tirent sur des Notes pour les silencer — réduisant les dégâts.' },
          { name: 'Chœur Sinistre', type: 'dodge', desc: 'Repositionne les Notes et crée des cercles — applique Angoisse toutes les 2 sec. Passez en intermission avant saturation.' },
          { name: 'Intermission Siphon du Vide', type: 'cooldown', desc: 'Débuff boss après avoir silencié toutes les Notes — gardez vos cooldowns offensifs pour ce moment.' },
          { name: 'Désintégrer', type: 'dodge', desc: 'Faisceaux rotatifs autour du boss — suivez le mouvement en cercle.' },
        ],
      },
    ],
  },
  {
    id: 'aa',
    name: "Académie d'Algeth'ar",
    englishName: "Algeth'ar Academy",
    abbrev: 'AA',
    expansion: 'Dragonflight',
    color: '#10b981',
    bgGradient: 'from-emerald-900/30 to-void-900',
    theinsaneUrl: 'https://theinsane.fr/academie-dalgethar-guide-du-donjon-mythique-aa/',
    methodUrl: 'https://www.method.gg/guides/dungeons/algethar-academy',
    description:
      "École de magie draconique dans les Îles des Dragons, l'Académie d'Algeth'ar mêle mécaniques de boss complexes et gestion d'adds. Interruptions, dispels et positionnement de groupe sont clés.",
    timer: '35 min',
    bosses: [
      {
        name: 'Ancien Envahi',
        image: 'https://www.method.gg/images/guides/dungeons/overgrown-ancient-168.jpg',
        role: '1er boss',
        mechanics: [
          { name: 'Germer', type: 'adds', desc: 'Canal invoquant des adds — restez stackés et déplacez-vous ensemble pour les maintenir dans le cléave.' },
          { name: 'Ramification', type: 'interrupt', desc: 'Crée un add Branche Ancienne — interrompez son Toucher Guérisseur et restez dans le cercle d\'Abondance à sa mort pour cleanse le saignement.' },
          { name: 'Jaillir', type: 'adds', desc: 'Active les Griffes Affamées à 100 énergie — le tank les attrape pendant que les joueurs tournent les dispels de poison.' },
          { name: 'Briseur d\'Écorce', type: 'tank', desc: 'AoE tank avec debuff d\'ampli physique — particulièrement dangereux si des Griffes Affamées sont vivantes.' },
        ],
      },
      {
        name: 'Crawth',
        image: 'https://www.method.gg/images/guides/dungeons/crawth-169.jpg',
        role: '2ème boss',
        mechanics: [
          { name: 'Coup de Bec Sauvage', type: 'tank', desc: 'Frappe le tank avec un DoT — utilisez un défensif à chaque cast.' },
          { name: 'Rafale Impétueuse', type: 'dodge', desc: 'Frontal sur cible aléatoire — esquivez sur le côté.' },
          { name: 'Cri Assourdissant', type: 'spread', desc: 'AoE nécessitant un écart pour éviter le splash.' },
          { name: 'Vents Ravageurs', type: 'tip', desc: 'Interruptible uniquement en lançant 3 balles dans les buts Feu ou Air (75% et 45% PV) — le but Feu donne un buff DPS.' },
        ],
      },
      {
        name: 'Vexamus',
        image: 'https://www.method.gg/images/guides/dungeons/vexamus-167.jpg',
        role: '3ème boss',
        mechanics: [
          { name: 'Orbes Arcaniques', type: 'soak', desc: '5 orbes en bordure d\'arène — chaque joueur en absorbe un individuellement avant qu\'ils atteignent le boss.' },
          { name: 'Expulsion Arcanique', type: 'tank', desc: 'Frontal du tank — positionnez-le à l\'écart du groupe.' },
          { name: 'Bombes de Mana', type: 'dodge', desc: 'Cible 3 joueurs — déplacez-vous en bordure pour déposer les flaques sans gêner.' },
          { name: 'Fissure Arcanique', type: 'dodge', desc: 'Repousse et crée 3 cercles sous les pieds — attention au knockback vers les flaques.' },
        ],
      },
      {
        name: 'Écho de Doragosa',
        image: 'https://www.method.gg/images/guides/dungeons/echo-of-doragosa-167.jpg',
        role: 'Boss final',
        mechanics: [
          { name: 'Libérer l\'Énergie', type: 'cooldown', desc: 'Pull immédiat — soignez tout le monde d\'abord. Positionnez-vous vers l\'entrée pour éviter les Fissures.' },
          { name: 'Puissance Écrasante', type: 'dodge', desc: 'Debuff à 3 stacks créant une Fissure Arcanique sous le joueur à chaque dégât reçu.' },
          { name: 'Bombe d\'Énergie', type: 'spread', desc: 'Cible aléatoire — étalez-vous pour éviter le splash.' },
          { name: 'Aspiration de Puissance', type: 'dodge', desc: 'Aspire tous les joueurs vers le boss — utilisez vos capacités de mouvement et évitez les fissures.' },
        ],
      },
    ],
  },
  {
    id: 'pos',
    name: 'Fosse de Saron',
    englishName: 'Pit of Saron',
    abbrev: 'POS',
    expansion: 'Wrath of the Lich King',
    color: '#60a5fa',
    bgGradient: 'from-blue-900/30 to-void-900',
    theinsaneUrl: 'https://theinsane.fr/fosse-de-saron-mythic-dungeon-guide-pos/',
    methodUrl: 'https://www.method.gg/guides/dungeons/pit-of-saron',
    description:
      'Ancienne mine glaciale de la Couronne de Glace, la Fosse de Saron est de retour en Mythique+. Ce donjon exige une maîtrise rigoureuse des mécaniques de glace, de ligne de vue et de gestion des adds du Fléau.',
    timer: '33 min',
    bosses: [
      {
        name: 'Maître-Forgeron Garfrost',
        image: 'https://www.method.gg/images/guides/dungeons/forgemaster-garfrost-456.jpg',
        role: '1er boss',
        mechanics: [
          { name: 'Surcharge Glaciale', type: 'dodge', desc: 'Canal vers la forge la plus proche — énormes dégâts de givre. Utilisez la ligne de vue derrière les blocs de minerai.' },
          { name: 'Lancer de Saronite', type: 'tip', desc: 'Invoque des blocs de minerai sur 2 joueurs — ces blocs servent de couverture pour la ligne de vue.' },
          { name: 'Briseur de Minerai', type: 'tank', desc: 'AoE tank qui étourdit 8 sec si le tank ne brise pas un bloc de minerai avec cet impact.' },
          { name: 'Cryopiétinement', type: 'heal', desc: 'Détruit les blocs restants et applique un debuff magique sur 2 joueurs augmentant les dégâts de givre.' },
        ],
      },
      {
        name: 'Ick et Krick',
        image: 'https://www.method.gg/images/guides/dungeons/ick-and-krick-458.jpg',
        role: '2ème boss',
        mechanics: [
          { name: 'Décalage d\'Ombre', type: 'adds', desc: 'DoT de groupe déclenchant la phase d\'adds — invoque 2 Ombres de Krick.' },
          { name: 'Nécrolien', type: 'tip', desc: 'Ick et Krick partagent la santé passivement — cléavez les deux.' },
          { name: 'Rayon de Mort', type: 'interrupt', desc: 'Cible aléatoire depuis le vrai Krick — interrompez-le.' },
          { name: 'Lier l\'Ombre', type: 'interrupt', desc: 'Canal depuis les ombres — dispellez la malédiction ou interrompez.' },
          { name: 'Explosion de Pestilence', type: 'dodge', desc: 'AoE invoquant des flaques sous 4 joueurs — dispersez-vous pour limiter les chevauchements.' },
        ],
      },
      {
        name: 'Seigneur du Fléau Tyrannus',
        image: 'https://www.method.gg/images/guides/dungeons/scourgelord-tyrannus-450.jpg',
        role: 'Boss final',
        mechanics: [
          { name: 'Armée des Morts', type: 'adds', desc: 'Convertit des piles d\'os en adds — gelez les piles avec Éclat de Givre pour les prévenir.' },
          { name: 'Éclat de Givre', type: 'tip', desc: 'Cible les non-tanks deux fois par phase — cléavez les piles gelées pour les encapsuler dans la glace.' },
          { name: 'Marque du Seigneur du Fléau', type: 'tank', desc: 'Buster de tank avec knockback suivi d\'un AoE à esquiver — préparez vos défensifs.' },
          { name: 'Barrage de Glace', type: 'dodge', desc: 'Canal créant des cercles à esquiver — restez mobiles.' },
        ],
      },
    ],
  },
  {
    id: 'mt',
    name: 'Terrasse des Magistères',
    englishName: "Magisters' Terrace",
    abbrev: 'MT',
    expansion: 'Midnight',
    color: '#f97316',
    bgGradient: 'from-orange-900/30 to-void-900',
    theinsaneUrl: 'https://theinsane.fr/terrasse-des-magisteres-guide-du-donjon-mythique-mt/',
    methodUrl: 'https://www.method.gg/guides/dungeons/magisters-terrace',
    description:
      'Ancienne citadelle Sanssoif entièrement redessinée pour Midnight, la Terrasse des Magistères propose de nouveaux boss et mécaniques arcaniques dans les Bois de Chantevent. Minuterie de 33 minutes.',
    timer: '33 min',
    bosses: [
      {
        name: 'Arcanotron Custos',
        image: 'https://www.method.gg/images/guides/dungeons/arcanotron-custos-387.jpg',
        role: '1er boss',
        mechanics: [
          { name: 'Expulsion Arcanique', type: 'dodge', desc: 'Impact de groupe avec knockback laissant des flaques pendant 2 min — gérez l\'espace de l\'arène.' },
          { name: 'Frappe Répulsive', type: 'tank', desc: 'Frappe arcanique + knockback ciblant le tank.' },
          { name: 'Orbe d\'Énergie', type: 'soak', desc: 'Intermission stationnaire — les orbes vers le boss causent de lourds dégâts s\'ils le touchent. Absorbez-les en vous interposant.' },
          { name: 'Énergie Instable', type: 'heal', desc: 'DoT appliqué lors de l\'absorption des orbes — anticipez les soins.' },
        ],
      },
      {
        name: 'Seranel Coup-de-Fouet Runique',
        image: 'https://www.method.gg/images/guides/dungeons/seranel-sunlash-381.jpg',
        role: '2ème boss',
        mechanics: [
          { name: 'Marque Runique', type: 'spread', desc: 'DoT sur 2 joueurs avec splash — écartez-vous des autres et gérez les entrées dans la zone de suppression.' },
          { name: 'Zone de Suppression', type: 'tip', desc: 'Pacifie les joueurs qui en sortent — y entrer déclenche des dégâts de zone. Équilibrez présence et esquive.' },
          { name: 'Réaction Nulle', type: 'dodge', desc: 'Dégâts de zone avec cercles à esquiver.' },
          { name: 'Garde Précipitante', type: 'interrupt', desc: 'Buff magique sur le boss augmentant les dégâts qu\'il inflige — dispellez-le immédiatement.' },
          { name: 'Vague de Silence', type: 'cooldown', desc: 'Pacifie pendant 8 sec sauf si vous êtes dans la zone de suppression — anticipez le timing.' },
        ],
      },
      {
        name: 'Gemellus',
        image: 'https://www.method.gg/images/guides/dungeons/gemellus-381.jpg',
        role: '3ème boss',
        mechanics: [
          { name: 'Triplication', type: 'adds', desc: 'Crée 2 clones intankables au pull, puis 2 de plus à 50% PV. Chaque joueur est finalement ciblé par toutes les capacités.' },
          { name: 'Piqûre Cosmique', type: 'dodge', desc: 'Dégâts d\'ombre déposant des flaques — déplacez-vous pour minimiser la zone occupée.' },
          { name: 'Lien Neural', type: 'tip', desc: 'Debuff d\'ampli de 20% des dégâts subis — touchez le clone lié pour le retirer immédiatement.' },
          { name: 'Étreinte Astrale', type: 'dodge', desc: 'Aspire les joueurs vers les clones en infligeant des dégâts d\'ombre.' },
        ],
      },
      {
        name: 'Degentrius',
        image: 'https://www.method.gg/images/guides/dungeons/degentrius-381.jpg',
        role: 'Boss final',
        mechanics: [
          { name: 'Torrent du Vide', type: 'tip', desc: 'Divise l\'arène en 4 quadrants via des statues — au moins 1 joueur par quadrant obligatoire.' },
          { name: 'Fragment Colossal', type: 'tank', desc: 'Frappe le tank et les proches — applique un DoT magique dispelable qui laisse des flaques.' },
          { name: 'Explosion d\'Entropie', type: 'tank', desc: 'Attaque de tank à distance — Degentrius n\'a pas de coups de mêlée.' },
          { name: 'Essence du Vide Instable', type: 'soak', desc: 'Mécanique d\'absorption rebondissant entre quadrants — les absorptions ratées appliquent un DoT de 40 sec à TOUT le groupe.' },
        ],
      },
    ],
  },
  {
    id: 'ws',
    name: 'Flèche de Coursevent',
    englishName: 'Windrunner Spire',
    abbrev: 'WS',
    expansion: 'Midnight',
    color: '#06b6d4',
    bgGradient: 'from-cyan-900/30 to-void-900',
    theinsaneUrl: 'https://theinsane.fr/fleche-de-coursevent-guide-du-donjon-mythique-ws/',
    methodUrl: 'https://www.method.gg/guides/dungeons/windrunner-spire',
    description:
      'Au cœur des Bois de Chantevent, la Flèche de Coursevent est un mémorial à la tragique histoire de la famille Coursevent — Alleria, Vereesa, Sylvanas et Lyrath. Ce donjon exige précision dans les interruptions et le positionnement.',
    timer: '36 min',
    bosses: [
      {
        name: 'Emberdawn',
        image: 'https://www.method.gg/images/guides/dungeons/emberdawn-419.jpg',
        role: '1er boss',
        mechanics: [
          { name: 'Bec Brûlant', type: 'tank', desc: 'Attaque de tank avec DoT de feu — utilisez des défensifs régulièrement.' },
          { name: 'Courant Ascendant Enflammé', type: 'dodge', desc: 'Debuff sur 2 joueurs qui explose après 6 sec — éloignez-vous des autres joueurs avant l\'explosion.' },
          { name: 'Tempête Ardente', type: 'cooldown', desc: 'Intermission avec lourds dégâts de feu, knockbacks et tourbillons — restez collés au boss pour réduire les mouvements.' },
          { name: 'Souffle de Feu', type: 'dodge', desc: 'Quatre frontaux pendant l\'intermission — déplacez-vous constamment.' },
        ],
      },
      {
        name: 'Duo Délabré (Kalis & Latch)',
        image: 'https://www.method.gg/images/guides/dungeons/derelict-duo-411.jpg',
        role: '2ème boss',
        mechanics: [
          { name: 'Éclair d\'Ombre (Kalis)', type: 'interrupt', desc: 'Cast sur cible aléatoire — maintenez une rotation d\'interruptions.' },
          { name: 'Malédiction des Ténèbres (Kalis)', type: 'adds', desc: 'Crée des entités sombres qui fixatent les joueurs.' },
          { name: 'Saisie Décharnée (Kalis)', type: 'cooldown', desc: 'Canal infligeant des dégâts d\'ombre croissants — utilisez des cooldowns de groupe.' },
          { name: 'Jets Éclaboussants (Latch)', type: 'dodge', desc: 'Crée des flaques de nature DoT autour de tous les joueurs — déplacez-vous.' },
          { name: 'Arrachement Violent (Latch)', type: 'tip', desc: 'Crochet qui peut interrompre le canal de Kalis — les deux bosses doivent mourir quasi-simultanément.' },
        ],
      },
      {
        name: 'Commandant Kroluk',
        image: 'https://www.method.gg/images/guides/dungeons/commander-kroluk-416.jpg',
        role: '3ème boss',
        mechanics: [
          { name: 'Bond Téméraire', type: 'dodge', desc: 'Grand AoE + DoT sur la cible la plus éloignée avec des cercles — stackez les mêlées, désignez un point pour les distanciers.' },
          { name: 'Cri Intimidant', type: 'tip', desc: 'Peur de 6 sec pour ceux qui ne sont pas près d\'un allié — restez groupés.' },
          { name: 'Déchaînement', type: 'tank', desc: 'Canal sur le tank — utilisez un défensif.' },
          { name: 'Rugissement de Ralliement', type: 'adds', desc: 'Invoque des adds (66% et 33% PV) pendant que le boss gagne une réduction de dégâts — tuez les adds vite.' },
        ],
      },
      {
        name: 'Le Cœur Agité',
        image: 'https://www.method.gg/images/guides/dungeons/the-restless-heart-415.jpg',
        role: 'Boss final',
        mechanics: [
          { name: 'Bond de Tempête', type: 'heal', desc: 'Applique un DoT — se retire en se plaçant sur les cercles de flèches au sol.' },
          { name: 'Pluie de Flèches', type: 'dodge', desc: 'Crée des cercles à esquiver — les cercles servent ensuite à retirer le DoT.' },
          { name: 'Tir à la Rafale', type: 'dodge', desc: 'AoE retirant les flaques et appliquant un DoT — bonne nouvelle pour l\'espace de l\'arène.' },
          { name: 'Rafale dans le Mille', type: 'dodge', desc: 'Le boss bondit en bordure d\'arène et crée une onde de choc étourdissante — utilisez les cercles de flèches pour l\'éviter.' },
        ],
      },
    ],
  },
  {
    id: 'npx',
    name: 'Point-Nexus Xenas',
    englishName: 'Nexus-Point Xenas',
    abbrev: 'NPX',
    expansion: 'Midnight',
    color: '#a78bfa',
    bgGradient: 'from-purple-900/30 to-void-900',
    theinsaneUrl: 'https://theinsane.fr/point-nexus-xenas-guide-du-donjon-mythique-npx/',
    methodUrl: 'https://www.method.gg/guides/dungeons/nexus-point-xenas',
    description:
      'Divisé en trois ailes représentant les magies Arcanique, du Vide et de la Lumière, le Point-Nexus Xenas est situé dans la zone de la Tempête du Vide. Le donjon le plus exigeant conceptuellement de la saison.',
    timer: '38 min',
    bosses: [
      {
        name: 'Chef Architecte Kasreth',
        image: 'https://www.method.gg/images/guides/dungeons/chief-corewright-kasreth-407.jpg',
        role: '1er boss',
        mechanics: [
          { name: 'Réseau de Lignes de Force', type: 'dodge', desc: 'Des faisceaux traversent la plateforme — utilisez la Charge de Reflux pour les détruire aux intersections.' },
          { name: 'Charge de Reflux', type: 'tip', desc: 'Applique un DoT jusqu\'à ce que le joueur touche un faisceau, puis étourdit — planifiez la séquence.' },
          { name: 'Effondrement de Flux', type: 'dodge', desc: 'Plusieurs cercles ciblent un joueur — chacun laisse une petite flaque de 75 sec en bordure de salle.' },
          { name: 'Détonation de Noyau', type: 'cooldown', desc: 'Lance un orbe avec knockback, DoT + absorbe les soins, et laisse une grande flaque — utilisez des défensifs.' },
        ],
      },
      {
        name: 'Garde du Noyau Nysarra',
        image: 'https://www.method.gg/images/guides/dungeons/corewarden-nysarra-404.jpg',
        role: '2ème boss',
        mechanics: [
          { name: 'Éclat de Lumière', type: 'cooldown', desc: 'Le boss gagne +300% dégâts et +30% soins (~30 sec dans le combat, puis toutes les 60 sec) — gardez vos cooldowns pour cette phase.' },
          { name: 'Faisceau de Lothraxion', type: 'dodge', desc: 'Faisceau de lumière qui étourdit 5 sec tout le monde touché — esquivez absolument.' },
          { name: 'Cône de Lumière', type: 'dodge', desc: 'Frontal pendant la phase d\'ampli — positionnement critique.' },
          { name: 'Pas Éclipsant', type: 'spread', desc: 'Grand AoE autour de 2 joueurs appliquant un DoT — étalez-vous.' },
          { name: 'Avant-Garde du Vide', type: 'adds', desc: 'Invoque Fléau de Mort et 2 Grands Nullificateurs — cléavez avant la fin de la phase d\'ampli.' },
        ],
      },
      {
        name: 'Lothraxion',
        image: 'https://www.method.gg/images/guides/dungeons/lothraxion-409.jpg',
        role: 'Boss final',
        mechanics: [
          { name: 'Déchirure Brûlante', type: 'tank', desc: 'Attaque de tank — les flaques persistent toute la rencontre. Gérez l\'espace.' },
          { name: 'Dispersion Brillante', type: 'spread', desc: 'Cible 3 joueurs avec DoT, invoque 2 Images de Fracture — écartez-vous.' },
          { name: 'Déchirure Réfléchie', type: 'dodge', desc: 'Les images frappent à 5m, laissent des flaques et knockbackent.' },
          { name: 'Ruse Divine', type: 'interrupt', desc: 'Le boss se déguise parmi ses clones — identifiez et interrompez le clone SANS cornes lumineuses (c\'est le boss). Rater l\'interruption = dégâts massifs + debuff 1 min.' },
        ],
      },
    ],
  },
  {
    id: 'mc',
    name: 'Cavernes de Maïsara',
    englishName: 'Maisara Caverns',
    abbrev: 'MC',
    expansion: 'Midnight',
    color: '#ef4444',
    bgGradient: 'from-red-900/30 to-void-900',
    theinsaneUrl: 'https://theinsane.fr/cavernes-de-maisara-guide-du-donjon-mythique-mc/',
    methodUrl: 'https://www.method.gg/guides/dungeons/maisara-caverns',
    description:
      'Le donjon le plus complexe de la rotation Midnight avec seulement 3 boss aux mécaniques très élaborées. Excellente coordination d\'interruptions, positionnement précis et gestion fine des cooldowns sont indispensables.',
    timer: '34 min',
    bosses: [
      {
        name: "Muro'jin et Nekraxx",
        image: 'https://www.method.gg/images/guides/dungeons/murojin-and-nekraxx-397.jpg',
        role: '1er boss',
        mechanics: [
          { name: 'Double Boss — Mort Simultanée', type: 'tip', desc: 'Les deux boss doivent mourir quasi-simultanément — équilibrez les DPS à ~15% pour l\'exécution finale.' },
          { name: 'Lance de Flanquement (Muro\'jin)', type: 'tank', desc: 'Knockback + saignement sur le tank.' },
          { name: 'Pièges Gelants (Muro\'jin)', type: 'tip', desc: 'Immobilise 8 sec — un joueur doit volontairement se placer dans le piège pour que Nekraxx brise le bloc de glace.' },
          { name: 'Plumes Infectées (Nekraxx)', type: 'heal', desc: 'Maladie de 30 sec sur tout le groupe — dispellez rapidement.' },
          { name: 'Plongée Charognarde (Nekraxx)', type: 'dodge', desc: 'Charge en ligne infligeant des dégâts massifs — esquivez la trajectoire.' },
          { name: 'Tempête de Piquants (Nekraxx)', type: 'dodge', desc: 'Bond + AoE avec cercles à esquiver.' },
        ],
      },
      {
        name: 'Vordaza',
        image: 'https://www.method.gg/images/guides/dungeons/vordaza-397.jpg',
        role: '2ème boss',
        mechanics: [
          { name: 'Miasme Dépérissant', type: 'heal', desc: 'Passif — pulsations de dégâts constantes sur le groupe tout au long du combat.' },
          { name: 'Arracher les Fantômes', type: 'adds', desc: 'Invoque 4 adds avec 99% de réduction de dégâts — ils s\'amplifient mutuellement s\'ils se touchent. Séparez-les.' },
          { name: 'Convergence Nécrotique', type: 'cooldown', desc: 'Canal bouclié avec dégâts AoE croissants — brisez le bouclier en priorité absolue avant que les dégâts saturent.' },
          { name: 'Drainer l\'Âme', type: 'tank', desc: 'Canal sur le tank — utilisez un défensif.' },
          { name: 'Annihiler', type: 'dodge', desc: 'Ligne d\'attaque balayant la salle sur une cible aléatoire — esquivez la trajectoire.' },
        ],
      },
      {
        name: "Rak'tul, Vaisseau d'Âmes",
        image: 'https://www.method.gg/images/guides/dungeons/vordaza-397.jpg',
        role: 'Boss final',
        mechanics: [
          { name: 'Vaisseau Dévoré de Mort', type: 'heal', desc: 'Passif — dégâts de groupe + cercles à esquiver en permanence.' },
          { name: 'Broyer les Âmes', type: 'spread', desc: 'Marque 3 joueurs, le boss bondit sur chacun en invoquant des Totems d\'Enchaînement d\'Âmes — étalez-vous.' },
          { name: 'Brise-Esprit', type: 'tank', desc: 'Combo sur le tank avec flaque + knockback — positionnez-vous en conséquence.' },
          { name: 'Rugissement Déchirant d\'Âme', type: 'cooldown', desc: 'Envoie tout le groupe sur un pont, étourdit le boss 45 sec, brise les totems — gérez la phase de pont avec soin.' },
          { name: 'Phase du Pont', type: 'tip', desc: 'Âme Flétrissante (dégâts croissants), Âmes Perdues (CC les joueurs), Âmes Malignes (interrompez-les pour un buff de groupe).' },
        ],
      },
    ],
  },
]

const MECHANIC_COLORS = {
  tank:      { bg: 'bg-blue-900/40',   border: 'border-blue-700/50',   text: 'text-blue-300',   label: 'TANK' },
  heal:      { bg: 'bg-green-900/40',  border: 'border-green-700/50',  text: 'text-green-300',  label: 'SOIN' },
  dodge:     { bg: 'bg-red-900/40',    border: 'border-red-700/50',    text: 'text-red-300',    label: 'ESQUIVE' },
  interrupt: { bg: 'bg-yellow-900/40', border: 'border-yellow-700/50', text: 'text-yellow-300', label: 'INTERRUPT' },
  spread:    { bg: 'bg-orange-900/40', border: 'border-orange-700/50', text: 'text-orange-300', label: 'ÉCART' },
  soak:      { bg: 'bg-cyan-900/40',   border: 'border-cyan-700/50',   text: 'text-cyan-300',   label: 'ABSORB' },
  adds:      { bg: 'bg-pink-900/40',   border: 'border-pink-700/50',   text: 'text-pink-300',   label: 'ADDS' },
  cooldown:  { bg: 'bg-purple-900/40', border: 'border-purple-700/50', text: 'text-purple-300', label: 'CD GROUPE' },
  tip:       { bg: 'bg-void-800/60',   border: 'border-void-600/50',   text: 'text-void-300',   label: 'CONSEIL' },
}

function BossCard({ boss }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-xl border border-void-700/60 bg-void-900/60 overflow-hidden">
      {/* Boss header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-4 p-4 hover:bg-void-800/40 transition-colors text-left"
      >
        {/* Boss image */}
        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-void-800 border border-void-600">
          <img
            src={boss.image}
            alt={boss.name}
            className="w-full h-full object-cover"
            onError={e => { e.target.style.display = 'none' }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-void-500 font-medium">{boss.role}</span>
          </div>
          <div className="font-semibold text-void-100 truncate">{boss.name}</div>
          <div className="text-xs text-void-400 mt-0.5">{boss.mechanics.length} mécaniques clés</div>
        </div>

        <svg
          className={`w-4 h-4 text-void-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Mechanics */}
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

export default function StrategiesPage() {
  const [activeId, setActiveId] = useState(DUNGEONS[0].id)
  const dungeon = DUNGEONS.find(d => d.id === activeId)

  return (
    <div className="min-h-screen bg-void-950 text-void-100">
      {/* Page header */}
      <div className="border-b border-void-800 bg-void-900/50 px-8 py-6">
        <h1 className="text-2xl font-bold text-void-50">Stratégies Mythique+</h1>
        <p className="text-void-400 text-sm mt-1">
          Saison 1 · 8 donjons · Guides boss &amp; mécaniques
        </p>
      </div>

      {/* Dungeon tab bar */}
      <div className="border-b border-void-800 bg-void-900/30 px-6 overflow-x-auto">
        <div className="flex gap-1 py-3 min-w-max">
          {DUNGEONS.map(d => {
            const isActive = d.id === activeId
            return (
              <button
                key={d.id}
                onClick={() => setActiveId(d.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                  ${isActive
                    ? 'text-void-50 border'
                    : 'text-void-400 hover:text-void-200 hover:bg-void-800/50 border border-transparent'
                  }`}
                style={isActive ? {
                  backgroundColor: `${d.color}20`,
                  borderColor: `${d.color}50`,
                  color: d.color,
                } : {}}
              >
                <span
                  className="text-xs font-bold font-mono px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: `${d.color}25`, color: d.color }}
                >
                  {d.abbrev}
                </span>
                <span className="hidden md:inline">{d.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Dungeon content */}
      {dungeon && (
        <div key={dungeon.id} className="max-w-5xl mx-auto px-6 py-8">

          {/* Dungeon header card */}
          <div
            className="rounded-2xl border p-6 mb-8"
            style={{
              borderColor: `${dungeon.color}30`,
              background: `linear-gradient(135deg, ${dungeon.color}10 0%, transparent 60%)`,
            }}
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span
                    className="text-xs font-bold font-mono px-2 py-1 rounded"
                    style={{ backgroundColor: `${dungeon.color}25`, color: dungeon.color }}
                  >
                    {dungeon.abbrev}
                  </span>
                  <span className="text-xs text-void-400 bg-void-800 px-2 py-1 rounded">
                    {dungeon.expansion}
                  </span>
                  <span className="text-xs text-void-400 bg-void-800 px-2 py-1 rounded flex items-center gap-1">
                    ⏱ {dungeon.timer}
                  </span>
                </div>
                <h2 className="text-2xl font-bold" style={{ color: dungeon.color }}>
                  {dungeon.name}
                </h2>
                <p className="text-void-300 text-sm italic">{dungeon.englishName}</p>
                <p className="text-void-300 text-sm mt-3 max-w-2xl leading-relaxed">
                  {dungeon.description}
                </p>
              </div>

              {/* External links */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                <a
                  href={dungeon.theinsaneUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-void-800 hover:bg-void-700 text-void-300 hover:text-void-100 transition-colors border border-void-700"
                >
                  <span>🇫🇷</span>
                  <span>Guide theinsane.fr</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <a
                  href={dungeon.methodUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-void-800 hover:bg-void-700 text-void-300 hover:text-void-100 transition-colors border border-void-700"
                >
                  <span>⚔️</span>
                  <span>Guide method.gg</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Boss count */}
            <div className="mt-4 flex items-center gap-2">
              <div className="flex gap-1">
                {dungeon.bosses.map((b, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: dungeon.color, opacity: 0.4 + i * 0.2 }}
                    title={b.name}
                  />
                ))}
              </div>
              <span className="text-xs text-void-500">
                {dungeon.bosses.length} boss
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="text-xs text-void-500 mr-1 self-center">Légende :</span>
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
            {dungeon.bosses.map((boss, i) => (
              <BossCard key={i} boss={boss} />
            ))}
          </div>

          {/* Source attribution */}
          <div className="mt-8 pt-6 border-t border-void-800 text-center">
            <p className="text-xs text-void-600">
              Contenu basé sur les guides de{' '}
              <a href={dungeon.theinsaneUrl} target="_blank" rel="noopener noreferrer" className="text-void-400 hover:text-void-200 underline">
                theinsane.fr
              </a>{' '}
              et{' '}
              <a href={dungeon.methodUrl} target="_blank" rel="noopener noreferrer" className="text-void-400 hover:text-void-200 underline">
                method.gg
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
