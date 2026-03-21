import {
  getParseColor,
  WCL_PARSE_KIND_LABEL,
  WCL_DIFFICULTY_LABEL,
  formatWclThroughput,
} from '@/lib/constants'

function Chip({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium
                  bg-void-800/80 text-void-300 border border-void-600/50 ${className}`}
    >
      {children}
    </span>
  )
}

export function WclPlayerDetail({ wcl }) {
  const parseKind = wcl?.parseKind || 'dps'
  const parseShort = WCL_PARSE_KIND_LABEL[parseKind] || WCL_PARSE_KIND_LABEL.dps
  const unit = parseKind === 'hps' ? 'HPS' : 'DPS'
  const hasMeta =
    (wcl?.zoneIds?.length > 0) ||
    wcl?.difficulty != null ||
    wcl?.size != null ||
    wcl?.metric ||
    wcl?.partition != null
  const allStars = Array.isArray(wcl?.allStars) ? wcl.allStars : []
  const encounters = Array.isArray(wcl?.encounters) ? wcl.encounters : []

  return (
    <div className="mt-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-void-400 mb-4">
        Performance WarcraftLogs
      </h2>

      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-4">
        {[
          { label: `Meilleur parse (${parseShort})`, value: wcl?.best, color: getParseColor(wcl?.best || 0) },
          { label: 'Parse médian', value: wcl?.median, color: getParseColor(wcl?.median || 0) },
          { label: 'Total kills (boss)', value: wcl?.kills, color: '#c89b3c' },
        ].map(stat => (
          <div key={stat.label} className="card p-4 text-center">
            <div className="text-xs text-void-400 mb-2">{stat.label}</div>
            <div className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
            {typeof stat.value === 'number' && stat.value <= 100 && stat.label.toLowerCase().includes('parse') && (
              <div className="mt-2 h-1 bg-void-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${stat.value}%`, backgroundColor: stat.color }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {(wcl?.bestPerformanceRaw != null || wcl?.medianPerformanceRaw != null) && (
        <div className="card p-3 mb-4 text-xs text-void-500 flex flex-wrap gap-x-6 gap-y-1 justify-center">
          {wcl.bestPerformanceRaw != null && (
            <span>
              Moyenne perf. WCL (brute) :{' '}
              <span className="text-void-300 font-mono">{wcl.bestPerformanceRaw.toFixed(2)}%</span>
            </span>
          )}
          {wcl.medianPerformanceRaw != null && (
            <span>
              Médiane perf. (brute) :{' '}
              <span className="text-void-300 font-mono">{wcl.medianPerformanceRaw.toFixed(2)}%</span>
            </span>
          )}
        </div>
      )}

      {hasMeta && (
        <div className="flex flex-wrap gap-2 mb-4">
          {wcl.zoneIds?.map(zid => (
            <Chip key={zid}>Zone {zid}</Chip>
          ))}
          {wcl.difficulty != null && (
            <Chip>{WCL_DIFFICULTY_LABEL[wcl.difficulty] ?? `Diff. ${wcl.difficulty}`}</Chip>
          )}
          {wcl.size != null && <Chip>Raid {wcl.size}</Chip>}
          {wcl.metric && <Chip className="uppercase">{String(wcl.metric)}</Chip>}
          {wcl.partition != null && <Chip>Partition {wcl.partition}</Chip>}
        </div>
      )}

      {allStars.length > 0 && (
        <div className="card overflow-hidden mb-4">
          <div className="px-4 py-2.5 border-b border-void-700 text-xs font-semibold uppercase tracking-wider text-gold-500/90">
            All Stars (zone)
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-void-800 text-void-500">
                  <th className="py-2 pl-4 font-medium">Spé</th>
                  <th className="py-2 font-medium">Points</th>
                  <th className="py-2 font-medium">Parse %</th>
                  <th className="py-2 font-medium">Rang</th>
                  <th className="py-2 font-medium">Région</th>
                  <th className="py-2 pr-4 font-medium text-right">Serveur</th>
                </tr>
              </thead>
              <tbody className="text-void-200">
                {allStars.map((row, i) => (
                  <tr key={i} className="border-b border-void-800/60 hover:bg-void-800/30">
                    <td className="py-2 pl-4">{row.spec ?? '—'}</td>
                    <td className="py-2 font-mono">
                      {row.points != null && row.possiblePoints != null
                        ? `${row.points.toFixed(0)} / ${row.possiblePoints}`
                        : '—'}
                    </td>
                    <td className="py-2">
                      {row.rankPercent != null ? (
                        <span style={{ color: getParseColor(Math.min(100, row.rankPercent)) }}>
                          {row.rankPercent.toFixed(1)}%
                        </span>
                      ) : '—'}
                    </td>
                    <td className="py-2 font-mono text-void-400">
                      {row.rank != null ? `#${row.rank.toLocaleString()} / ${row.total?.toLocaleString() ?? '—'}` : '—'}
                    </td>
                    <td className="py-2 font-mono text-void-400">
                      {row.regionRank != null ? `#${row.regionRank.toLocaleString()}` : '—'}
                    </td>
                    <td className="py-2 pr-4 text-right font-mono text-void-400">
                      {row.serverRank != null ? `#${row.serverRank.toLocaleString()}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {encounters.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-4 py-2.5 border-b border-void-700 text-xs font-semibold uppercase tracking-wider text-arcane-400/90">
            Parses par boss
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-void-800 text-void-500">
                  <th className="py-2 pl-4 font-medium">Boss</th>
                  <th className="py-2 font-medium">Parse</th>
                  <th className="py-2 font-medium">Médian</th>
                  <th className="py-2 font-medium">Kills</th>
                  <th className="py-2 font-medium">{unit}</th>
                  <th className="py-2 font-medium">Spé</th>
                  <th className="py-2 pr-4 font-medium">All Stars</th>
                </tr>
              </thead>
              <tbody className="text-void-200">
                {encounters.map((row, i) => {
                  const pct = row.rankPercent
                  const col = pct != null ? getParseColor(Math.min(100, pct)) : '#9d9d9d'
                  const as = row.allStars
                  return (
                    <tr
                      key={`${row.encounterId ?? i}-${row.name}`}
                      className={`border-b border-void-800/60 hover:bg-void-800/30 ${row.lockedIn ? 'opacity-60' : ''}`}
                    >
                      <td className="py-2 pl-4 max-w-[140px]">
                        <span className="text-void-100">{row.name}</span>
                        {row.lockedIn && (
                          <span className="ml-1 text-[10px] text-void-600">(verrouillé)</span>
                        )}
                      </td>
                      <td className="py-2" style={{ color: col }}>
                        {pct != null ? `${pct.toFixed(1)}%` : '—'}
                      </td>
                      <td className="py-2 text-void-400">
                        {row.medianPercent != null ? `${row.medianPercent.toFixed(1)}%` : '—'}
                      </td>
                      <td className="py-2 font-mono text-void-400">{row.totalKills}</td>
                      <td className="py-2 font-mono text-void-300">
                        {row.bestAmount != null ? formatWclThroughput(row.bestAmount, parseKind) : '—'}
                      </td>
                      <td className="py-2 text-void-500">{row.spec ?? '—'}</td>
                      <td className="py-2 pr-4">
                        {as?.rankPercent != null ? (
                          <span style={{ color: getParseColor(Math.min(100, as.rankPercent)) }}>
                            {as.rankPercent.toFixed(1)}%
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {wcl?.best === 0 && wcl?.median === 0 && !allStars.length && !encounters.length && (
        <p className="text-sm text-void-500 text-center py-4">
          Aucun détail WCL pour cette saison / métrique (zone ou personnage sans log public).
        </p>
      )}
    </div>
  )
}
