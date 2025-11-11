import { ChangeEvent, useState } from 'react'
import { Input } from '@/components/ui/input'

function formatDate(date?: Date) {
  const today = date && !isNaN(date.getTime()) ? date : new Date()
  const day = today.getDate()
  const month = today.getMonth() + 1

  return [
    today.getFullYear(),
    month > 9 ? month : `0${month}`,
    day > 9 ? day : `0${day}`
  ].join('-')
}

export default function DateSelector({ value }: { value?: Date }) {
  const [date, setDate] = useState<string>(() => formatDate(value))

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
