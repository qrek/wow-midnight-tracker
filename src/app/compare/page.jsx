'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { WOW_CLASSES, RAIDS, DUNGEONS, getParseColor, getRatingColor } from '@/lib/constants'

function PlayerSelect({ label, members, value, onChange }) {
  return (
    <div className="flex-1">
      <label className="block text-xs text-void-400 mb-2 uppercase tracking-wider">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-void-900 border border-void-700 text-void-100 rounded-lg px-3 py-2.5 text-sm
                   focus:outline-none focus:border-arcane-600 focus:ring-1 focus:ring-arcane-600/30"
      >
        <option value="">— Sélectionner un joueur —</option>
        {members.map(m => (
          <option key={m.id} value={m.name}>
            [{m.role === 'TANK' ? '🛡' : m.role === 'HEALER' ? '✚' : '⚔'}] {m.name} — {m.spec} {WOW_CLASSES[m.classID]?.name}
          </option>
        ))}
      </select>
    </div>
  )
}

function CompareBar({ label, val1, val2, max, color1, color2, suffix = '' }) {
  const pct1 = Math.round((val1 / max) * 100)
  const pct2 = Math.round((val2 / max) * 100)
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs text-void-400 mb-1.5">
        <span className="font-medium" style={{ color: color1 }}>{(val1 || 0).toLocaleString()}{suffix}</span>
        <span className="text-void-500">{label}</span>
        <span className="font-medium" style={{ color: color2 }}>{(val2 || 0).toLocaleString()}{suffix}</span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden bg-void-800 gap-0.5">
        <div className="flex justify-end flex-1">
          <div className="h-full rounded-l-full" style={{ width: `${pct1}%`, backgroundColor: color1 }} />
        </div>
        <div className="w-px bg-void-700 flex-shrink-0" />
        <div className="flex-1">
          <div className="h-full rounded-r-full" style={{ width: `${pct2}%`, backgroundColor: color2 }} />
        </div>
      </div>
    </div>
  )
}

