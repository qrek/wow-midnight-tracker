# Midnight Tracker — État du projet

Document de référence sur l’implémentation actuelle (hors marketing). Dernière mise à jour : mars 2026.

## Vision produit

Application web **dashboard de guilde** pour **World of Warcraft — Midnight, saison 1** : roster, fiches joueur, comparaison, analyse de logs (référence mondiale), plus du **contenu éditorial** (guides raid / M+) intégré à l’UI.

## Stack technique

| Élément | Choix |
|--------|--------|
| Framework | **Next.js 14** (App Router) |
| UI | **React 18**, **Tailwind CSS 3** |
| Thème | Palette custom (`void`, `arcane`, `gold`), fond étoilé, navigation latérale + drawer mobile |
| Données live | **Blizzard Battle.net API** (profil, M+, raids, équipement, roster guilde) |
| Données logs | **WarcraftLogs API v2** (GraphQL, OAuth client credentials côté serveur) |
| Démo sans clés | **`src/lib/mock-data.js`** — guilde fictive « Void Covenant » |

Variables d’environnement : voir `.env.local.example` (`WCL_*`, `BLIZZARD_*`, `NEXT_PUBLIC_GUILD_*`, `BLIZZARD_REGION`).

## Architecture des données

- **`src/lib/data.js`** : couche unique utilisée par les pages serveur (roster, fiche joueur). Détecte la présence de clés API (`useBlizzard`, `useWCL`) et bascule sur le mock si besoin.
- **`src/lib/blizzard.js`** : OAuth Battle.net, appels profil / M+ / raids / équipement / roster guilde (slug guilde dérivé du nom affiché).
- **`src/lib/wcl.js`** : OAuth WCL, requêtes GraphQL (zone rankings, world rankings, recherche joueur sur encounter, etc.).
- **`src/lib/constants.js`** : classes WoW, couleurs parse/M+, **raids S1** (IDs zone + encounters **placeholder**), **donjons M+** liste S1, difficultés WCL, rôles par spec.

Les **IDs de zones / boss WCL** dans `constants.js` sont des **placeholders** (commentés dans le code) : à aligner avec les vrais IDs WCL une fois le contenu live et documenté sur WarcraftLogs.

## Routes UI (`src/app/`)

| Route | Rôle |
|-------|------|
| `/` | **Roster** — grille de cartes joueur (ilvl, rôle, rating M+, barres parse, progression raid par difficulté et par raid via `RAIDS`). Données : `fetchGuildData()`. |
| `/player/[name]` | **Fiche joueur** — stats, progression raid, meilleures clés par donjon (`DUNGEONS`), parses WCL (zone), **liste d’équipement** détaillée (slots, ilvl, enchant, gemmes). Données : `fetchPlayerData()`. |
| `/compare` | **Comparer** — sélection de deux membres, barres comparatives (client) ; roster chargé via `GET /api/wcl/guild`. |
| `/analysis` | **Analyser** — choix raid/boss ou M+, référence « top monde par classe/spec » ou joueur nommé ; appelle `POST /api/wcl/analysis`. UI avec onglets (aperçu, rotations, mécaniques — partie structurelle). |
| `/strategies` | **Mythique+** (libellé nav) — guides donjons : données **statiques** dans la page (tips, trash, boss, liens externes). |
| `/raids` | **Raids** — guides raid Midnight : données **statiques** (boss, mécaniques, dates indicatives, liens). |

Layout : `layout.jsx` — sidebar fixe desktop, barre + menu mobile ; métadonnées SEO de base.

## API routes (`src/app/api/`)

| Endpoint | Comportement |
|----------|----------------|
| `GET /api/wcl/guild` | Expose le résultat de **`fetchGuildData()`** (Blizzard + logique guilde), pas uniquement WCL — nom historique. |
| `GET /api/wcl/character` | Rankings WCL par zone (`zoneID`) pour un personnage ; mock si pas de clé WCL. |
| `POST /api/wcl/analysis` | Sans clé WCL : `worldTop` + **`guildLogs` mock**. Avec clé WCL : **top monde** + éventuellement **`referencePlayer`** ; les **`guildLogs` de guilde ne sont pas encore alimentés** par l’API réelle — la section UI qui les affiche reste vide ou partielle en production tant qu’une requête guilde/logs n’est pas branchée. |
| `GET /api/blizzard/guild` | Roster brut Blizzard ou mock. |
| `GET /api/blizzard/character` | Profil / M+ / raids Blizzard ou mock. |
| `GET /api/debug` | Outil de diagnostic (token Blizzard, slug guilde, index royaumes, test appel guilde) — utile pour valider la config. |

## Ce qui est réellement branché

- **Blizzard** : roster guilde, personnages (profil, M+, progression raids, équipement) quand les credentials sont valides et que les noms/realms correspondent à l’API Midnight.
- **WCL** :
  - **Fiche joueur** : agrégats **zone** (`zoneID` 40 par défaut dans le code) — best/median/kills si l’API répond.
  - **Page Analyser** : classement mondial sur un **encounter** + option joueur cible ; pas encore de **logs de guilde** comparables côté réponse API (voir ci-dessus).
- **Roster (`/`)** : les champs **`wcl`** des membres restent à **0** dans `fetchGuildData` — pas d’appel WCL par joueur sur cette vue (seulement Blizzard pour la liste).

## Contenu statique / éditorial

- **`/raids`** et **`/strategies`** : riches pages avec texte, mécaniques, URLs externes (guides, Wowhead, Method, etc.). Indépendantes des APIs ; à maintenir quand les noms/équilibrages officiels changent.

## Scripts npm

- `npm run dev` — développement  
- `npm run build` / `npm start` — production  

Pas de tests automatisés, pas de CI décrite dans le dépôt à ce stade.

## Limites et chantiers implicites

1. **IDs WCL** (zones, encounters) à caler sur la réalité du jeu / WCL.  
2. **Analyser** : compléter le chemin WCL avec des **logs / parses de la guilde** sur le boss ou donjon choisi.  
3. **Roster** : optionnellement enrichir chaque ligne avec WCL (coût API / rate limits).  
4. **`/api/blizzard/guild`** utilise `NEXT_PUBLIC_GUILD_NAME` ; **`data.js`** utilise surtout **`NEXT_PUBLIC_GUILD_DISPLAY_NAME`** pour le slug — vérifier la cohérence avec le nom exact attendu par Blizzard.  
5. **`performance.dps` / `hps`** : souvent **0** dans les flux live (réservé ou à brancher sur WCL/détails combat).

---

Ce fichier décrit l’état **actuel du code** ; le **README** reste l’entrée « utilisateur » (installation, déploiement, liens).
