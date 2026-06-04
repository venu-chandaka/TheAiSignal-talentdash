// Enums matching Prisma schema
export type Level =
  | 'L3' | 'L4' | 'L5' | 'L6'
  | 'SDE_I' | 'SDE_II' | 'SDE_III'
  | 'STAFF' | 'PRINCIPAL' | 'IC4' | 'IC5'

export type Currency = 'INR' | 'USD' | 'GBP' | 'EUR'
export type Source = 'CONTRIBUTOR' | 'SCRAPED' | 'AI_INFERRED'

export interface Company {
  id: string
  name: string
  slug: string
  normalizedName: string
  industry?: string | null
  headquarters?: string | null
  foundedYear?: number | null
  headcountRange?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Salary {
  id: string
  companyId: string
  company: Company
  role: string
  level: Level
  location: string
  currency: Currency
  experienceYears: number
  baseSalary: bigint
  bonus: bigint
  stock: bigint
  totalCompensation: bigint
  source: Source
  confidenceScore: number
  isVerified: boolean
  submittedAt: Date
}

// API response shapes
export interface SalaryListResponse {
  data: SalaryRow[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface SalaryRow {
  id: string
  company: { name: string; slug: string }
  role: string
  level: Level
  location: string
  currency: Currency
  experienceYears: number
  baseSalary: number   // serialized from BigInt
  bonus: number
  stock: number
  totalCompensation: number
  source: Source
  confidenceScore: number
  isVerified: boolean
  submittedAt: string
}

export interface CompanyPageData {
  company: Company
  salaries: SalaryRow[]
  medianTotalCompensation: number
  levelDistribution: Record<Level, number>
  recordCount: number
}

export interface CompareResponse {
  record1: SalaryRow
  record2: SalaryRow
  delta: {
    baseDelta: number
    bonusDelta: number
    stockDelta: number
    tcDelta: number
    experienceDelta: number
  }
}

// Filter params for the salary table
export interface SalaryFilters {
  company?: string
  role?: string
  level?: Level
  location?: string
  currency?: Currency
  sort?: 'total_comp_desc' | 'total_comp_asc' | 'date_desc'
  page?: number
  limit?: number
}