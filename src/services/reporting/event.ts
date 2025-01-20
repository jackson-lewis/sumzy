import { EventType, Transaction } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export async function storeEvent(eventData: Transaction, eventType: EventType) {
  const event = await prisma.event.create({
    data: {
      aggregateId: eventData.id,
      eventData,
      eventType
    }
  })

  console.log({ event })

  return event
}
