/** @jest-environment node */
import { prisma } from '@/lib/prisma'
import { ReportGenerator } from '@/services/reporting/generate'
import { seedReport, seedUser } from '@/test/seeding'

describe('Get an existing report', () => {
  beforeAll(async () => {
    await seedUser()
  })

  afterAll(async () => {
    const deleteReport = prisma.report.deleteMany()
    const deleteUser = prisma.user.deleteMany()
  
    await prisma.$transaction([
      deleteReport,
      deleteUser
    ])
  
    await prisma.$disconnect()
  })

  it('should return the report if it exists', async () => {
    const reportDate = new Date(2025, 0, 1)
    await seedReport()

    const generator = new ReportGenerator(1, 2025, 1)
    const report = await generator.getExistingReport()

    expect(report?.date.toISOString()).toBe(reportDate.toISOString())
  })
})