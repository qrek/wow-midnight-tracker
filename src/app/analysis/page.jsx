'use client'
import { useState, useEffect } from 'react'
import { WOW_CLASSES, RAIDS, DUNGEONS, getParseColor } from '@/lib/constants'

const CLASS_SPECS = {
  'Warrior':      { specs: ['Arms', 'Fury'] },
  'Paladin':      { specs: ['Retribution'] },
  'Hunter':       { specs: ['Beast Mastery', 'Marksmanship', 'Survival'] },
  'Rogue':        { specs: ['Assassination', 'Outlaw', 'Subtlety'] },
  'Priest':       { specs: ['Shadow'] },
  'Death Knight': { specs: ['Frost', 'Unholy'] },
  'Shaman':       { specs: ['Elemental', 'Enhancement'] },
  'Mage':         { specs: ['Arcane', 'Fire', 'Frost'] },
  'Warlock':      { specs: ['Affliction', 'Demonology', 'Destruction'] },
  'Monk':         { specs: ['Windwalker'] },
  'Druid':        { specs: ['Balance', 'Feral'] },
  'Demon Hunter': { specs: ['Havoc'] },
  'Evoker':       { specs: ['Devastation', 'Augmentation'] },
}

const TABS = ['Vue d\'ensemble', 'Rotations', 'Mécaniques']

