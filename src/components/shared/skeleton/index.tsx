import { CSSProperties } from 'react'
import cx from 'clsx'

export function Skeleton({
  variant,
  style
}: {
  variant: 'text' | 'rect' | 'circle'
  style?: CSSProperties
}) {
  const base = 'block w-full bg-[#f0f0f0] rounded animate-pulse'
  let variantClass = ''
  if (variant === 'text') {
    variantClass = ''
  } else if (variant === 'rect') {
    variantClass = ''
  } else if (variant === 'circle') {
    variantClass = 'rounded-full'
  }
  return <div className={cx(base, variantClass)} style={style} />
}
