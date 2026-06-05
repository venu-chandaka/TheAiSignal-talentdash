import Link from 'next/link'
import { prisma } from '@/lib/db'

export const revalidate = 3600

export default async function HomePage() {
  const [totalSalaries, totalCompanies] = await Promise.all([
    prisma.salary.count(),
    prisma.company.count(),
  ])

  const topCompanies = await prisma.company.findMany({
    take: 8,
    include: { _count: { select: { salaries: true } } },
    orderBy: { salaries: { _count: 'desc' } },
  })

  return (
    <main>
      {/* Hero */}
      <section className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-[36px] font-bold text-deep-text leading-tight mb-4">
            India's Career Intelligence Platform
          </h1>
          <p className="text-lg text-body-text max-w-2xl mx-auto mb-8">
            Structured, level-based salary data for India tech professionals.
            Make decisions based on facts, not guesswork.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/salaries"
              className="bg-coral text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e54e53] transition-colors"
            >
              Browse Salaries
            </Link>
            <Link
              href="/compare"
              className="border border-border text-deep-text px-6 py-3 rounded-lg font-semibold hover:bg-hover-surface transition-colors"
            >
              Compare Offers
            </Link>
          </div>
          <div className="flex items-center justify-center gap-8 mt-10">
            <div>
              <p className="text-[32px] font-bold text-deep-text">{totalSalaries.toLocaleString()}</p>
              <p className="text-sm text-muted">Salary Records</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <p className="text-[32px] font-bold text-deep-text">{totalCompanies}</p>
              <p className="text-sm text-muted">Companies</p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Companies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-[28px] font-bold text-deep-text mb-6">Top Companies</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {topCompanies.map((c) => (
            <Link
              key={c.id}
              href={`/companies/${c.slug}`}
              className="bg-white rounded-xl border border-border p-4 hover:border-coral hover:shadow-sm transition-all group"
            >
              <p className="font-semibold text-deep-text group-hover:text-coral transition-colors">{c.name}</p>
              <p className="text-sm text-muted mt-1">{c._count.salaries} records</p>
              {c.industry && <p className="text-xs text-muted mt-1">{c.industry}</p>}
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}