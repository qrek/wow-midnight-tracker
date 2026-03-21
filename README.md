# 🌙 Midnight Tracker

Dashboard de guilde pour **WoW Midnight Saison 1** — suivi de progression raid, rankings M+, et analyse de logs comparée au top mondial.

## Fonctionnalités

- **Roster** — Vue d'ensemble des membres de la guilde avec ilvl, rating M+, parses WCL et progression raid
- **Fiche Profil** — Page détaillée par joueur : progression boss par boss, meilleurs keys M+, stats WCL
- **Comparer** — Face-à-face entre deux membres : DPS/HPS, M+ rating, parses, raids
- **Analyser** — Compare les logs de la guilde sur un boss/donjon avec le top mondial par classe/spec (ou un joueur précis)

## Stack

- **Next.js 14** (App Router) — frontend + API routes serveur
- **Tailwind CSS** — styling dark void/elven theme
- **WarcraftLogs API v2** (GraphQL) — logs et rankings
- **Blizzard Battle.net API** — profils, ilvl, M+, raids

## Démarrage rapide

### 1. Cloner et installer

```bash
git clone https://github.com/TON_USERNAME/wow-midnight-tracker.git
cd wow-midnight-tracker
npm install
```

### 2. Configurer les variables d'environnement

```bash
cp .env.local.example .env.local
```

Édite `.env.local` avec tes credentials :

**WarcraftLogs API :**
1. Va sur [warcraftlogs.com/api/clients](https://www.warcraftlogs.com/api/clients/)
2. Crée un nouveau client sans cocher le type public
3. Copie `client_id` et `client_secret` dans `.env.local`

**Blizzard API :**
1. Va sur [develop.battle.net/access/clients](https://develop.battle.net/access/clients)
2. Crée un client (type : "Confidential")
3. Copie `client_id` et `client_secret` dans `.env.local`

**Config guilde :**
```
NEXT_PUBLIC_GUILD_NAME=NomDeGuilde
NEXT_PUBLIC_GUILD_REALM=ton-serveur
NEXT_PUBLIC_GUILD_REGION=eu
NEXT_PUBLIC_GUILD_DISPLAY_NAME=Nom Affiché
```

> **Sans credentials** : l'app fonctionne avec des données mock (guilde "Void Covenant")

### 3. Lancer en local

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000)

## Déploiement sur Vercel

### Option 1 — Via GitHub (recommandé)

1. Push sur GitHub :
```bash
git add .
git commit -m "Initial commit"
git push
```

2. Va sur [vercel.com](https://vercel.com), connecte ton repo GitHub
3. Ajoute tes variables d'environnement dans **Settings → Environment Variables**
4. Deploy !

### Option 2 — Vercel CLI

```bash
npm i -g vercel
vercel
```

## Mise à jour des IDs WCL

Quand WoW Midnight sera sorti, mets à jour les encounter IDs dans `src/lib/constants.js` :

```js
// Trouve les vrais IDs sur warcraftlogs.com
export const RAIDS = [
  { id: ZONE_ID_REEL, bosses: [{ id: ENCOUNTER_ID_REEL, name: '...' }] }
]
```

## Structure du projet

```
src/
├── app/
│   ├── page.jsx              → Roster guilde
│   ├── player/[name]/        → Fiche joueur
│   ├── compare/              → Comparaison 2 joueurs
│   ├── analysis/             → Analyse logs vs top mondial
│   └── api/
│       ├── wcl/              → Proxy WarcraftLogs (credentials cachés)
│       └── blizzard/         → Proxy Blizzard API
├── lib/
│   ├── wcl.js                → Client GraphQL WCL
│   ├── blizzard.js           → Client Blizzard API
│   ├── constants.js          → Classes, raids, donjons S1
│   └── mock-data.js          → Données de démo
└── components/
    └── Nav.jsx               → Navigation sidebar
```
