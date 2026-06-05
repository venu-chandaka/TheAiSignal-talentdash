import { PrismaClient, Level, Currency, Source } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { normalizeCompanyName, slugify } from '../lib/normalize'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? '' }),
})

const companies = [
  { name: 'Google', industry: 'Technology', headquarters: 'Mountain View, CA', foundedYear: 1998, headcountRange: '100000+' },
  { name: 'Amazon', industry: 'E-commerce / Cloud', headquarters: 'Seattle, WA', foundedYear: 1994, headcountRange: '100000+' },
  { name: 'Microsoft', industry: 'Technology', headquarters: 'Redmond, WA', foundedYear: 1975, headcountRange: '100000+' },
  { name: 'Meta', industry: 'Social Media', headquarters: 'Menlo Park, CA', foundedYear: 2004, headcountRange: '50000-100000' },
  { name: 'Flipkart', industry: 'E-commerce', headquarters: 'Bengaluru, India', foundedYear: 2007, headcountRange: '10000-50000' },
  { name: 'Razorpay', industry: 'Fintech', headquarters: 'Bengaluru, India', foundedYear: 2014, headcountRange: '1000-5000' },
  { name: 'TCS', industry: 'IT Services', headquarters: 'Mumbai, India', foundedYear: 1968, headcountRange: '100000+' },
  { name: 'Infosys', industry: 'IT Services', headquarters: 'Bengaluru, India', foundedYear: 1981, headcountRange: '100000+' },
  { name: 'Swiggy', industry: 'Food Delivery', headquarters: 'Bengaluru, India', foundedYear: 2014, headcountRange: '5000-10000' },
  { name: 'Zepto', industry: 'Quick Commerce', headquarters: 'Mumbai, India', foundedYear: 2021, headcountRange: '1000-5000' },
]

type SalaryInput = {
  companyName: string
  role: string
  level: Level
  location: string
  currency: Currency
  experienceYears: number
  baseSalary: number
  bonus: number
  stock: number
  source: Source
  confidenceScore: number
  isVerified: boolean
}

