import { CSSProperties } from 'react'
import styles from './style.module.scss'

export function Skeleton({
  variant,
  style
}: {
  variant: 'text' | 'rect' | 'circle'
  style?: CSSProperties
}) {
  return (
    <div
      className={[styles.skeleton, styles[variant]].join(' ')}
      style={style}
    />
  )
}