function AmountBar({ amount, max, color, width }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-void-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700"
             style={{ width: `${width}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-mono text-void-300 w-24 text-right">
        {(amount / 1000).toFixed(0)}k
      </span>
    </div>
  )
}

export default function AnalysisPage() {
  // ─── Content selection
  const [contentType,     setContentType]     = useState('raid')   // 'raid' | 'mplus'
  const [selectedRaid,    setSelectedRaid]    = useState(RAIDS[0])
  const [selectedBoss,    setSelectedBoss]    = useState(RAIDS[0].bosses[0])
  const [selectedDungeon, setSelectedDungeon] = useState(DUNGEONS[0])

  // ─── Reference selection
  const [refMode,       setRefMode]       = useState('class')  // 'class' | 'player'
  const [refClass,      setRefClass]      = useState('Mage')
  const [refSpec,       setRefSpec]       = useState('Fire')
  const [refPlayerName, setRefPlayerName] = useState('')
  const [refRealm,      setRefRealm]      = useState('')
  const [refRegion,     setRefRegion]     = useState('EU')

  // ─── Results
  const [results,  setResults]  = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)
  const [activeTab, setActiveTab] = useState(0)

  // Sync spec when class changes
  useEffect(() => {
    const specs = CLASS_SPECS[refClass]?.specs || []
    if (!specs.includes(refSpec)) setRefSpec(specs[0] || '')
  }, [refClass])

  // Sync boss when raid changes
  const handleRaidChange = (raidId) => {
    const raid = RAIDS.find(r => r.id === parseInt(raidId))
    if (raid) {
      setSelectedRaid(raid)
      setSelectedBoss(raid.bosses[0])
    }
  }

  async function runAnalysis() {
    setLoading(true)
    setError(null)
    setResults(null)
    try {
      const body = {
        mode: contentType,
        encounterID: contentType === 'raid' ? selectedBoss.id : selectedDungeon.id,
        className: refMode === 'class' ? refClass : undefined,
        specName:  refMode === 'class' ? refSpec  : undefined,
        difficulty: 5,
        playerName:   refMode === 'player' ? refPlayerName : undefined,
        playerRealm:  refMode === 'player' ? refRealm.toLowerCase().replace(/\s+/g, '-') : undefined,
        playerRegion: refMode === 'player' ? refRegion.toLowerCase() : undefined,
      }
      const res  = await fetch('/api/wcl/analysis', { method: 'POST', body: JSON.stringify(body) })
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setResults(json)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const refAmount = results?.worldTop?.[0]?.amount || 0
  const maxAmount = Math.max(refAmount, ...(results?.guildLogs?.map(l => l.amount) || [0]))

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-void-100 mb-1">Analyse de Logs</h1>
        <p className="text-sm text-void-400">Compare les performances de la guilde avec les meilleurs joueurs mondiaux.</p>
      </div>

      {/* ─── Config Panel ──────────────────────────────────────────────── */}
      <div className="card p-5 mb-6 space-y-5">

        {/* Step 1: Content type */}
        <div>
          <div className="text-xs text-void-400 uppercase tracking-wider mb-3">
            <span className="text-arcane-400 mr-2">01</span>Type de contenu
          </div>
          <div className="flex gap-3">
            {[
              { val: 'raid',  label: '⚔️ Raid Mythique' },
              { val: 'mplus', label: '🗝️ Mythic+'        },
            ].map(opt => (
              <button key={opt.val} onClick={() => setContentType(opt.val)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all
                        ${contentType === opt.val
                          ? 'bg-arcane-600/20 text-arcane-300 border-arcane-600/40'
                          : 'bg-void-900 text-void-400 border-void-700 hover:border-void-600'}`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Boss / Dungeon */}
        <div>
          <div className="text-xs text-void-400 uppercase tracking-wider mb-3">
            <span className="text-arcane-400 mr-2">02</span>
            {contentType === 'raid' ? 'Sélectionner le boss' : 'Sélectionner le donjon'}
          </div>
          {contentType === 'raid' ? (
            <div className="flex gap-3">
              <div className="flex-1">
                <select value={selectedRaid.id} onChange={e => handleRaidChange(e.target.value)}
                        className="w-full bg-void-900 border border-void-700 text-void-100 rounded-lg px-3 py-2.5 text-sm
                                   focus:outline-none focus:border-arcane-600">
                  {RAIDS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <select value={selectedBoss.id} onChange={e => {
                          const boss = selectedRaid.bosses.find(b => b.id === parseInt(e.target.value))
                          if (boss) setSelectedBoss(boss)
                        }}
                        className="w-full bg-void-900 border border-void-700 text-void-100 rounded-lg px-3 py-2.5 text-sm
                                   focus:outline-none focus:border-arcane-600">
                  {selectedRaid.bosses.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            </div>
          ) : (
            <select value={selectedDungeon.id} onChange={e => {
                      const d = DUNGEONS.find(d => d.id === parseInt(e.target.value))
                      if (d) setSelectedDungeon(d)
                    }}
                    className="w-full bg-void-900 border border-void-700 text-void-100 rounded-lg px-3 py-2.5 text-sm
                               focus:outline-none focus:border-arcane-600">
              {DUNGEONS.map(d => <option key={d.id} value={d.id}>{d.name} ({d.short})</option>)}
            </select>
          )}
        </div>

        {/* Step 3: Reference */}
        <div>
          <div className="text-xs text-void-400 uppercase tracking-wider mb-3">
            <span className="text-arcane-400 mr-2">03</span>Joueur de référence
          </div>
          <div className="flex gap-3 mb-3">
            {[
              { val: 'class',  label: '🌍 Top mondial par classe' },
              { val: 'player', label: '🔍 Chercher par nom'       },
            ].map(opt => (
              <button key={opt.val} onClick={() => setRefMode(opt.val)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all
                        ${refMode === opt.val
                          ? 'bg-gold-500/15 text-gold-400 border-gold-500/40'
                          : 'bg-void-900 text-void-400 border-void-700 hover:border-void-600'}`}>
                {opt.label}
              </button>
            ))}
          </div>

          {refMode === 'class' ? (
            <div className="flex gap-3">
              <select value={refClass} onChange={e => setRefClass(e.target.value)}
                      className="flex-1 bg-void-900 border border-void-700 text-void-100 rounded-lg px-3 py-2.5 text-sm
                                 focus:outline-none focus:border-arcane-600">
                {Object.entries(CLASS_SPECS).map(([cls]) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
              <select value={refSpec} onChange={e => setRefSpec(e.target.value)}
                      className="flex-1 bg-void-900 border border-void-700 text-void-100 rounded-lg px-3 py-2.5 text-sm
                                 focus:outline-none focus:border-arcane-600">
                {(CLASS_SPECS[refClass]?.specs || []).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex gap-3">
              <input value={refPlayerName} onChange={e => setRefPlayerName(e.target.value)}
                     placeholder="Nom du joueur"
                     className="flex-1 bg-void-900 border border-void-700 text-void-100 rounded-lg px-3 py-2.5 text-sm
                                placeholder-void-600 focus:outline-none focus:border-arcane-600" />
              <input value={refRealm} onChange={e => setRefRealm(e.target.value)}
                     placeholder="Serveur (ex: tarren-mill)"
                     className="flex-1 bg-void-900 border border-void-700 text-void-100 rounded-lg px-3 py-2.5 text-sm
                                placeholder-void-600 focus:outline-none focus:border-arcane-600" />
              <select value={refRegion} onChange={e => setRefRegion(e.target.value)}
                      className="w-24 bg-void-900 border border-void-700 text-void-100 rounded-lg px-3 py-2.5 text-sm
                                 focus:outline-none focus:border-arcane-600">
                {['EU', 'US', 'TW', 'KR'].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* Launch */}
        <button onClick={runAnalysis} disabled={loading}
                className="w-full py-3 rounded-lg text-sm font-semibold transition-all
                           bg-arcane-600 hover:bg-arcane-500 disabled:opacity-50
                           text-white border border-arcane-500/50">
          {loading ? 'Chargement...' : '⚡ Lancer l\'analyse'}
        </button>
      </div>

      {error && (
        <div className="card p-4 mb-6 border-red-500/30 text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* ─── Results ─────────────────────────────────────────────────── */}
      {results && (
        <div>
          {/* Tabs */}
          <div className="flex gap-1 mb-5 bg-void-900 p-1 rounded-lg w-fit">
            {TABS.map((tab, i) => (
              <button key={tab} onClick={() => setActiveTab(i)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all
                        ${activeTab === i
                          ? 'bg-void-700 text-void-100'
                          : 'text-void-400 hover:text-void-200'}`}>
                {tab}
              </button>
            ))}
          </div>

          {/* Tab 0: Overview */}
          {activeTab === 0 && (
            <div className="space-y-4">
              {/* World Top */}
              <div className="card p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gold-500 mb-4">
                  Top mondial — {refMode === 'class' ? `${refSpec} ${refClass}` : refPlayerName}
                </h3>
                <div className="space-y-2">
                  {results.worldTop?.map(player => (
                    <div key={player.rank} className="flex items-center gap-3 py-2 border-b border-void-800 last:border-0">
                      <span className="text-xs text-void-500 w-5 text-right">#{player.rank}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-void-100">{player.name}</span>
                          <span className="text-xs text-void-500">{player.server} — {player.region}</span>
                        </div>
                        <AmountBar
                          amount={player.amount}
                          max={maxAmount}
                          color="#c89b3c"
                          width={Math.round((player.amount / maxAmount) * 100)}
                        />
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-bold" style={{ color: getParseColor(Math.round(player.rankPercent)) }}>
                          {Math.round(player.rankPercent)}
                        </div>
                        <div className="text-xs text-void-500">parse</div>
                      </div>
                      {player.reportCode && (
                        <a href={`https://www.warcraftlogs.com/reports/${player.reportCode}`}
                           target="_blank" rel="noopener noreferrer"
                           className="text-xs text-arcane-400 hover:text-arcane-300 flex-shrink-0">
                          ↗
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Guild Logs */}
              <div className="card p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-arcane-400 mb-4">
                  Guilde — {contentType === 'raid' ? selectedBoss.name : selectedDungeon.name}
                </h3>
                <div className="space-y-2">
                  {results.guildLogs
                    ?.sort((a, b) => b.amount - a.amount)
                    .map((log, i) => {
                      const cls = WOW_CLASSES[log.classID]
                      const pctVsRef = refAmount ? Math.round((log.amount / refAmount) * 100) : 0
                      return (
                        <div key={i} className="flex items-center gap-3 py-2 border-b border-void-800 last:border-0">
                          <span className="text-xs text-void-500 w-5 text-right">#{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm" style={{ color: cls?.color || '#fff' }}>
                                {log.name}
                              </span>
                              <span className="text-xs text-void-500">{log.spec} {cls?.name}</span>
                            </div>
                            <AmountBar
                              amount={log.amount}
                              max={maxAmount}
                              color={cls?.color || '#60a5fa'}
                              width={Math.round((log.amount / maxAmount) * 100)}
                            />
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-sm font-bold" style={{ color: getParseColor(pctVsRef) }}>
                              {pctVsRef}%
                            </div>
                            <div className="text-xs text-void-500">vs ref</div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          )}

          {/* Tab 1: Rotations */}
          {activeTab === 1 && (
            <div className="card p-6 text-center text-void-400">
              <div className="text-4xl mb-3">🔄</div>
              <div className="font-medium mb-1">Analyse des rotations</div>
              <div className="text-sm">Disponible quand les vraies clés WCL sont configurées.<br />
                L'API WCL retournera le CPM (casts/min) par spell pour chaque joueur.</div>
              <div className="mt-4 text-xs text-void-600 bg-void-900 rounded-lg p-3 text-left">
                Données nécessaires : <code className="text-arcane-400">report.events(type: "cast")</code> via WCL API v2
              </div>
            </div>
          )}

          {/* Tab 2: Mécaniques */}
          {activeTab === 2 && (
            <div className="card p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-void-400 mb-4">
                Mécaniques — {contentType === 'raid' ? selectedBoss.name : selectedDungeon.name}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-void-400 uppercase tracking-wider border-b border-void-800">
                      <th className="pb-3 text-left">Joueur</th>
                      <th className="pb-3 text-center">Morts</th>
                      <th className="pb-3 text-center">Interrupts</th>
                      <th className="pb-3 text-right">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.guildLogs?.map((log, i) => {
                      const cls = WOW_CLASSES[log.classID]
                      return (
                        <tr key={i} className="border-b border-void-900 hover:bg-void-900/30 transition-colors">
                          <td className="py-3 font-medium" style={{ color: cls?.color || '#fff' }}>
                            {log.name}
                          </td>
                          <td className="py-3 text-center">
                            <span className={`font-bold ${log.deaths === 0 ? 'text-green-400' : log.deaths <= 1 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {log.deaths}
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <span className={`font-bold ${log.interrupts >= 5 ? 'text-green-400' : log.interrupts >= 2 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {log.interrupts}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <span className={`badge text-xs ${log.deaths === 0 ? 'text-green-400' : 'text-yellow-400'}`}
                                  style={{ backgroundColor: log.deaths === 0 ? 'rgba(74,222,128,0.12)' : 'rgba(250,204,21,0.12)',
                                           border: log.deaths === 0 ? '1px solid rgba(74,222,128,0.3)' : '1px solid rgba(250,204,21,0.3)' }}>
                              {log.deaths === 0 ? '✓ Clean' : '⚠ À améliorer'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {!results && !loading && (
        <div className="card p-16 text-center text-void-400">
          <div className="text-5xl mb-4">🔍</div>
          <div className="text-lg font-medium mb-2 text-void-300">Prêt à analyser</div>
          <div className="text-sm">Configure les paramètres ci-dessus et lance l'analyse</div>
        </div>
      )}
    </div>
  )
}