const salaries: SalaryInput[] = [
  { companyName: 'Google', role: 'Software Engineer', level: 'L3' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 1, baseSalary: 2200000, bonus: 300000, stock: 400000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.95, isVerified: true },
  { companyName: 'Google', role: 'Software Engineer', level: 'L4' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 3, baseSalary: 3500000, bonus: 500000, stock: 800000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.95, isVerified: true },
  { companyName: 'Google', role: 'Software Engineer', level: 'L5' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 6, baseSalary: 5500000, bonus: 900000, stock: 2000000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.92, isVerified: true },
  { companyName: 'Google', role: 'Software Engineer', level: 'L6' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 10, baseSalary: 8000000, bonus: 1500000, stock: 4000000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.90, isVerified: true },
  { companyName: 'Google', role: 'Staff Engineer', level: 'STAFF' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 14, baseSalary: 11000000, bonus: 2500000, stock: 7000000, source: 'SCRAPED' as Source, confidenceScore: 0.85, isVerified: false },
  { companyName: 'Google', role: 'Principal Engineer', level: 'PRINCIPAL' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 18, baseSalary: 16000000, bonus: 4000000, stock: 12000000, source: 'SCRAPED' as Source, confidenceScore: 0.80, isVerified: false },
  { companyName: 'Google', role: 'Software Engineer', level: 'L4' as Level, location: 'Hyderabad', currency: 'INR' as Currency, experienceYears: 4, baseSalary: 3200000, bonus: 450000, stock: 700000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.93, isVerified: true },
  { companyName: 'Google', role: 'Data Scientist', level: 'L5' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 7, baseSalary: 5200000, bonus: 800000, stock: 1800000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.88, isVerified: true },

  { companyName: 'Amazon', role: 'Software Development Engineer', level: 'SDE_I' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 1, baseSalary: 1800000, bonus: 200000, stock: 300000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.95, isVerified: true },
  { companyName: 'Amazon', role: 'Software Development Engineer', level: 'SDE_II' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 4, baseSalary: 3000000, bonus: 400000, stock: 900000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.94, isVerified: true },
  { companyName: 'Amazon', role: 'Software Development Engineer', level: 'SDE_III' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 8, baseSalary: 5000000, bonus: 800000, stock: 2500000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.91, isVerified: true },
  { companyName: 'Amazon', role: 'Principal Engineer', level: 'PRINCIPAL' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 15, baseSalary: 14000000, bonus: 3000000, stock: 10000000, source: 'SCRAPED' as Source, confidenceScore: 0.82, isVerified: false },
  { companyName: 'Amazon', role: 'Software Development Engineer', level: 'SDE_II' as Level, location: 'Hyderabad', currency: 'INR' as Currency, experienceYears: 5, baseSalary: 2800000, bonus: 350000, stock: 800000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.90, isVerified: true },
  { companyName: 'Amazon', role: 'Software Development Engineer', level: 'SDE_I' as Level, location: 'Chennai', currency: 'INR' as Currency, experienceYears: 2, baseSalary: 1600000, bonus: 180000, stock: 250000, source: 'AI_INFERRED' as Source, confidenceScore: 0.75, isVerified: false },
  { companyName: 'Amazon', role: 'Machine Learning Engineer', level: 'SDE_II' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 5, baseSalary: 3200000, bonus: 500000, stock: 1200000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.89, isVerified: true },

  { companyName: 'Microsoft', role: 'Software Engineer', level: 'SDE_I' as Level, location: 'Hyderabad', currency: 'INR' as Currency, experienceYears: 1, baseSalary: 1900000, bonus: 250000, stock: 350000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.94, isVerified: true },
  { companyName: 'Microsoft', role: 'Software Engineer', level: 'SDE_II' as Level, location: 'Hyderabad', currency: 'INR' as Currency, experienceYears: 4, baseSalary: 3100000, bonus: 420000, stock: 850000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.93, isVerified: true },
  { companyName: 'Microsoft', role: 'Senior Software Engineer', level: 'SDE_III' as Level, location: 'Hyderabad', currency: 'INR' as Currency, experienceYears: 8, baseSalary: 4800000, bonus: 750000, stock: 2200000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.91, isVerified: true },
  { companyName: 'Microsoft', role: 'Principal Engineer', level: 'PRINCIPAL' as Level, location: 'Hyderabad', currency: 'INR' as Currency, experienceYears: 16, baseSalary: 13000000, bonus: 2800000, stock: 9000000, source: 'SCRAPED' as Source, confidenceScore: 0.83, isVerified: false },
  { companyName: 'Microsoft', role: 'Software Engineer', level: 'SDE_II' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 5, baseSalary: 2900000, bonus: 400000, stock: 800000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.90, isVerified: true },
  { companyName: 'Microsoft', role: 'Staff Engineer', level: 'STAFF' as Level, location: 'Hyderabad', currency: 'INR' as Currency, experienceYears: 13, baseSalary: 9500000, bonus: 2000000, stock: 6000000, source: 'SCRAPED' as Source, confidenceScore: 0.84, isVerified: false },

  { companyName: 'Meta', role: 'Software Engineer', level: 'L4' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 3, baseSalary: 4000000, bonus: 600000, stock: 1500000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.92, isVerified: true },
  { companyName: 'Meta', role: 'Software Engineer', level: 'L5' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 7, baseSalary: 6500000, bonus: 1100000, stock: 3500000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.90, isVerified: true },
  { companyName: 'Meta', role: 'Software Engineer', level: 'L6' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 11, baseSalary: 9500000, bonus: 2000000, stock: 6000000, source: 'SCRAPED' as Source, confidenceScore: 0.85, isVerified: false },
  { companyName: 'Meta', role: 'Staff Engineer', level: 'STAFF' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 15, baseSalary: 13000000, bonus: 3500000, stock: 10000000, source: 'SCRAPED' as Source, confidenceScore: 0.81, isVerified: false },
  { companyName: 'Meta', role: 'Data Engineer', level: 'L4' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 4, baseSalary: 3800000, bonus: 550000, stock: 1300000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.88, isVerified: true },

  { companyName: 'Flipkart', role: 'Software Engineer', level: 'SDE_I' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 1, baseSalary: 1400000, bonus: 150000, stock: 200000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.94, isVerified: true },
  { companyName: 'Flipkart', role: 'Software Engineer', level: 'SDE_II' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 4, baseSalary: 2400000, bonus: 300000, stock: 600000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.93, isVerified: true },
  { companyName: 'Flipkart', role: 'Senior Software Engineer', level: 'SDE_III' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 7, baseSalary: 3800000, bonus: 550000, stock: 1200000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.90, isVerified: true },
  { companyName: 'Flipkart', role: 'Staff Engineer', level: 'STAFF' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 12, baseSalary: 6000000, bonus: 1200000, stock: 3000000, source: 'SCRAPED' as Source, confidenceScore: 0.85, isVerified: false },
  { companyName: 'Flipkart', role: 'Software Engineer', level: 'SDE_II' as Level, location: 'Pune', currency: 'INR' as Currency, experienceYears: 5, baseSalary: 2200000, bonus: 280000, stock: 500000, source: 'AI_INFERRED' as Source, confidenceScore: 0.72, isVerified: false },
  { companyName: 'Flipkart', role: 'Backend Engineer', level: 'SDE_III' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 8, baseSalary: 4000000, bonus: 600000, stock: 1400000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.89, isVerified: true },

  { companyName: 'Razorpay', role: 'Software Engineer', level: 'SDE_I' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 1, baseSalary: 1600000, bonus: 180000, stock: 300000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.93, isVerified: true },
  { companyName: 'Razorpay', role: 'Software Engineer', level: 'SDE_II' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 3, baseSalary: 2600000, bonus: 350000, stock: 700000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.92, isVerified: true },
  { companyName: 'Razorpay', role: 'Senior Engineer', level: 'SDE_III' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 6, baseSalary: 4000000, bonus: 600000, stock: 1500000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.90, isVerified: true },
  { companyName: 'Razorpay', role: 'Staff Engineer', level: 'STAFF' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 11, baseSalary: 6500000, bonus: 1300000, stock: 3500000, source: 'SCRAPED' as Source, confidenceScore: 0.84, isVerified: false },
  { companyName: 'Razorpay', role: 'Frontend Engineer', level: 'SDE_II' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 4, baseSalary: 2400000, bonus: 300000, stock: 600000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.89, isVerified: true },

  { companyName: 'TCS', role: 'Software Engineer', level: 'SDE_I' as Level, location: 'Mumbai', currency: 'INR' as Currency, experienceYears: 1, baseSalary: 700000, bonus: 50000, stock: 0, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.96, isVerified: true },
  { companyName: 'TCS', role: 'Software Engineer', level: 'SDE_II' as Level, location: 'Mumbai', currency: 'INR' as Currency, experienceYears: 4, baseSalary: 1100000, bonus: 80000, stock: 0, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.95, isVerified: true },
  { companyName: 'TCS', role: 'Senior Software Engineer', level: 'SDE_III' as Level, location: 'Pune', currency: 'INR' as Currency, experienceYears: 7, baseSalary: 1600000, bonus: 120000, stock: 0, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.94, isVerified: true },
  { companyName: 'TCS', role: 'Software Engineer', level: 'SDE_I' as Level, location: 'Chennai', currency: 'INR' as Currency, experienceYears: 2, baseSalary: 750000, bonus: 60000, stock: 0, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.95, isVerified: true },
  { companyName: 'TCS', role: 'Lead Engineer', level: 'STAFF' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 12, baseSalary: 2400000, bonus: 200000, stock: 0, source: 'SCRAPED' as Source, confidenceScore: 0.88, isVerified: false },
  { companyName: 'TCS', role: 'Software Engineer', level: 'SDE_II' as Level, location: 'Hyderabad', currency: 'INR' as Currency, experienceYears: 5, baseSalary: 1050000, bonus: 75000, stock: 0, source: 'AI_INFERRED' as Source, confidenceScore: 0.74, isVerified: false },

  { companyName: 'Infosys', role: 'Systems Engineer', level: 'SDE_I' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 1, baseSalary: 650000, bonus: 40000, stock: 0, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.96, isVerified: true },
  { companyName: 'Infosys', role: 'Senior Systems Engineer', level: 'SDE_II' as Level, location: 'Pune', currency: 'INR' as Currency, experienceYears: 4, baseSalary: 1000000, bonus: 70000, stock: 0, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.95, isVerified: true },
  { companyName: 'Infosys', role: 'Technical Lead', level: 'SDE_III' as Level, location: 'Hyderabad', currency: 'INR' as Currency, experienceYears: 8, baseSalary: 1500000, bonus: 110000, stock: 0, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.93, isVerified: true },
  { companyName: 'Infosys', role: 'Systems Engineer', level: 'SDE_I' as Level, location: 'Chennai', currency: 'INR' as Currency, experienceYears: 2, baseSalary: 680000, bonus: 45000, stock: 0, source: 'AI_INFERRED' as Source, confidenceScore: 0.76, isVerified: false },
  { companyName: 'Infosys', role: 'Principal Architect', level: 'PRINCIPAL' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 18, baseSalary: 4500000, bonus: 500000, stock: 0, source: 'SCRAPED' as Source, confidenceScore: 0.80, isVerified: false },

  { companyName: 'Swiggy', role: 'Software Engineer', level: 'SDE_I' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 1, baseSalary: 1500000, bonus: 160000, stock: 250000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.92, isVerified: true },
  { companyName: 'Swiggy', role: 'Software Engineer', level: 'SDE_II' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 3, baseSalary: 2500000, bonus: 320000, stock: 700000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.91, isVerified: true },
  { companyName: 'Swiggy', role: 'Senior Engineer', level: 'SDE_III' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 7, baseSalary: 3800000, bonus: 550000, stock: 1500000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.89, isVerified: true },
  { companyName: 'Swiggy', role: 'Staff Engineer', level: 'STAFF' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 12, baseSalary: 6200000, bonus: 1100000, stock: 3200000, source: 'SCRAPED' as Source, confidenceScore: 0.83, isVerified: false },
  { companyName: 'Swiggy', role: 'Backend Engineer', level: 'SDE_II' as Level, location: 'Bengaluru', currency: 'INR' as Currency, experienceYears: 4, baseSalary: 2700000, bonus: 340000, stock: 800000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.90, isVerified: true },

  { companyName: 'Zepto', role: 'Software Engineer', level: 'SDE_I' as Level, location: 'Mumbai', currency: 'INR' as Currency, experienceYears: 1, baseSalary: 1700000, bonus: 200000, stock: 400000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.90, isVerified: true },
  { companyName: 'Zepto', role: 'Software Engineer', level: 'SDE_II' as Level, location: 'Mumbai', currency: 'INR' as Currency, experienceYears: 3, baseSalary: 2800000, bonus: 380000, stock: 900000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.89, isVerified: true },
  { companyName: 'Zepto', role: 'Senior Engineer', level: 'SDE_III' as Level, location: 'Mumbai', currency: 'INR' as Currency, experienceYears: 6, baseSalary: 4200000, bonus: 650000, stock: 1800000, source: 'CONTRIBUTOR' as Source, confidenceScore: 0.87, isVerified: true },
  { companyName: 'Zepto', role: 'Staff Engineer', level: 'STAFF' as Level, location: 'Mumbai', currency: 'INR' as Currency, experienceYears: 10, baseSalary: 6800000, bonus: 1400000, stock: 4000000, source: 'SCRAPED' as Source, confidenceScore: 0.82, isVerified: false },
  { companyName: 'Zepto', role: 'Frontend Engineer', level: 'SDE_I' as Level, location: 'Mumbai', currency: 'INR' as Currency, experienceYears: 2, baseSalary: 1600000, bonus: 180000, stock: 350000, source: 'AI_INFERRED' as Source, confidenceScore: 0.73, isVerified: false },
]

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.salary.deleteMany()
  await prisma.company.deleteMany()

  // Create companies
  const companyMap = new Map<string, string>()

  for (const c of companies) {
    const slug = slugify(c.name)
    const normalized = normalizeCompanyName(c.name)

    const company = await prisma.company.create({
      data: {
        name: c.name,
        slug,
        normalizedName: normalized,
        industry: c.industry,
        headquarters: c.headquarters,
        foundedYear: c.foundedYear,
        headcountRange: c.headcountRange,
      },
    })
    companyMap.set(c.name, company.id)
    console.log(`  ✔ Company: ${c.name} (${slug})`)
  }

  // Create salaries
  let count = 0
  for (const s of salaries) {
    const companyId = companyMap.get(s.companyName)
    if (!companyId) {
      console.warn(`  ⚠ Company not found: ${s.companyName}`)
      continue
    }

    const totalCompensation = s.baseSalary + s.bonus + s.stock

    await prisma.salary.create({
      data: {
        companyId,
        role: s.role,
        level: s.level,
        location: s.location,
        currency: s.currency,
        experienceYears: s.experienceYears,
        baseSalary: BigInt(s.baseSalary),
        bonus: BigInt(s.bonus),
        stock: BigInt(s.stock),
        totalCompensation: BigInt(totalCompensation),
        source: s.source,
        confidenceScore: s.confidenceScore,
        isVerified: s.isVerified,
      },
    })
    count++
  }

  console.log(`\n✅ Seeded ${count} salary records across ${companies.length} companies`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
