import { PrismaClient } from '@prisma/client'
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended'
import { prisma } from '@/lib/prisma'

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>

jest.mock('@/lib/prisma', () => {
  const originalModule = jest.requireActual('@/lib/prisma')

  if (/integration/.test(expect.getState().testPath || '')) {
    return {
      __esModule: true,
      ...originalModule
    }
  }

  return {
    __esModule: true,
    prisma: mockDeep<PrismaClient>()
  }
})

beforeEach(() => {
  if (!/integration/.test(expect.getState().testPath || '')) {
    mockReset(prismaMock)
  }
})
