import { LEVEL_COLORS, LEVEL_LABELS } from '@/lib/config'

interface LevelDistributionBarProps {
  distribution: Record<string, number>
  total: number
}

export default function LevelDistributionBar({ distribution, total }: LevelDistributionBarProps) {
  const entries = Object.entries(distribution).sort((a, b) => b[1] - a[1])

  return (
    <div className="space-y-3">
      {/* Stacked bar */}
      <div className="flex h-4 rounded-full overflow-hidden w-full bg-border">
        {entries.map(([level, count]) => {
          const pct = total > 0 ? (count / total) * 100 : 0
          const color = LEVEL_COLORS[level]?.includes('slate') ? '#94a3b8'
            : LEVEL_COLORS[level]?.includes('blue') ? '#3b82f6'
            : LEVEL_COLORS[level]?.includes('indigo') ? '#6366f1'
            : LEVEL_COLORS[level]?.includes('purple') ? '#a855f7'
            : LEVEL_COLORS[level]?.includes('navy') ? '#1e3a5f'
            : LEVEL_COLORS[level]?.includes('orange') ? '#f97316'
            : LEVEL_COLORS[level]?.includes('rose') ? '#f43f5e'
            : '#94a3b8'
          return (
            <div
              key={level}
              style={{ width: `${pct}%`, backgroundColor: color }}
              title={`${LEVEL_LABELS[level] ?? level}: ${count} records (${pct.toFixed(0)}%)`}
            />
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {entries.map(([level, count]) => {
          const pct = total > 0 ? ((count / total) * 100).toFixed(0) : '0'
          return (
            <div key={level} className="flex items-center gap-1.5 text-xs text-body-text">
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${LEVEL_COLORS[level]?.split(' ')[0] ?? 'bg-gray-300'}`} />
              <span className="font-medium">{LEVEL_LABELS[level] ?? level}</span>
              <span className="text-muted">({pct}%)</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}