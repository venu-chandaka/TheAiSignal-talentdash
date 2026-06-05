import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { serializeRecords } from '@/lib/serialize'
import { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

  const company   = searchParams.get('company') || undefined
  const role      = searchParams.get('role') || undefined
  const level     = searchParams.get('level') || undefined
  const location  = searchParams.get('location') || undefined
  const currency  = searchParams.get('currency') || undefined
  const sort      = searchParams.get('sort') || 'total_comp_desc'
  const page      = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const rawLimit  = parseInt(searchParams.get('limit') || '25')
  const limit     = Math.min(rawLimit, 100)

  // Build where clause
  const where: Prisma.SalaryWhereInput = {}

  if (company) {
    where.company = {
      name: { contains: company, mode: 'insensitive' },
    }
  }
  if (role) {
    where.role = { contains: role, mode: 'insensitive' }
  }
  if (level) {
    where.level = level as any
  }
  if (location) {
    where.location = { contains: location, mode: 'insensitive' }
  }
  if (currency) {
    where.currency = currency as any
  }

  // Build orderBy
  const orderBy: Prisma.SalaryOrderByWithRelationInput =
    sort === 'total_comp_asc'
      ? { totalCompensation: 'asc' }
      : sort === 'date_desc'
      ? { submittedAt: 'desc' }
      : { totalCompensation: 'desc' }

  const [total, records] = await Promise.all([
    prisma.salary.count({ where }),
    prisma.salary.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        company: {
          select: { name: true, slug: true },
        },
      },
    }),
  ])

  return NextResponse.json(
    {
      data: serializeRecords(records),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
    {
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate=3600',
      },
    }
  )
}