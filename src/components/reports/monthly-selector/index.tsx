'use client'

import { ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useActiveMonth, useActiveYear } from '@/lib/form-submit'

export default function MonthlySelector() {
  const year = useActiveYear()
  const month = useActiveMonth()
  const router = useRouter()

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const { value, name } = event.target
    let newYear = year
    let newMonth = month

    if (name === 'year') {
      newYear = value
    } else if (name === 'month') {
      newMonth = value
    }

    router.push(`?year=${newYear}&month=${newMonth}`)
  }

  return (
    <div className="flex gap-4">
      <select name="year" id="year" value={year} onChange={handleChange}>
        <option>2022</option>
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
