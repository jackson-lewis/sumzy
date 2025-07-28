import React from 'react'
import { Input } from '@/components/ui/input'

export interface CurrencyInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  name: string
  value?: string | number
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  required?: boolean
  autoFocus?: boolean
  className?: string
}

export function CurrencyInput({
  label,
  name,
  value,
  onChange,
  required,
  autoFocus,
  className = '',
  ...props
}: CurrencyInputProps) {
  return (
    <div>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none font-mono">
          £
        </span>
        <Input
          id={name}
          name={name}
          type="number"
          inputMode="decimal"
          step="any"
          value={value}
          onChange={onChange}
          required={required}
          autoFocus={autoFocus}
          className={`pl-7 font-mono appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${className}`}
          {...props}
        />
      </div>
    </div>
  )
}
