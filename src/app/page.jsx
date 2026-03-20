export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { fetchGuildData } from '@/lib/data'
import { WOW_CLASSES, RAIDS, DUNGEONS, getParseColor, getRatingColor } from '@/lib/constants'

async function getGuildData() {
  return fetchGuildData()
}

function ClassBadge({ classID, spec }) {
  const cls = WOW_CLASSES[classID]
  return (
    <span className="text-xs font-medium" style={{ color: cls?.color || '#fff' }}>
      {spec} {cls?.name}
    </span>
  )
}

function RoleBadge({ role }) {
  const meta = {
    TANK:   { label: 'Tank',     bg: 'rgba(96,165,250,0.12)',  color: '#60a5fa', border: 'rgba(96,165,250,0.3)'  },
    HEALER: { label: 'Soigneur', bg: 'rgba(74,222,128,0.12)',  color: '#4ade80', border: 'rgba(74,222,128,0.3)'  },
    DPS:    { label: 'DPS',      bg: 'rgba(248,113,113,0.12)', color: '#f87171', border: 'rgba(248,113,113,0.3)' },
  }[role]
  return (
    <span className="badge text-xs" style={{ backgroundColor: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
      {meta.label}
    </span>
  )
}

function ParseBar({ value, max = 100 }) {
  const color = getParseColor(value)
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-void-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${(value / max) * 100}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-bold w-7 text-right" style={{ color }}>{value}</span>
    </div>
  )
}

function RaidProgressDots({ progress }) {
  return (
    <div className="space-y-1">
      {[
        { key: 'mythic', label: 'M', labelColor: '#a78bfa' },
        { key: 'heroic', label: 'H', labelColor: '#60a5fa' },
        { key: 'normal', label: 'N', labelColor: '#4ade80' },
      ].map(({ key, label, labelColor }) => (
        <div key={key} className="flex items-center gap-1.5">
          <span className="text-[9px] font-bold w-3 flex-shrink-0" style={{ color: labelColor }}>{label}</span>
          <div className="flex items-center gap-0.5">
            {RAIDS.map(raid => {
              const p = progress[raid.id]?.[key]
              const ratio = p ? p.killed / p.total : 0
              const color = key === 'mythic'
                ? (ratio === 1 ? '#c89b3c' : ratio >= 0.5 ? '#a78bfa' : ratio > 0 ? '#7c3aed' : '#1a2644')
                : key === 'heroic'
                ? (ratio === 1 ? '#c89b3c' : ratio >= 0.5 ? '#60a5fa' : ratio > 0 ? '#3b82f6' : '#1a2644')
                : (ratio === 1 ? '#c89b3c' : ratio >= 0.5 ? '#4ade80' : ratio > 0 ? '#86efac' : '#1a2644')
              return (
                <div
                  key={raid.id}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color }}
                  title={`${raid.shortName} ${label}: ${p?.killed || 0}/${p?.total || 0}`}
                />
              )
            })}
          </div>
          <span className="text-[9px] text-void-600">
            {RAIDS.reduce((sum, r) => sum + (progress[r.id]?.[key]?.killed || 0), 0)}/
            {RAIDS.reduce((sum, r) => sum + (progress[r.id]?.[key]?.total  || 0), 0)}
          </span>
        </div>
      ))}
    </div>
  )
}

