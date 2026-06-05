import { prisma } from '@/lib/db'
import { serializeRecords } from '@/lib/serialize'
import FilterBar from '@/components/features/FilterBar'
import SalaryRow from '@/components/features/SalaryRow'
import Pagination from '@/components/ui/Pagination'
import type { Metadata } from 'next'
import type { Prisma } from '@prisma/client'

export const revalidate = 300 
export const metadata: Metadata = {
  title: 'Software Engineer Salaries in India — All Levels & Companies | TalentDash',
  description: 'Browse verified salary data for software engineers across Google, Amazon, Microsoft, Flipkart and more. Filter by level, location, and role.',
  alternates: { canonical: 'https://talentdash.vercel.app/salaries' },
  openGraph: {
    title: 'Software Engineer Salaries in India | TalentDash',
    description: 'Structured, level-based salary data for India tech professionals.',
    url: 'https://talentdash.vercel.app/salaries',
  },
}

interface PageProps {
  searchParams: Promise<Record<string, string>>
}

const LIMIT = 25

export default async function SalariesPage({ searchParams }: PageProps) {
  const params = await searchParams

  const company   = params.company   || undefined
  const role      = params.role      || undefined
  const level     = params.level     || undefined
  const location  = params.location  || undefined
  const sort      = params.sort      || 'total_comp_desc'
  const page      = Math.max(1, parseInt(params.page || '1'))
  const displayCurrency = params.currency || 'INR'

  const where: Prisma.SalaryWhereInput = {}
  if (company)  where.company  = { name: { contains: company,   mode: 'insensitive' } }
  if (role)     where.role     = { contains: role,     mode: 'insensitive' }
  if (level)    where.level    = level as any
  if (location) where.location = { contains: location, mode: 'insensitive' }

  const orderBy: Prisma.SalaryOrderByWithRelationInput =
    sort === 'total_comp_asc' ? { totalCompensation: 'asc' }
    : sort === 'date_desc'    ? { submittedAt: 'desc' }
    :                           { totalCompensation: 'desc' }

  const [total, rawRecords] = await Promise.all([
    prisma.salary.count({ where }),
    prisma.salary.findMany({
      where, orderBy,
      skip: (page - 1) * LIMIT,
      take: LIMIT,
      include: { company: { select: { name: true, slug: true } } },
    }),
  ])

  const records = serializeRecords(rawRecords)
  const totalPages = Math.ceil(total / LIMIT)

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'TalentDash India Tech Salaries',
    description: 'Structured salary data for software engineers across India tech companies',
    url: 'https://talentdash.vercel.app/salaries',
    keywords: ['salary', 'compensation', 'software engineer', 'India', 'tech'],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        {/* Hero */}
        <div className="bg-white border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-[36px] font-bold text-deep-text leading-tight">
              Tech Salaries in India
            </h1>
            <p className="text-body-text mt-2">
              {total.toLocaleString()} verified records · Updated daily
            </p>
          </div>
        </div>

        {/* Filters */}
        <FilterBar displayCurrency={displayCurrency} />

        {/* Table */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
            {records.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-xl font-semibold text-deep-text mb-2">No records found</p>
                <p className="text-muted mb-4">No records found for these filters. Try removing a filter.</p>
                <a href="/salaries" className="text-coral font-medium hover:underline">
                  Clear all filters
                </a>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px]">
                    <thead>
                      <tr className="bg-app-bg border-b border-border">
                        {['Company', 'Role', 'Level', 'Location', 'Exp', 'Base Salary', 'Stock', 'Total Comp', ''].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((salary: any) => (
                        <SalaryRow key={salary.id} salary={salary} displayCurrency={displayCurrency} />
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination currentPage={page} totalPages={totalPages} total={total} limit={LIMIT} />
              </>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
