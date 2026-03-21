# Roadmap — Midnight Tracker

Liste de ce qu’il reste à faire et d’idées pour faire évoluer le dashboard. Priorités indicatives : **P0** (bloquant ou cohérence produit), **P1** (forte valeur), **P2** (nice-to-have).

---

## P0 — Fondations & dette technique

| Sujet | Détail |
|-------|--------|
| **IDs WarcraftLogs** | Remplacer les placeholders dans `src/lib/constants.js` par les vrais `zoneID` / `encounterID` une fois Midnight stabilisé sur WCL. Sans ça, l’analyse et les parses restent approximatifs. |
| **Logs guilde dans « Analyser »** | Brancher `guildLogs` sur l’API WCL (rapports / rankings de guilde sur l’encounter choisi) pour que la vue ne soit pas vide hors mode mock. |
| **Cohérence nom de guilde Blizzard** | Aligner `NEXT_PUBLIC_GUILD_NAME` vs `NEXT_PUBLIC_GUILD_DISPLAY_NAME` et le slug utilisé dans `getGuildRoster` / `api/blizzard/guild` — documenter la règle (un seul nom « canon » côté API). |
| **Renommer ou documenter** | `GET /api/wcl/guild` expose surtout Blizzard — renommer ou ajouter un alias (`/api/guild`) + redirection pour éviter la confusion. |

---

## P1 — Données & perf

| Sujet | Détail |
|-------|--------|
| **Parses WCL sur le roster** | Enrichir chaque ligne avec best/median (zone ou raid) — avec **cache** (Redis, fichier, ou `revalidate` Next) et batching pour limiter les appels WCL. |
| **DPS / HPS** | Remplir `performance` depuis WCL (dernier boss kill, médiane sur plusieurs fights) ou masquer les champs tant qu’ils sont à 0. |
| **Comparer** | Recharger les stats des deux joueurs depuis les mêmes sources que la fiche (Blizzard + WCL) au lieu de seulement la liste du roster — comparaison à jour et équitable. |
| **Fiche joueur** | `zoneID` configurable ou multi-zones (tous les raids S1), pas seulement `40` en dur. |
| **Tests & CI** | Lint + quelques tests sur `data.js` / parsers + `npm run build` en CI (GitHub Actions). |

---

## P1 — UX guilde

| Sujet | Détail |
|-------|--------|
| **Filtres roster** | Par rôle, classe, tranche d’ilvl, recherche par nom — indispensable quand le roster grossit. |
| **Tri** | Ilvl, rating M+, nom, rôle. |
| **États vides** | Messages clairs quand API en erreur, rate limit, ou personnage introuvable (pas seulement le mock). |
| **Accessibilité** | Focus clavier sur le menu mobile, contrastes sur les barres de parse, `aria-live` sur les chargements. |

---

## P2 — Idées sympas (produit)

| Idée | Pourquoi c’est cool |
|------|---------------------|
| **Affixes M+ de la semaine** | Petit encart sur le roster ou la home — lien direct avec le push clefs, zéro clic de plus. |
| **Objectifs de guilde** | « 3/6 M » avec barre partagée, date cible, ou boss « focus » — motive sans quitter l’outil. |
| **Timeline de progression** | Déduire des kills / first kills à partir des logs WCL (ou saisie manuelle légère) — souvenir de saison. |
| **Alts & roster étendu** | Lier plusieurs persos au même joueur (Discord tag ou pseudo) — utile pour bench et compo. |
| **Lien « ouvrir sur WarcraftLogs »** | Depuis la fiche joueur ou l’analyse — aller au profil ou au report en un clic. |
| **Partage social** | Open Graph (image + titre) pour `/player/[name]` quand un membre partage sa fiche. |
| **Mode « stream »** | Page plein écran minimaliste (top 10 M+, progression raid) pour fond d’OBS pendant les raid nights. |
| **Export** | CSV du roster (nom, rôle, ilvl, rating) pour les officiers / tableurs. |
| **Thème saison** | Variante « légère » (moins néon) ou accent couleur guilde via `NEXT_PUBLIC_GUILD_ACCENT`. |
| **Recrutement** | Page statique : classes recherchées, horaires, lien Discord — souvent demandé par les guildes. |

---

## P2 — Technique & confort dev

| Sujet | Détail |
|-------|--------|
| **Variables d’env typées** | Schéma avec Zod au démarrage pour fail fast si `BLIZZARD_*` manquant en prod. |
| **Monitoring** | Logs structurés (erreurs API) + optionnellement Sentry/Vercel Analytics. |
| **PWA** | `manifest.json`, icône — « ajouter à l’écran d’accueil » sur mobile pour les membres. |

---

## Hors scope (volontairement)

- **Auth utilisateurs** (comptes membres) — gros morceau ; à n’ajouter que si besoin de données privées ou édition par les membres.
- **Bot Discord complet** — plutôt lier un webhook sortant depuis une future admin si besoin.

---

## Comment utiliser ce fichier

1. Cocher ou déplacer les lignes dans des issues GitHub / projet GitHub.  
2. Après une grosse livraison, mettre à jour **`PROJECT.md`** et raccourcir cette roadmap.  

*Dernière mise à jour : mars 2026.*
