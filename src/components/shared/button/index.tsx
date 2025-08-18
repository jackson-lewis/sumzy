import Link, { LinkProps } from 'next/link'
import cx from 'clsx'

type ButtonStyle = 'fill' | 'outline'
type ButtonColor = 'green' | 'white'

export type ButtonProps = {
  variant?: ButtonStyle
  color?: ButtonColor
}

function mergeClassNames(
  className?: string,
  variant: ButtonStyle = 'outline',
  color: ButtonColor = 'white'
) {
  const base =
    'inline-flex items-center justify-center font-semibold rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:pointer-events-none'
  const variantClasses = {
    fill: 'bg-green-600 text-white border border-green-600 hover:bg-green-700',
    outline:
      'bg-transparent text-green-600 border border-green-600 hover:bg-green-50'
  }
  const colorClasses = {
    green: '',
    white: 'text-white border-white hover:bg-white hover:text-green-600'
  }
  return cx(
    base,
    variantClasses[variant],
    color === 'white' ? colorClasses.white : colorClasses.green,
    className
  )
}

export default function LinkButton({
  children,
  variant = 'outline',
  color = 'white',
  ...rest
}: ButtonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> &
  LinkProps &
  React.RefAttributes<HTMLAnchorElement>) {
  return (
    <Link {...rest} className={mergeClassNames(rest.className, variant, color)}>
      {children}
    </Link>
  )
}

export function Button({
  children,
  variant = 'outline',
  color = 'white',
  ...rest
}: ButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.RefAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={mergeClassNames(rest.className, variant, color)}
    >
      {children}
    </button>
  )
}