function PlayerCard({ player }) {
  const cls = WOW_CLASSES[player.classID]
  const ratingColor = getRatingColor(player.mythicRating)

  return (
    <Link href={`/player/${player.name.toLowerCase()}`}>
      <div className="card p-4 cursor-pointer group hover:scale-[1.01] transition-transform duration-200"
           style={{ borderLeftColor: cls?.color || '#1a2644', borderLeftWidth: 3 }}>

        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="font-bold text-void-100 text-base group-hover:text-gold-400 transition-colors">
              {player.name}
            </div>
            <ClassBadge classID={player.classID} spec={player.spec} />
          </div>
          <RoleBadge role={player.role} />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center">
            <div className="text-xs text-void-400 mb-0.5">ilvl</div>
            <div className="text-sm font-bold text-void-100">{player.itemLevel}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-void-400 mb-0.5">M+</div>
            <div className="text-sm font-bold" style={{ color: ratingColor }}>
              {player.mythicRating.toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-void-400 mb-0.5">Kills</div>
            <div className="text-sm font-bold text-void-100">{player.wcl.kills}</div>
          </div>
        </div>

        {/* WCL parse */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-void-400 mb-1">
            <span>Meilleur parse WCL</span>
            <span className="text-void-500">Médian: {player.wcl.median}</span>
          </div>
          <ParseBar value={player.wcl.best} />
        </div>

        {/* Raid progress */}
        <div>
          <div className="text-xs text-void-500 mb-1.5">Progression raid</div>
          <RaidProgressDots progress={player.raidProgress} />
        </div>

        {/* Weekly key */}
        {player.weeklyKey && (
          <div className="mt-3 pt-3 border-t border-void-800 flex items-center justify-between">
            <span className="text-xs text-void-500">Clé semaine</span>
            <span className={`text-xs font-medium ${player.weeklyKey.inTime ? 'text-green-400' : 'text-red-400'}`}>
              +{player.weeklyKey.level} {player.weeklyKey.dungeon}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}

export default async function RosterPage() {
  const guild = await getGuildData()

  const tanks   = guild.members.filter(m => m.role === 'TANK')
  const healers = guild.members.filter(m => m.role === 'HEALER')
  const dps     = guild.members.filter(m => m.role === 'DPS')

  const avgRating = Math.round(guild.members.reduce((s, m) => s + m.mythicRating, 0) / guild.members.length)
  const avgParse  = Math.round(guild.members.reduce((s, m) => s + m.wcl.best,    0) / guild.members.length)

  // Best overall raid progress (mythic)
  const bestProgress = guild.members.reduce((best, m) => {
    const total = Object.values(m.raidProgress).reduce((s, p) => s + (p.mythic?.killed || 0), 0)
    return total > best ? total : best
  }, 0)

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Guild Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-void-100">{guild.displayName}</h1>
          <span className="badge" style={{ backgroundColor: 'rgba(200,155,60,0.15)', color: '#c89b3c', border: '1px solid rgba(200,155,60,0.3)' }}>
            {guild.realm} — {guild.region}
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm text-void-400">
          <span>{guild.members.length} membres</span>
          <span>M+ moyen : <strong className="text-void-200">{avgRating.toLocaleString()}</strong></span>
          <span>Parse moyen : <strong className="text-void-200">{avgParse}</strong></span>
        </div>
      </div>

      {/* Raid Progress Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {RAIDS.map(raid => {
          const members = guild.members.filter(m => m.raidProgress[raid.id])
          const bestMythic = Math.max(...members.map(m => m.raidProgress[raid.id]?.mythic?.killed || 0))
          const bestHeroic = Math.max(...members.map(m => m.raidProgress[raid.id]?.heroic?.killed || 0))
          const bestNormal = Math.max(...members.map(m => m.raidProgress[raid.id]?.normal?.killed || 0))
          const total = raid.bosses.length
          const pctM = Math.round((bestMythic / total) * 100)
          const pctH = Math.round((bestHeroic / total) * 100)
          const pctN = Math.round((bestNormal / total) * 100)
          return (
            <div key={raid.id} className="card p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="font-semibold text-void-100 text-sm">{raid.name}</div>
              </div>
              {/* Normal */}
              <div className="mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-green-400">Normal</span>
                  <span className="text-[10px] font-bold text-green-400">{bestNormal}/{total}</span>
                </div>
                <div className="h-1.5 bg-void-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pctN}%`, backgroundColor: pctN === 100 ? '#c89b3c' : '#4ade80' }} />
                </div>
              </div>
              {/* Heroic */}
              <div className="mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-blue-400">Héroïque</span>
                  <span className="text-[10px] font-bold text-blue-400">{bestHeroic}/{total}</span>
                </div>
                <div className="h-1.5 bg-void-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pctH}%`, backgroundColor: pctH === 100 ? '#c89b3c' : '#60a5fa' }} />
                </div>
              </div>
              {/* Mythic */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-purple-400">Mythique</span>
                  <span className="text-[10px] font-bold text-purple-400">{bestMythic}/{total}</span>
                </div>
                <div className="h-1.5 bg-void-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pctM}%`, backgroundColor: pctM === 100 ? '#c89b3c' : pctM >= 50 ? '#8b5cf6' : '#3b82f6' }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Roster by role */}
      {[
        { label: 'Tanks', members: tanks, color: '#60a5fa' },
        { label: 'Soigneurs', members: healers, color: '#4ade80' },
        { label: 'DPS', members: dps, color: '#f87171' },
      ].map(section => (
        <div key={section.label} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: section.color }}>
              {section.label}
            </h2>
            <span className="text-xs text-void-600">{section.members.length}</span>
            <div className="flex-1 h-px bg-void-800" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {section.members.map(player => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
