export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { fetchPlayerData } from '@/lib/data'
import { WOW_CLASSES, RAIDS, DUNGEONS, getParseColor, getRatingColor } from '@/lib/constants'

async function getPlayerData(name) {
  return fetchPlayerData(name)
}

function StatBox({ label, value, color }) {
  return (
    <div className="card p-4 text-center">
      <div className="text-xs text-void-400 mb-1">{label}</div>
      <div className="text-2xl font-bold" style={{ color: color || '#dde4f0' }}>{value}</div>
    </div>
  )
}

export default async function PlayerPage({ params }) {
  const player = await getPlayerData(params.name)

  if (!player) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-64 gap-4">
        <div className="text-4xl">🔍</div>
        <div className="text-void-300 text-lg">Joueur introuvable : {params.name}</div>
        <Link href="/" className="text-arcane-400 hover:text-arcane-300 text-sm">
          ← Retour au roster
        </Link>
      </div>
    )
  }

  const cls          = WOW_CLASSES[player.classID]
  const ratingColor  = getRatingColor(player.mythicRating)
  const parseColor   = getParseColor(player.wcl.best)
  const totalKills   = Object.values(player.raidProgress).reduce((s, p) => s + p.killed, 0)
  const totalBosses  = Object.values(player.raidProgress).reduce((s, p) => s + p.total, 0)

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* Back */}
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-void-400 hover:text-void-200 mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Roster
      </Link>

      {/* Hero */}
      <div
        className="card p-6 mb-6"
        style={{ borderLeftWidth: 4, borderLeftColor: cls?.color || '#1a2644' }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-3xl font-bold mb-1" style={{ color: cls?.color || '#fff' }}>
              {player.name}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-void-400 text-sm">{player.spec} {cls?.name}</span>
              <span className="text-void-600">·</span>
              <span className="text-void-400 text-sm">{player.realm} — {player.region.toUpperCase()}</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="badge" style={{ backgroundColor: 'rgba(200,155,60,0.15)', color: '#c89b3c', border: '1px solid rgba(200,155,60,0.3)' }}>
              {player.role === 'TANK' ? '🛡️ Tank' : player.role === 'HEALER' ? '✚ Soigneur' : '⚔️ DPS'}
            </span>
            {player.weeklyKey && (
              <span className={`badge ${player.weeklyKey.inTime ? 'text-green-400' : 'text-red-400'}`}
                    style={{ backgroundColor: player.weeklyKey.inTime ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)',
                             border: player.weeklyKey.inTime ? '1px solid rgba(74,222,128,0.3)' : '1px solid rgba(248,113,113,0.3)' }}>
                {player.weeklyKey.inTime ? '✓' : '✗'} +{player.weeklyKey.level} {player.weeklyKey.dungeon}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatBox label="Item Level" value={player.itemLevel} />
        <StatBox label="M+ Rating" value={player.mythicRating.toLocaleString()} color={ratingColor} />
        <StatBox label="Best Parse" value={`${player.wcl.best}%`} color={parseColor} />
        <StatBox label="Boss Kills" value={`${totalKills}/${totalBosses}`} color="#c89b3c" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Raid Progression */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gold-500 mb-4">
            Progression Raid Mythique
          </h2>
          <div className="space-y-4">
            {RAIDS.map(raid => {
              const prog  = player.raidProgress[raid.id] || { killed: 0, total: raid.bosses.length }
              const pct   = Math.round((prog.killed / prog.total) * 100)
              const color = pct === 100 ? '#c89b3c' : pct >= 60 ? '#8b5cf6' : '#3b82f6'
              return (
                <div key={raid.id} className="card p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <div className="font-semibold text-void-100 text-sm">{raid.name}</div>
                      <div className="text-xs text-void-500 mt-0.5">Mythique</div>
                    </div>
                    <span className="font-bold text-sm" style={{ color }}>
                      {prog.killed}/{prog.total}
                    </span>
                  </div>
                  {/* Boss dots */}
                  <div className="flex gap-1.5 flex-wrap mb-2">
                    {raid.bosses.map((boss, i) => (
                      <div
                        key={boss.id}
                        className="w-5 h-5 rounded flex items-center justify-center text-xs"
                        style={{
                          backgroundColor: i < prog.killed ? `${color}22` : '#0f1730',
                          border: `1px solid ${i < prog.killed ? color : '#1a2644'}`,
                          color: i < prog.killed ? color : '#4a5572',
                        }}
                        title={boss.name}
                      >
                        {i < prog.killed ? '✓' : i + 1}
                      </div>
                    ))}
                  </div>
                  <div className="h-1 bg-void-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* M+ Best Keys */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-arcane-400 mb-4">
            Meilleurs Keys Mythic+
          </h2>
          <div className="card p-4 mb-4">
            <div className="text-center mb-3">
              <div className="text-xs text-void-400 mb-1">Score saisonnier</div>
              <div className="text-3xl font-bold" style={{ color: ratingColor }}>
                {player.mythicRating.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {DUNGEONS.map(dungeon => {
              const level = player.bestKeys[dungeon.id] || 0
              const maxLevel = 26
              const pct = Math.round((level / maxLevel) * 100)
              const color = level >= 20 ? '#c89b3c' : level >= 17 ? '#8b5cf6' : level >= 14 ? '#0070dd' : '#4ade80'
              return (
                <div key={dungeon.id} className="card p-3 flex items-center gap-3">
                  <div className="w-10 text-center">
                    <span className="font-bold text-sm" style={{ color }}>+{level}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-void-200 truncate">{dungeon.name}</span>
                      <span className="text-xs text-void-500 ml-2 flex-shrink-0">{dungeon.short}</span>
                    </div>
                    <div className="h-1 bg-void-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* WCL Performance */}
      <div className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-void-400 mb-4">
          Performance WarcraftLogs
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Meilleur parse',  value: player.wcl.best,   color: getParseColor(player.wcl.best)   },
            { label: 'Parse médian',    value: player.wcl.median, color: getParseColor(player.wcl.median) },
            { label: 'Total kills',     value: player.wcl.kills,  color: '#c89b3c'                         },
          ].map(stat => (
            <div key={stat.label} className="card p-4 text-center">
              <div className="text-xs text-void-400 mb-2">{stat.label}</div>
              <div className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
              {typeof stat.value === 'number' && stat.value <= 100 && (
                <div className="mt-2 h-1 bg-void-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${stat.value}%`, backgroundColor: stat.color }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* WCL Link */}
      <div className="mt-6 flex gap-3">
        <a
          href={`https://www.warcraftlogs.com/character/${player.region}/${player.realm}/${player.name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                     bg-arcane-600/20 text-arcane-300 border border-arcane-600/30
                     hover:bg-arcane-600/30 transition-colors"
        >
          Voir sur WarcraftLogs ↗
        </a>
        <a
          href={`https://raider.io/characters/${player.region}/${player.realm}/${player.name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                     bg-void-800 text-void-300 border border-void-700
                     hover:bg-void-700 transition-colors"
        >
          Voir sur Raider.IO ↗
        </a>
      </div>

    </div>
  )
}
