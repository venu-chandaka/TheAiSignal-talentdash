import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

function normalizePostgresUrl(connectionString: string): string {
  if (!connectionString) return connectionString

  const url = new URL(connectionString)
  if (url.searchParams.get('sslmode') === 'require') {
    url.searchParams.set('sslmode', 'verify-full')
  }

  return url.toString()
}

const connectionString = normalizePostgresUrl(
  process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? ''
)

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma
