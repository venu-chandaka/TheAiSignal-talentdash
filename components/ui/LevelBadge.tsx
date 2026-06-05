import { LEVEL_COLORS, LEVEL_LABELS } from '@/lib/config'

interface LevelBadgeProps {
  level: string
  size?: 'sm' | 'md'
}

export default function LevelBadge({ level, size = 'md' }: LevelBadgeProps) {
  const colorClass = LEVEL_COLORS[level] ?? 'bg-gray-100 text-gray-700'
  const label = LEVEL_LABELS[level] ?? level
  const sizeClass = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colorClass} ${sizeClass}`}>
      {label}
    </span>
  )
}