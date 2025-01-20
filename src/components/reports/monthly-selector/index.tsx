'use client'

import { ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useActiveMonth, useActiveYear } from '@/lib/form-submit'

export default function MonthlySelector() {
  let year = useActiveYear()
  let month = useActiveMonth()
  const router = useRouter()

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const { value } = event.target
    const valueAsNumber = Number(value)

    if (value.length === 4) {
      year = value
    } else if (valueAsNumber > 0 && valueAsNumber <= 12) {
      month = value
    }

    router.push(`?year=${year}&month=${month}`)
  }

  return (
    <div>
      <select name="year" id="year" value={year} onChange={handleChange}>
        <option>2023</option>
        <option>2024</option>
        <option>2025</option>
      </select>
      <select name="month" id="month" value={month} onChange={handleChange}>
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
        <option>6</option>
        <option>7</option>
        <option>8</option>
        <option>9</option>
        <option>10</option>
        <option>11</option>
        <option>12</option>
      </select>
    </div>
  )
}
