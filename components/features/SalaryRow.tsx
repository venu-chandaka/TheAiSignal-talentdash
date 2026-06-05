import LevelBadge from '@/components/ui/LevelBadge'
import { formatINR, formatUSD, convertToUSD } from '@/lib/salary'
import type { SalaryRow as SalaryRowType } from '@/types'

interface Props {
  salary: SalaryRowType
  displayCurrency: string
}

function formatAmount(amount: number, currency: string, displayCurrency: string): string {
  if (amount === 0) return '—'
  const value = displayCurrency === 'USD' && currency === 'INR'
    ? convertToUSD(amount)
    : amount
  return displayCurrency === 'USD' ? formatUSD(value) : formatINR(value)
}

export default function SalaryRow({ salary, displayCurrency }: Props) {
  const dc = displayCurrency || 'INR'
  return (
    <tr className="border-b border-border hover:bg-hover-surface transition-colors group">
      <td className="px-4 py-3">
        <a
          href ={`/companies/${salary.company.slug}`}
          className="font-medium text-deep-text hover:text-coral transition-colors text-sm"
        >
          {salary.company.name}
        </a>
      </td>
      <td className="px-4 py-3 text-sm text-body-text max-w-[200px]">
        <span className="line-clamp-1">{salary.role}</span>
      </td>
      <td className="px-4 py-3">
        <LevelBadge level={salary.level} />
      </td>
      <td className="px-4 py-3 text-sm text-body-text">{salary.location}</td>
      <td className="px-4 py-3 text-sm text-muted text-center">{salary.experienceYears}y</td>
      <td className="px-4 py-3 text-sm text-body-text font-mono">
        {formatAmount(salary.baseSalary, salary.currency, dc)}
      </td>
      <td className="px-4 py-3 text-sm text-muted font-mono">
        {formatAmount(salary.stock, salary.currency, dc)}
      </td>
      <td className="px-4 py-3">
        <span className="text-[15px] font-bold text-data-blue font-mono">
          {formatAmount(salary.totalCompensation, salary.currency, dc)}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          salary.isVerified
            ? 'bg-green-50 text-success'
            : 'bg-gray-50 text-muted'
        }`}>
          {salary.isVerified ? 'Verified' : salary.source === 'AI_INFERRED' ? 'AI' : 'Unverified'}
        </span>
      </td>
    </tr>
  )
}