import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { normalizeCompanyName, slugify } from '@/lib/normalize'
import { serializeRecord } from '@/lib/serialize'
import { revalidatePath } from 'next/cache'

const VALID_LEVELS = ['L3','L4','L5','L6','SDE_I','SDE_II','SDE_III','STAFF','PRINCIPAL','IC4','IC5']
const VALID_CURRENCIES = ['INR','USD','GBP','EUR']
const VALID_SOURCES = ['CONTRIBUTOR','SCRAPED','AI_INFERRED']

export async function POST(req: NextRequest) {
  let body: any

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const errors: Record<string, string> = {}

  // ── Required field checks ──────────────────────────
  const required = ['companyName','role','level','location','currency','experienceYears','baseSalary','source','confidenceScore']
  for (const field of required) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      errors[field] = `${field} is required`
    }
  }

  // ── Type + range checks ────────────────────────────
  if (!errors.level && !VALID_LEVELS.includes(body.level)) {
    errors.level = `level must be one of: ${VALID_LEVELS.join(', ')}`
  }
  if (!errors.currency && !VALID_CURRENCIES.includes(body.currency)) {
    errors.currency = `currency must be one of: ${VALID_CURRENCIES.join(', ')}`
  }
  if (!errors.source && !VALID_SOURCES.includes(body.source)) {
    errors.source = `source must be one of: ${VALID_SOURCES.join(', ')}`
  }

  const experienceYears = parseInt(body.experienceYears)
  if (!errors.experienceYears && (isNaN(experienceYears) || experienceYears < 0 || experienceYears > 50)) {
    errors.experienceYears = 'experienceYears must be between 0 and 50'
  }

  const baseSalary = Number(body.baseSalary)
  if (!errors.baseSalary && (isNaN(baseSalary) || baseSalary <= 0)) {
    errors.baseSalary = 'baseSalary must be a positive number'
  }

  const bonus = Number(body.bonus ?? 0)
  if (isNaN(bonus) || bonus < 0) {
    errors.bonus = 'bonus must be a non-negative number'
  }

  const stock = Number(body.stock ?? 0)
  if (isNaN(stock) || stock < 0) {
    errors.stock = 'stock must be a non-negative number'
  }

  const confidenceScore = Number(body.confidenceScore)
  if (!errors.confidenceScore && (isNaN(confidenceScore) || confidenceScore < 0 || confidenceScore > 1)) {
    errors.confidenceScore = 'confidenceScore must be between 0.0 and 1.0'
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 })
  }

  // ── Always recompute total — never trust client ────
  const totalCompensation = baseSalary + bonus + stock

  // ── Find or create company ─────────────────────────
  const slug           = slugify(body.companyName)
  const normalizedName = normalizeCompanyName(body.companyName)

  let company = await prisma.company.findUnique({ where: { slug } })

  if (!company) {
    company = await prisma.company.create({
      data: {
        name: body.companyName,
        slug,
        normalizedName,
      },
    })
  }

  // ── Duplicate check (same company+role+level+location within 48h, base within 10%) ──
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000)

  const existing = await prisma.salary.findFirst({
    where: {
      companyId: company.id,
      role:      { equals: body.role, mode: 'insensitive' },
      level:     body.level,
      location:  { equals: body.location, mode: 'insensitive' },
      submittedAt: { gte: fortyEightHoursAgo },
    },
  })

  if (existing) {
    const existingBase = Number(existing.baseSalary)
    const diff = Math.abs(existingBase - baseSalary) / existingBase
    if (diff <= 0.10) {
      return NextResponse.json(
        { error: 'Duplicate record detected. A similar salary was submitted within the last 48 hours.' },
        { status: 409 }
      )
    }
  }

  // ── Create salary record ───────────────────────────
  const salary = await prisma.salary.create({
    data: {
      companyId:         company.id,
      role:              body.role,
      level:             body.level,
      location:          body.location,
      currency:          body.currency,
      experienceYears,
      baseSalary:        BigInt(Math.round(baseSalary)),
      bonus:             BigInt(Math.round(bonus)),
      stock:             BigInt(Math.round(stock)),
      totalCompensation: BigInt(Math.round(totalCompensation)),
      source:            body.source,
      confidenceScore,
      isVerified:        body.isVerified ?? false,
    },
    include: {
      company: { select: { name: true, slug: true } },
    },
  })

  // ── Trigger ISR revalidation ───────────────────────
  // After prisma.salary.create(...)
  revalidatePath('/salaries')
  revalidatePath(`/companies/${company.slug}`)
  revalidatePath('/')
  return NextResponse.json(serializeRecord(salary), { status: 201 })
}
