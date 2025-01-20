export function formatAmount(amount: number) {
  return Number(amount).toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP'
    // roundingPriority: 'morePrecision'
  })
}

export function formatDate(date: Date) {
  const _date = new Date(date)
  return _date.toLocaleDateString('en-GB')
}
