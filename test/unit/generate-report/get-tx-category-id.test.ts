import { ReportGenerator } from '@/services/reporting/generate'
import { eventWithDefaultCategory, eventWithUserCategory } from '../../seeding'

describe('Get transaction category id', () => {
  it('should return category id for a default category', () => {
    const generator = new ReportGenerator(1, 2025, 1)
    const result = generator.getTxCategoryId(eventWithDefaultCategory)

    expect(result).toBe(1)
  })

  it('should return category id for a user category', () => {
    const generator = new ReportGenerator(1, 2025, 1)
    const result = generator.getTxCategoryId(eventWithUserCategory)

    expect(result).toBe(2)
  })
})
