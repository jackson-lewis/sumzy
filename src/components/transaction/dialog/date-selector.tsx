import { ChangeEvent, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'

export default function DateSelector({ value }: { value?: Date }) {
  const [date, setDate] = useState<string>('')

  useEffect(() => {
    let today = value ? new Date(value) : new Date()

    if (today.toString() === 'Invalid Date') {
      today = new Date()
    }

    const day = today.getDate()
    const month = today.getMonth() + 1

    setDate(
      [
        today.getFullYear(),
        month > 10 ? month : `0${month}`,
        day > 10 ? day : `0${day}`
      ].join('-')
    )
  }, [value])

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setDate(event.target.value)
  }

  return (
    <div className="flex flex-col gap-1 mb-4">
      <label htmlFor="date" className="block text-sm font-medium mb-1">
        Date
      </label>
      <Input
        type="date"
        name="date"
        id="date"
        data-testid="date_selector_input"
        value={date}
        onChange={handleChange}
      />
    </div>
  )
}
