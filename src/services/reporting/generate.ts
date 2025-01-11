import {
  TransactionFrequency,
  AggregateType,
  ComparePeriod,
  ReportTotals,
  CompareTotals,
  Totals,
} from '@/types/reporting'
import { prisma } from '@/lib/prisma'
import { CategoryType, Event, Transaction } from '@prisma/client'
import { JsonObject } from '@prisma/client/runtime/library'


export class ReportGenerator {
  private userId: number
  private year: number
  private month: number
  private date: Date
  private endOfMonth: Date
  private totals: ReportTotals
  private events!: Event[]

  constructor(userId: number, year: number, month: number) {
    this.userId = userId
    this.year = year
    this.month = month
    this.date = new Date(
      year,
      month - 1
    )
    this.endOfMonth = this.getEndOfMonth(this.date)
    this.totals = {
      income: 0,
      expense: 0,
      surplus: 0,
      categories: {}
    }
  }

  async generate() {
    this.events = await this.getEvents()

    if (!this.events.length) {
      return {
        success: false,
        message: 'No events found'
      }
    }

    this.calculateTotals('expense')
    this.calculateTotals('income')

    this.totals.surplus = this.totals.income - (this.totals.expense * -1)

    const compare: {
      [k in ComparePeriod]: CompareTotals | null
    } & JsonObject = {
      prevMonth: await this.compareTotals('prevMonth'),
      yearOverYear: await this.compareTotals('yearOverYear')
    }

    const lastUpdatedDate = new Date()

    const reportData = {
      userId: this.userId,
      tExpense: this.totals.expense || 0,
      tIncome: this.totals.income || 0,
      tSurplus: this.totals.surplus || 0,
      tCategories: this.totals.categories,
      compare,
      date: this.date,
      lastUpdatedDate
    }

    const existingReport = await prisma.report.findFirst({
      where: {
        userId: this.userId,
        date: this.date
      }
    })

    if (existingReport) {
      await prisma.report.update({
        where: {
          id: existingReport.id
        },
        data: {
          ...reportData
        }
      })
  
      /**
       * update comparable reports
       */
      await this.regenerateComparableReport('nextMonth')
      await this.regenerateComparableReport('yearOverYear')
  
      return reportData
    }
  
    return await prisma.report.create({
      data: reportData
    })
  }

