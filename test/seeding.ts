import {
  type Event,
  Prisma,
  type Report,
  type Transaction,
  type User
} from '@prisma/client'
import { JsonValue } from '@prisma/client/runtime/library'
import { prisma } from '@/lib/prisma'

export const userData: Pick<User, 'name' | 'email' | 'password'> = {
  name: 'Jackson Lewis',
  email: 'jacksonlwss@gmail.com',
  password: 'Password1!'
}

export async function seedUser(user: Partial<User> = {}) {
  return prisma.user.create({
    data: {
      id: 1,
      verified: true,
      ...userData,
      ...user
    }
  })
}

export async function seedReport(report: Partial<Report> = {}) {
  const reportDate = new Date(2025, 0, 1)

  return prisma.report.create({
    data: {
      id: 1,
      userId: 1,
      date: reportDate,
      lastUpdatedDate: reportDate,
      tIncome: 1000,
      tExpense: 500,
      tSurplus: 500,
      ...report,
      tCategories: {
        1: 500,
        2: 1000,
        ...((report.tCategories as unknown) || {})
      },
      compare: {
        prevMonth: null,
        yearOverYear: null,
        ...((report.compare as unknown) || {})
      }
    }
  })
}

const eventBase: Event = {
  id: 1,
  aggregateId: 1,
  createdAt: new Date(),
  eventType: 'CREATED',
  eventData: {
    id: 1,
    amount: 10,
    date: new Date()
  } as unknown as JsonValue
}

export const eventWithDefaultCategory: Event = {
  ...eventBase,
  eventData: {
    ...(eventBase.eventData as unknown as Record<string, unknown>),
    defaultCategoryId: 1,
    categoryType: 'DEFAULT'
  } as unknown as JsonValue
}

export const eventWithUserCategory: Event = {
  ...eventBase,
  eventData: {
    ...(eventBase.eventData as unknown as Record<string, unknown>),
    categoryId: 2,
    categoryType: 'USER'
  } as unknown as JsonValue
}

export const transaction: Transaction = {
  id: 1,
  userId: 1,
  amount: new Prisma.Decimal(10),
  date: new Date(2024, 10, 29),
  categoryType: 'DEFAULT',
  categoryId: null,
  defaultCategoryId: 1,
  description: 'Test transaction',
  merchant: 1,
  frequency: 'one_time'
}
