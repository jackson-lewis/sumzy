import { ReportGenerator } from '@/services/reporting/generate'

describe('Report generator constructor', () => {
  it('should set date', () => {
    const reportGenerator = new ReportGenerator(1, 2025, 1)
    const date = new Date(2025, 0, 1)

    expect(reportGenerator.date.toISOString()).toBe(date.toISOString())
  })
})