  getEvents() {
    return prisma.event.findMany({
      where: {
        eventData: {
          path: ['userId'],
          equals: this.userId
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })
  }

  getEndOfMonth(date: Date) {
    const endOfMonth = new Date(date)
    let lastDayOfMonth = 30
  
    if ([0,2,4,6,7,9,11].indexOf(date.getMonth()) >= 0) {
      lastDayOfMonth = 31
    } else if (date.getMonth() === 1) {
      lastDayOfMonth = 28
    }
  
    endOfMonth.setDate(lastDayOfMonth)
    endOfMonth.setHours(23)
    endOfMonth.setMinutes(59)
    endOfMonth.setSeconds(59)
  
    return endOfMonth
  }

  calculateTotals<T extends AggregateType>(
    aggregateType: T,
    callback: ((event: Event) => void) | null = null
  ) {
    const calculateTotals = (event: Event) => {
      const amount = Number(this.getEventField(event, 'amount'))
      const categoryType = 
        this.getEventField(event, 'categoryType') as unknown as CategoryType
      const categoryTypeMarker = categoryType
        .toLocaleUpperCase().at(0) as string
      const categoryId = this.getTxCategoryId(event)
  
      this.totals[aggregateType] += amount
  
      if (categoryId) {
        this.totals.categories[categoryTypeMarker + categoryId] = amount + 
          (this.totals.categories[categoryTypeMarker + categoryId] || 0) || 0
      }
  
      if (typeof callback === 'function') {
        callback(event)
      }
    }
  
    this.calculateTransactionTotals(aggregateType, 'one_time', calculateTotals)
    this.calculateTransactionTotals(aggregateType, 'recurring', calculateTotals)
  }

  calculateTransactionTotals(
    aggregateType: AggregateType,
    frequency: TransactionFrequency,
    reducerFn: (event: Event) => void
  ) {
    const events = this.getEventsByType(aggregateType, frequency)
  
    const filterFn = frequency === 'one_time' ?
      this.filterOneTimeEvents :
      this.filterRecurringEvents
  
    filterFn(events).forEach(reducerFn)
  }

  getEventsByType(
    aggregateType: AggregateType,
    frequency: TransactionFrequency
  ) {
    const expenses: {
      [k: Transaction['id']]: Event[]
    } = {}
    const deletedExpenses: number[] = []

    ;(this.events)
      .filter((event) => {
        const transactionFrequency = this.getEventField(event, 'frequency')
        return (
          (
            (
              aggregateType === 'expense' && 
              Number((event.eventData as unknown as Transaction).amount) < 0
            ) || 
            (
              aggregateType === 'income' && 
              Number((event.eventData as unknown as Transaction).amount) > 0
            )
          ) &&
          transactionFrequency === frequency
        )
      })
      .map((event) => {
        const { aggregateId } = event

        if (event.eventType == 'DELETED') {
          deletedExpenses.push(aggregateId)
        }
    
        if (expenses[aggregateId]) {
          expenses[aggregateId].push(event)
        } else {
          expenses[aggregateId] = [event]
        }
      })

    deletedExpenses.forEach((expenseId) => {
      delete expenses[expenseId]
    })

    return Object.values(expenses)
  }

  filterOneTimeEvents(
    events: Event[][]
  ) {
    return events
      .map((events) => {
        return events.pop()
      })
      .filter((event) => event !== undefined)
      .filter((event) => {
        if (!event) {
          return false
        }
  
        const _transactionDate = this.getEventField(event, 'date') as string
        if (!_transactionDate) {
          return false
        }
        const transactionDate = new Date(_transactionDate)
  
        /**
         * Transactions from a previous month may be changes, so this
         * check should always be against the transaction date rather
         * than the event date itself.
         */
        return transactionDate >= this.date && transactionDate < this.endOfMonth
      })
  }

  filterRecurringEvents(
    events: Event[][]
  ) {
    return events
      .map((events) => {
        if (!events.length) {
          return null
        }
  
        let latestEvent!: Event | null
        
        events.map((event) => {
          const transactionDate = this.getEventField(event, 'date') as string
          const eventDate = new Date(
            event.eventType === 'CREATED' && transactionDate ?
              transactionDate : event.createdAt
          )
  
          if (eventDate < this.endOfMonth) {
            latestEvent = event
          } else {
            console.log('recurring event latest event not found', event.id)
          }
        })
  
        return latestEvent
      })
      .filter((event) => {
        return event !== null
      })
  }

  /**
   * Compare this report:
   * - previous month
   * - year on year
   */
  async compareTotals(
    period: ComparePeriod
  ): Promise<CompareTotals | null> {
    const compareDate = new Date(this.date)

    if (period === 'prevMonth') {
      if (this.month === 1) {
        compareDate.setMonth(11)
        compareDate.setFullYear(this.year - 1)
      } else {
        compareDate.setMonth(this.month - 2)
      }
    } else {
      compareDate.setFullYear(this.year - 1)
    }

    const compareReport = await prisma.report.findFirst({
      where: {
        userId: Number(this.userId),
        date: compareDate
      }
    })

    if (!compareReport) {
      return null
    }

    const compareTotals: Totals = {
      income: compareReport.tIncome,
      expense: compareReport.tExpense,
      surplus: compareReport.tSurplus
    }

    const calculateCompareTotal = (type: keyof Totals) => {
      const total = this.totals[type]
      const compareTotal = compareTotals[type]

      if (compareTotal === undefined) {
        return null
      }

      return {
        amount: total - compareTotal,
        percentage: Number((((total - compareTotal) / total) * 100).toFixed(2))
      }
    }

    const returnTotals = {
      income: calculateCompareTotal('income'),
      expense: calculateCompareTotal('expense'),
      surplus: calculateCompareTotal('surplus')
    }

    const allNull = Object
      .values(returnTotals)
      .every((totalValue) => {
        return !!totalValue
      })

    if (allNull) {
      return returnTotals
    }

    return null
  }

  async regenerateComparableReport(
    period: 'nextMonth' | 'yearOverYear'
  ) {
    const compareDate = new Date(this.date)
  
    if (period === 'nextMonth') {
      if (this.month === 12) {
        compareDate.setMonth(0)
        compareDate.setFullYear(this.year + 1)
      } else {
        compareDate.setMonth(this.month)
      }
    } else {
      compareDate.setFullYear(this.year + 1)
    }
  
    const report = await prisma.report.findFirst({
      where: {
        userId: Number(this.userId),
        date: compareDate
      }
    })
  
    if (report) {
      const comparableReport = new ReportGenerator(
        this.userId,
        compareDate.getFullYear(),
        compareDate.getMonth() + 1
      )

      await comparableReport.generate()
    }
  }

  getEventField(event: Event, field: string) {
    if (event.eventData && typeof event.eventData === 'object') {
      const eventData = event.eventData as JsonObject
      return eventData[field]
    }
    return false
  }
  
  
  getTxCategoryId(event: Event) {
    if (event.eventData && typeof event.eventData === 'object') {
      const eventData = event.eventData as unknown as Transaction
      const {
        categoryType,
        defaultCategoryId,
        categoryId
      } = eventData
  
      return categoryType === 'DEFAULT' ? defaultCategoryId : categoryId
    }
  
    return null
  }
}

export function generateReport(
  userId: number,
  year: number,
  month: number
) {
  const reportGenerator = new ReportGenerator(userId, year, month)
  return reportGenerator.generate()
}