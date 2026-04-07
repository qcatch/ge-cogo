import type { EnergyBreakdown } from './types'

export interface MonthlyBill {
  month: string
  monthShort: string
  electricity: number
  gas: number
  transport: number
  total: number
}

/**
 * NZ Southern Hemisphere seasonal multipliers.
 * Index 0 = January, 11 = December.
 */
const SEASONAL_ELECTRICITY: number[] = [
  0.85, 0.85, 1.0, 1.05, 1.15, 1.30, 1.35, 1.30, 1.10, 1.0, 0.90, 0.85,
]

const SEASONAL_GAS: number[] = [
  0.60, 0.60, 0.80, 1.00, 1.20, 1.50, 1.60, 1.50, 1.20, 0.90, 0.70, 0.60,
]

const SEASONAL_TRANSPORT: number[] = [
  1.05, 1.00, 1.00, 1.00, 1.00, 0.95, 0.95, 0.95, 1.00, 1.00, 1.00, 1.10,
]

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const MONTH_SHORTS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

/** Add ±jitter% random variation (seeded by month index for consistency) */
function jitter(value: number, monthIndex: number, seed: number): number {
  // Simple deterministic pseudo-random based on month + seed
  const hash = Math.sin(monthIndex * 127.1 + seed * 311.7) * 43758.5453
  const rand = hash - Math.floor(hash) // 0-1
  const variation = 1 + (rand - 0.5) * 0.10 // ±5%
  return Math.round(value * variation)
}

/**
 * Generate a simulated 12-month bill history from annual cost data.
 * Returns months in chronological order ending at the current month.
 */
export function generateBillHistory(currentCosts: EnergyBreakdown): MonthlyBill[] {
  const now = new Date()
  const currentMonth = now.getMonth() // 0-11
  const monthlyElec = currentCosts.electricity / 12
  const monthlyGas = currentCosts.gas / 12
  const monthlyTransport = currentCosts.transport / 12

  const history: MonthlyBill[] = []

  for (let i = 11; i >= 0; i--) {
    const monthIdx = (currentMonth - i + 12) % 12

    const elec = jitter(monthlyElec * SEASONAL_ELECTRICITY[monthIdx], monthIdx, 1)
    const gas = jitter(monthlyGas * SEASONAL_GAS[monthIdx], monthIdx, 2)
    const transport = jitter(monthlyTransport * SEASONAL_TRANSPORT[monthIdx], monthIdx, 3)

    history.push({
      month: MONTH_NAMES[monthIdx],
      monthShort: MONTH_SHORTS[monthIdx],
      electricity: elec,
      gas: gas,
      transport: transport,
      total: elec + gas + transport,
    })
  }

  return history
}
