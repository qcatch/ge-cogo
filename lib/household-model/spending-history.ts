import type { SpendingCategory, HouseholdSpending, MonthlySpendingRecord } from './types'

/**
 * Southern Hemisphere seasonal multipliers by category.
 * Index 0 = January, 11 = December.
 *
 * Energy: peaks in winter (Jun-Aug) due to heating
 * Groceries: peaks in December (holidays), dips in Jan-Feb
 * Transport: slightly lower in winter, higher in summer holidays
 * Insurance: flat (paid monthly)
 * Rates: flat (smoothed over year)
 * Communications: flat
 * Healthcare: slightly higher in winter (flu season)
 * Mortgage: flat (fixed payments)
 */
const SEASONAL_MULTIPLIERS: Record<SpendingCategory, number[]> = {
  'energy':         [0.80, 0.80, 0.85, 0.95, 1.10, 1.20, 1.25, 1.20, 1.10, 0.95, 0.85, 0.80],
  'groceries':      [0.90, 0.95, 0.98, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.02, 1.05, 1.15],
  'transport':      [1.10, 1.05, 1.00, 1.00, 0.95, 0.90, 0.90, 0.90, 0.95, 1.00, 1.05, 1.15],
  'insurance':      [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00],
  'rates':          [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00],
  'communications': [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00],
  'healthcare':     [0.90, 0.90, 0.95, 1.00, 1.05, 1.10, 1.15, 1.10, 1.05, 1.00, 0.90, 0.85],
  'mortgage':       [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00],
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const MONTH_SHORTS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

const ALL_CATEGORIES: SpendingCategory[] = [
  'energy', 'groceries', 'mortgage', 'rates',
  'insurance', 'transport', 'communications', 'healthcare',
]

/** Deterministic ±5% jitter seeded by month index and category seed */
function jitter(value: number, monthIndex: number, seed: number): number {
  const hash = Math.sin(monthIndex * 127.1 + seed * 311.7) * 43758.5453
  const rand = hash - Math.floor(hash)
  const variation = 1 + (rand - 0.5) * 0.10
  return Math.round(value * variation)
}

/**
 * Generate a simulated 12-month spending history from household data.
 * Returns months in chronological order ending at the current month.
 */
export function generateSpendingHistory(spending: HouseholdSpending): MonthlySpendingRecord[] {
  const now = new Date()
  const currentMonth = now.getMonth()

  const monthlyByCategory: Record<SpendingCategory, number> = {} as Record<SpendingCategory, number>
  for (const cat of spending.categories) {
    monthlyByCategory[cat.category] = cat.monthlyAmount
  }

  const history: MonthlySpendingRecord[] = []

  for (let i = 11; i >= 0; i--) {
    const monthIdx = (currentMonth - i + 12) % 12
    const categories: Record<SpendingCategory, number> = {} as Record<SpendingCategory, number>
    let total = 0

    for (let catIdx = 0; catIdx < ALL_CATEGORIES.length; catIdx++) {
      const cat = ALL_CATEGORIES[catIdx]
      const base = monthlyByCategory[cat] ?? 0
      const seasonal = SEASONAL_MULTIPLIERS[cat][monthIdx]
      const amount = base > 0 ? jitter(Math.round(base * seasonal), monthIdx, catIdx + 1) : 0
      categories[cat] = amount
      total += amount
    }

    history.push({
      month: MONTH_NAMES[monthIdx],
      monthShort: MONTH_SHORTS[monthIdx],
      categories,
      total,
    })
  }

  return history
}
