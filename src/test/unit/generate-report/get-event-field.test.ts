/** @jest-environment node */
import { ReportGenerator } from '@/services/reporting/generate'
import { Event } from '@prisma/client'
import { JsonValue } from '@prisma/client/runtime/library'

const event: Event = {
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

describe('getEventField', () => {
  it('should return amount from event data', () => {
    const generator = new ReportGenerator(1, 2025, 1)
    const result = generator.getEventField(event, 'amount')

    expect(result).toBe(10)
  })

  it('should return date from event data', () => {
    const generator = new ReportGenerator(1, 2025, 1)
    const result = generator.getEventField(event, 'date')

    expect(result).toBeInstanceOf(Date)
  })
})
