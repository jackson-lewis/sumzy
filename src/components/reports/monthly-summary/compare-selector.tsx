import { ComparePeriod } from '@/types'
import { Dispatch, SetStateAction } from 'react'
import styles from './style.module.scss'

export default function CompareSelector<CP extends ComparePeriod>({
  comparePeriod,
  setComparePeriod,
  hasPrevMonthReport,
  hasYearOverYearReport
}: {
  comparePeriod: CP
  setComparePeriod: Dispatch<SetStateAction<CP>>
  hasPrevMonthReport: boolean
  hasYearOverYearReport: boolean
}) {
  return (
    <div className={styles['compare-selector']}>
      <div>
        <input
          type="radio"
          name="compare"
          id="compare_prevMonth"
          value="prevMonth"
          disabled={!hasPrevMonthReport}
          checked={comparePeriod === 'prevMonth'}
          onChange={(event) => {
            setComparePeriod(event.target.value as CP)
          }}
        />
        <label htmlFor="compare_prevMonth">Last month</label>
      </div>
      <div>
        <input
          type="radio"
          name="compare"
          id="compare_yearOverYear"
          value="yearOverYear"
          disabled={!hasYearOverYearReport}
          checked={comparePeriod === 'yearOverYear'}
          onChange={(event) => {
            setComparePeriod(event.target.value as CP)
          }}
        />
        <label htmlFor="compare_yearOverYear">YoY</label>
      </div>
    </div>
  )
}