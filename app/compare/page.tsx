'use client'
import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import LevelBadge from '@/components/ui/LevelBadge'
import { formatINR } from '@/lib/salary'
import type { SalaryRow } from '@/types'

interface CompareRecord extends SalaryRow {
  company: { name: string; slug: string }
}

export default function ComparePage() {
  return (
    <Suspense fallback={<CompareLoading />}>
      <CompareContent />
    </Suspense>
  )
}

function CompareLoading() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-[36px] font-bold text-deep-text mb-2">Compare Offers</h1>
      <p className="text-body-text mb-8">Loading comparison...</p>
    </main>
  )
}

function CompareContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [allSalaries, setAllSalaries]   = useState<CompareRecord[]>([])
  const [record1, setRecord1]           = useState<CompareRecord | null>(null)
  const [record2, setRecord2]           = useState<CompareRecord | null>(null)
  const [loading, setLoading]           = useState(true)

  // Load all salary records for dropdowns
  useEffect(() => {
    fetch('/api/salaries?limit=100')
      .then((r) => r.json())
      .then(({ data }) => {
        setAllSalaries(data)
        const s1 = searchParams.get('s1')
        const s2 = searchParams.get('s2')
        if (s1) setRecord1(data.find((d: CompareRecord) => d.id === s1) ?? null)
        if (s2) setRecord2(data.find((d: CompareRecord) => d.id === s2) ?? null)
        setLoading(false)
      })
  }, [searchParams])

  function selectRecord(which: 1 | 2, id: string) {
    const found = allSalaries.find((s) => s.id === id) ?? null
    if (which === 1) setRecord1(found)
    else setRecord2(found)
    const params = new URLSearchParams(searchParams.toString())
    if (id) params.set(which === 1 ? 's1' : 's2', id)
    else params.delete(which === 1 ? 's1' : 's2')
    router.push(`/compare?${params.toString()}`)
  }

  const delta = record1 && record2 ? {
    base:   record1.baseSalary  - record2.baseSalary,
    bonus:  record1.bonus       - record2.bonus,
    stock:  record1.stock       - record2.stock,
    tc:     record1.totalCompensation - record2.totalCompensation,
    exp:    record1.experienceYears   - record2.experienceYears,
  } : null

  function DeltaCell({ value, isYears = false }: { value: number; isYears?: boolean }) {
    if (value === 0) return <td className="px-4 py-3 text-sm text-muted text-center">—</td>
    const positive = value > 0
    const formatted = isYears
      ? `${positive ? '+' : ''}${value}y`
      : `${positive ? '+' : ''}${formatINR(Math.abs(value))}`
    return (
      <td className={`px-4 py-3 text-sm font-semibold text-center ${positive ? 'text-success' : 'text-danger'}`}>
        {positive ? '+' : '-'}{isYears ? `${Math.abs(value)}y` : formatINR(Math.abs(value))}
      </td>
    )
  }

  const rows = [
    { label: 'Company',     v1: record1?.company.name,           v2: record2?.company.name },
    { label: 'Role',        v1: record1?.role,                   v2: record2?.role },
    { label: 'Level',       v1: record1?.level,                  v2: record2?.level,      isLevel: true },
    { label: 'Location',    v1: record1?.location,               v2: record2?.location },
    { label: 'Experience',  v1: record1 ? `${record1.experienceYears}y` : null, v2: record2 ? `${record2.experienceYears}y` : null, deltaKey: 'exp', isYears: true },
    { label: 'Base Salary', v1: record1 ? formatINR(record1.baseSalary) : null, v2: record2 ? formatINR(record2.baseSalary) : null, deltaKey: 'base' },
    { label: 'Bonus',       v1: record1 ? (record1.bonus ? formatINR(record1.bonus) : '—') : null, v2: record2 ? (record2.bonus ? formatINR(record2.bonus) : '—') : null, deltaKey: 'bonus' },
    { label: 'Stock (RSU)', v1: record1 ? (record1.stock ? formatINR(record1.stock) : '—') : null, v2: record2 ? (record2.stock ? formatINR(record2.stock) : '—') : null, deltaKey: 'stock' },
    { label: 'Total Comp',  v1: record1 ? formatINR(record1.totalCompensation) : null, v2: record2 ? formatINR(record2.totalCompensation) : null, deltaKey: 'tc', isTC: true },
  ]

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-[36px] font-bold text-deep-text mb-2">Compare Offers</h1>
      <p className="text-body-text mb-8">Select two salary records to compare side-by-side</p>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {([1, 2] as const).map((which) => (
          <div key={which}>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
              Record {which}
            </label>
            <select
              className="w-full h-10 px-3 text-sm border border-border rounded-lg bg-white text-body-text focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral"
              value={(which === 1 ? record1 : record2)?.id ?? ''}
              onChange={(e) => selectRecord(which, e.target.value)}
              disabled={loading}
            >
              <option value="">-- Select a salary record --</option>
              {allSalaries.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.company.name} · {s.role} · {s.level} · {s.location}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      {record1 && record2 && delta && (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-app-bg border-b border-border">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted w-32">Field</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Record 1
                  {delta.tc > 0 && (
                    <span className="ml-2 text-[10px] bg-data-blue text-white px-1.5 py-0.5 rounded-full">Higher TC</span>
                  )}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Record 2
                  {delta.tc < 0 && (
                    <span className="ml-2 text-[10px] bg-data-blue text-white px-1.5 py-0.5 rounded-full">Higher TC</span>
                  )}
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted">Delta</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-border last:border-0 hover:bg-hover-surface">
                  <td className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">{row.label}</td>
                  <td className={`px-4 py-3 text-sm ${row.isTC ? 'text-[15px] font-bold text-data-blue' : 'text-body-text'}`}>
                    {row.isLevel ? <LevelBadge level={row.v1 as string} /> : row.v1 ?? '—'}
                  </td>
                  <td className={`px-4 py-3 text-sm ${row.isTC ? 'text-[15px] font-bold text-data-blue' : 'text-body-text'}`}>
                    {row.isLevel ? <LevelBadge level={row.v2 as string} /> : row.v2 ?? '—'}
                  </td>
                  {row.deltaKey
                    ? <DeltaCell value={delta[row.deltaKey as keyof typeof delta]} isYears={row.isYears} />
                    : <td className="px-4 py-3 text-sm text-muted text-center">—</td>
                  }
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(!record1 || !record2) && !loading && (
        <div className="bg-white rounded-xl border border-border py-16 text-center">
          <p className="text-xl font-semibold text-deep-text mb-2">Select two records above</p>
          <p className="text-muted">Choose any two salary records to compare them side by side</p>
        </div>
      )}
    </main>
  )
}
