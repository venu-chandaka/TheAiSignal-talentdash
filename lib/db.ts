import { PrismaClient } from './generated/prisma/client'
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL ?? '',
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma