import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { serializeRecord, serializeRecords } from '@/lib/serialize'
import { computeMedian } from '@/lib/salary'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const company = await prisma.company.findUnique({
    where: { slug },
    include: {
      salaries: {
        orderBy: { totalCompensation: 'desc' },
        include: {
          company: { select: { name: true, slug: true } },
        },
      },
    },
  })

  if (!company) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 })
  }

  const salaries = company.salaries

  // Compute median total compensation
  const tcValues = salaries.map((s) => Number(s.totalCompensation))
  const medianTotalCompensation = computeMedian(tcValues)

  // Level distribution
  const levelDistribution: Record<string, number> = {}
  for (const s of salaries) {
    levelDistribution[s.level] = (levelDistribution[s.level] || 0) + 1
  }

  return NextResponse.json(
    {
      company: serializeRecord(company),
      salaries: serializeRecords(salaries),
      medianTotalCompensation,
      levelDistribution,
      recordCount: salaries.length,
    },
    {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      },
    }
  )
}