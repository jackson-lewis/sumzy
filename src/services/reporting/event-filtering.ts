import { prisma } from '@/lib/prisma'

export const oneTimeWhere = {
  AND: [
    {
      eventData: {
        path: ['userId'],
        equals: this.userId
      }
    },
    {
      eventData: {
        path: ['date'],
        gte: this.date.toISOString(),
        lte: this.endOfMonth.toISOString()
      }
    }
  ]
}

export const recurringWhere = {
  AND: [
    {
      eventData: {
        path: ['userId'],
        equals: this.userId
      },
      OR: [
        {
          AND: [
            {
              eventType: {
                equals: 'CREATED'
              }
            },
            {
              eventData: {
                path: ['date'],
                lte: this.endOfMonth.toISOString()
              }
            }
          ]
        },
        {
          AND: [
            {
              eventType: {
                not: 'CREATED'
              }
            },
            {
              createdAt: {
                lte: this.endOfMonth.toISOString()
              }
            }
          ]
        }
      ]
    }
  ]
}
