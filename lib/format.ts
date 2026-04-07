const currencyFormatter = new Intl.NumberFormat('en-NZ', {
  style: 'currency',
  currency: 'NZD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const currencyDecimalFormatter = new Intl.NumberFormat('en-NZ', {
  style: 'currency',
  currency: 'NZD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const numberFormatter = new Intl.NumberFormat('en-NZ', {
  maximumFractionDigits: 0,
})

/** Format as NZD currency with no decimals: "$7,366" */
export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount)
}

/** Format as NZD currency with decimals: "$7,366.00" */
export function formatCurrencyDecimal(amount: number): string {
  return currencyDecimalFormatter.format(amount)
}

/** Format as short currency: "$7.4k" */
export function formatCurrencyShort(amount: number): string {
  if (Math.abs(amount) >= 1000) {
    return `$${(amount / 1000).toFixed(1)}k`
  }
  return formatCurrency(amount)
}

/** Format percentage: "36%" */
export function formatPercent(pct: number): string {
  return `${Math.round(pct)}%`
}

/** Format a number with commas: "7,366" */
export function formatNumber(n: number): string {
  return numberFormatter.format(Math.round(n))
}
