import { prisma } from '@/lib/db'
import { serializeRecords, serializeRecord } from '@/lib/serialize'
import { computeMedian, formatINR } from '@/lib/salary'
import LevelBadge from '@/components/ui/LevelBadge'
import LevelDistributionBar from '@/components/features/LevelDistributionBar'
import SalaryRow from '@/components/features/SalaryRow'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'

export async function generateStaticParams() {
  const companies = await prisma.company.findMany({ select: { slug: true } })
  return companies.map((c: { slug: string }) => ({
  slug: c.slug,
}))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const company = await prisma.company.findUnique({ where: { slug } })
  if (!company) return { title: 'Company Not Found | TalentDash' }
  return {
    title: `${company.name} Salaries — All Levels | TalentDash`,
    description: `Browse verified salary data for ${company.name}. Level-based compensation breakdown for India tech professionals.`,
    alternates: { canonical: `https://talentdash.vercel.app/companies/${slug}` },
    openGraph: {
      title: `${company.name} Salaries | TalentDash`,
      url: `https://talentdash.vercel.app/companies/${slug}`,
    },
  }
}

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const company = await prisma.company.findUnique({
    where: { slug },
    include: {
      salaries: {
        orderBy: { totalCompensation: 'desc' },
        include: { company: { select: { name: true, slug: true } } },
      },
    },
  })

  if (!company) notFound()

  const salaries    = serializeRecords(company.salaries)
  const tcValues    = salaries.map((s: any) => Number(s.totalCompensation))
  const medianTC    = computeMedian(tcValues)
  const minTC       = Math.min(...tcValues)
  const maxTC       = Math.max(...tcValues)

  const levelDist: Record<string, number> = {}
  for (const s of salaries) {
    levelDist[(s as any).level] = (levelDist[(s as any).level] || 0) + 1
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Company Header */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-[36px] font-bold text-deep-text">{company.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {company.industry && (
                <span className="text-sm bg-app-bg border border-border text-body-text px-2.5 py-1 rounded-full">
                  {company.industry}
                </span>
              )}
              {company.headquarters && (
                <span className="text-sm text-muted">📍 {company.headquarters}</span>
              )}
              {company.foundedYear && (
                <span className="text-sm text-muted">Est. {company.foundedYear}</span>
              )}
              {company.headcountRange && (
                <span className="text-sm text-muted">👥 {company.headcountRange} employees</span>
              )}
            </div>
          </div>
          <Link
            href={`/compare?c1=${slug}`}
            className="bg-coral text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#e54e53] transition-colors"
          >
            Compare →
          </Link>
        </div>
      </div>

      {/* Compensation Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">Median Total Comp</p>
          <p className="text-[32px] font-bold text-data-blue">{formatINR(medianTC)}</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">TC Range</p>
          <p className="text-lg font-bold text-deep-text">{formatINR(minTC)} – {formatINR(maxTC)}</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">Total Records</p>
          <p className="text-[32px] font-bold text-deep-text">{salaries.length}</p>
        </div>
      </div>

      {/* Level Distribution */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="text-[22px] font-semibold text-deep-text mb-4">Level Distribution</h2>
        <LevelDistributionBar distribution={levelDist} total={salaries.length} />
      </div>

      {/* Salary Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-[22px] font-semibold text-deep-text">All Salaries</h2>
        </div>
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
              {salaries.map((salary: any) => (
                <SalaryRow key={salary.id} salary={salary} displayCurrency="INR" />
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </main>
  )
}