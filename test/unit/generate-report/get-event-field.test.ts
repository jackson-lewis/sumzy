/** @jest-environment node */
import { ReportGenerator } from '@/services/reporting/generate'
import { eventWithDefaultCategory } from '../../seeding'

describe('getEventField', () => {
  it('should return amount from event data', () => {
    const generator = new ReportGenerator(1, 2025, 1)
    const result = generator.getEventField(eventWithDefaultCategory, 'amount')

    expect(result).toBe(10)
  })

  it('should return date from event data', () => {
    const generator = new ReportGenerator(1, 2025, 1)
    const result = generator.getEventField(eventWithDefaultCategory, 'date')

    expect(result).toBeInstanceOf(Date)
  })
})
