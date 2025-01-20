import { ReportGenerator } from '@/services/reporting/generate'

describe('Get end of month date', () => {
  it('should set date as 31st for January 2025', () => {
    const generator = new ReportGenerator(1, 2025, 1)
    const result = generator.getEndOfMonth()

    expect(result.getDate()).toBe(31)
  })

  it('should set date as 28th for February 2025', () => {
    const generator = new ReportGenerator(1, 2025, 2)
    const result = generator.getEndOfMonth()

    expect(result.getDate()).toBe(28)
  })

  it('should set date as 30th for April 2025', () => {
    const generator = new ReportGenerator(1, 2025, 4)
    const result = generator.getEndOfMonth()

    expect(result.getDate()).toBe(30)
  })

  it('should keep year as 2025', () => {
    const generator = new ReportGenerator(1, 2025, 1)
    const result = generator.getEndOfMonth()

    expect(result.getFullYear()).toBe(2025)
  })

  it('should keep month as January, index 0', () => {
    const generator = new ReportGenerator(1, 2025, 1)
    const result = generator.getEndOfMonth()

    expect(result.getMonth()).toBe(0)
  })

  it('should set hours to 23', () => {
    const generator = new ReportGenerator(1, 2025, 1)
    const result = generator.getEndOfMonth()

    expect(result.getHours()).toBe(23)
  })

  it('should set minutes to 59', () => {
    const generator = new ReportGenerator(1, 2025, 1)
    const result = generator.getEndOfMonth()

    expect(result.getMinutes()).toBe(59)
  })

  it('should set seconds to 59', () => {
    const generator = new ReportGenerator(1, 2025, 1)
    const result = generator.getEndOfMonth()

    expect(result.getSeconds()).toBe(59)
  })
})
