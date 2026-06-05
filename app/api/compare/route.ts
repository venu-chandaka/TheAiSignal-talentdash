import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { serializeRecord } from '@/lib/serialize'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

  const s1 = searchParams.get('s1')
  const s2 = searchParams.get('s2')

  if (!s1 || !s2) {
    return NextResponse.json(
      { error: 's1 and s2 query params are required' },
      { status: 400 }
    )
  }

  if (s1 === s2) {
    return NextResponse.json(
      { error: 'Cannot compare a record with itself' },
      { status: 400 }
    )
  }

  const [record1, record2] = await Promise.all([
    prisma.salary.findUnique({
      where: { id: s1 },
      include: { company: { select: { name: true, slug: true } } },
    }),
    prisma.salary.findUnique({
      where: { id: s2 },
      include: { company: { select: { name: true, slug: true } } },
    }),
  ])

  if (!record1) {
    return NextResponse.json({ error: `Record s1 not found: ${s1}` }, { status: 404 })
  }
  if (!record2) {
    return NextResponse.json({ error: `Record s2 not found: ${s2}` }, { status: 404 })
  }

  const r1 = serializeRecord(record1)
  const r2 = serializeRecord(record2)

  const delta = {
    baseDelta:       Number(r1.baseSalary)        - Number(r2.baseSalary),
    bonusDelta:      Number(r1.bonus)              - Number(r2.bonus),
    stockDelta:      Number(r1.stock)              - Number(r2.stock),
    tcDelta:         Number(r1.totalCompensation)  - Number(r2.totalCompensation),
    experienceDelta: r1.experienceYears            - r2.experienceYears,
  }

  return NextResponse.json({ record1: r1, record2: r2, delta })
}