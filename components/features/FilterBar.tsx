'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { ALL_LEVELS, LEVEL_LABELS } from '@/lib/config'

const LOCATIONS = ['Bengaluru', 'Hyderabad', 'Mumbai', 'Pune', 'Delhi', 'Chennai', 'Remote']
const SORT_OPTIONS = [
  { value: 'total_comp_desc', label: 'Highest TC First' },
  { value: 'total_comp_asc', label: 'Lowest TC First' },
  { value: 'date_desc', label: 'Most Recent' },
]

interface FilterBarProps {
  displayCurrency: string
}

export default function FilterBar({ displayCurrency }: FilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [company, setCompany] = useState(searchParams.get('company') ?? '')
  const [role, setRole] = useState(searchParams.get('role') ?? '')
  const [level, setLevel] = useState(searchParams.get('level') ?? '')
  const [location, setLocation] = useState(searchParams.get('location') ?? '')
  const [sort, setSort] = useState(searchParams.get('sort') ?? 'total_comp_desc')
  const [currency, setCurrency] = useState(displayCurrency)

  // Debounced company/role search
  useEffect(() => {
    const timer = setTimeout(() => {
      updateParams({ company, role })
    }, 300)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company, role])

  const updateParams = useCallback(
    (overrides: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      const updates = { company, role, level, location, sort, currency, ...overrides }
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value)
        else params.delete(key)
      })
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, company, role, level, location, sort, currency, router, pathname]
  )

  function clearAll() {
    setCompany('')
    setRole('')
    setLevel('')
    setLocation('')
    setSort('total_comp_desc')
    setCurrency('INR')
    router.push(pathname)
  }

  const hasFilters = company || role || level || location || currency !== 'INR'

  return (
    <div className="bg-white border-b border-border px-4 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-3 items-center">

          {/* Company search */}
          <input
            type="text"
            placeholder="Search company..."
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="h-9 px-3 text-sm border border-border rounded-lg bg-white text-deep-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral w-44"
          />

          {/* Role search */}
          <input
            type="text"
            placeholder="Search role..."
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="h-9 px-3 text-sm border border-border rounded-lg bg-white text-deep-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral w-40"
          />

          {/* Level dropdown */}
          <select
            value={level}
            onChange={(e) => { setLevel(e.target.value); updateParams({ level: e.target.value }) }}
            className="h-9 px-3 text-sm border border-border rounded-lg bg-white text-body-text focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral"
          >
            <option value="">All Levels</option>
            {ALL_LEVELS.map((l) => (
              <option key={l} value={l}>{LEVEL_LABELS[l]}</option>
            ))}
          </select>

          {/* Location dropdown */}
          <select
            value={location}
            onChange={(e) => { setLocation(e.target.value); updateParams({ location: e.target.value }) }}
            className="h-9 px-3 text-sm border border-border rounded-lg bg-white text-body-text focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral"
          >
            <option value="">All Locations</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); updateParams({ sort: e.target.value }) }}
            className="h-9 px-3 text-sm border border-border rounded-lg bg-white text-body-text focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Currency toggle */}
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            {(['INR', 'USD'] as const).map((c) => (
              <button
                key={c}
                onClick={() => { setCurrency(c); updateParams({ currency: c }) }}
                className={`h-9 px-3 text-sm font-medium transition-colors ${
                  currency === c
                    ? 'bg-deep-text text-white'
                    : 'bg-white text-body-text hover:bg-hover-surface'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Clear all */}
          {hasFilters && (
            <button
              onClick={clearAll}
              className="h-9 px-3 text-sm text-coral font-medium hover:underline"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  )
}