export default function ComparePage() {
  const [members, setMembers]   = useState([])
  const [p1Name,  setP1Name]    = useState('')
  const [p2Name,  setP2Name]    = useState('')
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    fetch('/api/wcl/guild')
      .then(r => r.json())
      .then(json => {
        setMembers(json.data?.members || [])
        setLoading(false)
      })
  }, [])

  const p1 = members.find(m => m.name === p1Name) || null
  const p2 = members.find(m => m.name === p2Name) || null

  const cls1 = p1 ? WOW_CLASSES[p1.classID] : null
  const cls2 = p2 ? WOW_CLASSES[p2.classID] : null

  const maxRating = Math.max(p1?.mythicRating || 0, p2?.mythicRating || 0, 3500)
  const maxDPS    = Math.max(p1?.performance?.dps || 0, p2?.performance?.dps || 0, 500000)
  const maxHPS    = Math.max(p1?.performance?.hps || 0, p2?.performance?.hps || 0, 150000)

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <div className="shimmer w-32 h-8 rounded" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-void-100 mb-1">Comparer des joueurs</h1>
        <p className="text-sm text-void-400">Sélectionne deux membres de la guilde pour les comparer.</p>
      </div>

      {/* Selectors */}
      <div className="card p-5 mb-6">
        <div className="flex gap-4 items-end flex-wrap">
          <PlayerSelect label="Joueur 1" members={members} value={p1Name} onChange={setP1Name} />
          <div className="flex items-center justify-center w-8 h-9 text-void-500 font-bold text-lg">VS</div>
          <PlayerSelect label="Joueur 2" members={members} value={p2Name} onChange={setP2Name} />
        </div>
      </div>

      {/* Comparison */}
      {p1 && p2 ? (
        <>
          {/* Player headers */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[{ p, cls }, { p: p2, cls: cls2 }].map(({ p, cls }, i) => (
              <div key={i} className="card p-4" style={{ borderLeftWidth: 3, borderLeftColor: cls?.color || '#1a2644' }}>
                <Link href={`/player/${p.name.toLowerCase()}`}
                      className="font-bold text-lg hover:text-gold-400 transition-colors"
                      style={{ color: cls?.color || '#fff' }}>
                  {p.name}
                </Link>
                <div className="text-sm text-void-400 mt-0.5">{p.spec} {cls?.name}</div>
                <div className="text-xs text-void-500 mt-1">{p.realm} — ilvl {p.itemLevel}</div>
              </div>
            ))}
          </div>

          {/* Stats comparaison */}
          <div className="card p-5 mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-void-400 mb-4">Statistiques générales</h2>

            <CompareBar
              label="M+ Rating"
              val1={p1.mythicRating} val2={p2.mythicRating}
              max={maxRating}
              color1={getRatingColor(p1.mythicRating)}
              color2={getRatingColor(p2.mythicRating)}
            />
            <CompareBar
              label="Meilleur parse WCL (HPS ou DPS selon rôle)"
              val1={p1.wcl.best} val2={p2.wcl.best}
              max={100}
              color1={getParseColor(p1.wcl.best)}
              color2={getParseColor(p2.wcl.best)}
              suffix="%"
            />
            <CompareBar
              label="Parse médian"
              val1={p1.wcl.median} val2={p2.wcl.median}
              max={100}
              color1={getParseColor(p1.wcl.median)}
              color2={getParseColor(p2.wcl.median)}
              suffix="%"
            />
            {(p1.performance?.dps > 0 || p2.performance?.dps > 0) && (
              <CompareBar
                label="DPS"
                val1={p1.performance.dps} val2={p2.performance.dps}
                max={maxDPS}
                color1={cls1?.color || '#f87171'}
                color2={cls2?.color || '#f87171'}
              />
            )}
            {(p1.performance?.hps > 0 || p2.performance?.hps > 0) && (
              <CompareBar
                label="HPS"
                val1={p1.performance.hps} val2={p2.performance.hps}
                max={maxHPS}
                color1={cls1?.color || '#4ade80'}
                color2={cls2?.color || '#4ade80'}
              />
            )}
          </div>

          {/* Raid progress */}
          <div className="card p-5 mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-void-400 mb-4">Progression Raid</h2>
            <div className="space-y-3">
              {RAIDS.map(raid => {
                const prog1 = p1.raidProgress[raid.id] || { killed: 0, total: raid.bosses.length }
                const prog2 = p2.raidProgress[raid.id] || { killed: 0, total: raid.bosses.length }
                return (
                  <div key={raid.id} className="flex items-center gap-3">
                    <span className="text-xs text-void-400 w-32 truncate">{raid.name}</span>
                    <div className="flex-1">
                      <CompareBar
                        label=""
                        val1={prog1.killed} val2={prog2.killed}
                        max={prog1.total}
                        color1={cls1?.color || '#60a5fa'}
                        color2={cls2?.color || '#f87171'}
                        suffix={`/${prog1.total}`}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* M+ Keys */}
          <div className="card p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-void-400 mb-4">Meilleurs Keys M+</h2>
            <div className="space-y-2">
              {DUNGEONS.map(dungeon => {
                const k1 = p1.bestKeys?.[dungeon.id] || 0
                const k2 = p2.bestKeys?.[dungeon.id] || 0
                const winner = k1 > k2 ? 1 : k2 > k1 ? 2 : 0
                return (
                  <div key={dungeon.id} className="flex items-center gap-3 py-1">
                    <span className="text-xs text-void-400 w-40 truncate">{dungeon.name}</span>
                    <span className={`text-sm font-bold w-8 text-right ${winner === 1 ? 'text-green-400' : 'text-void-300'}`}>+{k1}</span>
                    <div className="flex-1 flex justify-center">
                      <span className="text-xs text-void-600">vs</span>
                    </div>
                    <span className={`text-sm font-bold w-8 ${winner === 2 ? 'text-green-400' : 'text-void-300'}`}>+{k2}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="card p-12 text-center text-void-400">
          <div className="text-4xl mb-3">📊</div>
          <div>Sélectionne deux joueurs pour lancer la comparaison</div>
        </div>
      )}
    </div>
  )
}
