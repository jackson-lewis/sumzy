import { Report, User } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export async function seedUser(user: Partial<User> = {}) {
  return prisma.user.create({
    data: {
      id: 1,
      name: 'Jackson Lewis',
      email: 'jacksonlwss@gmail.com',
      password: 'Password1!',
      verified: true,
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
