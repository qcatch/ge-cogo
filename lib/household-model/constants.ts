/**
 * NZ Household Spending Constants — 2024/25
 *
 * Sources:
 * - Stats NZ Household Expenditure Survey (HES), year ended June 2023
 * - Stats NZ Household Income and Housing Cost Statistics, year ended June 2024
 * - Powerswitch NZ (2025 electricity pricing)
 * - Auckland Council / Wellington City Council / Christchurch City Council rates 2025/26
 * - Taxpayers' Union Rates Dashboard 2025
 * - Consumer NZ grocery price comparisons (January 2025)
 * - Sorted.org.nz insurance comparison data (2024)
 */

import type { SpendingCategory, CategoryBenchmark, Region } from './types'

// ─── National Averages (NZD per week, Stats NZ HES 2023) ─────────────────────

/** Stats NZ HES 2023 — average household total weekly expenditure */
export const NZ_AVERAGE_WEEKLY_TOTAL = 1597.50

/**
 * Weekly averages per category.
 * Note: mortgage figure is for mortgage holders only (Stats NZ Jun 2024).
 */
export const NZ_AVERAGE_WEEKLY: Record<SpendingCategory, number> = {
  'energy': 45,
  'groceries': 299.50,
  'mortgage': 658.20,
  'rates': 85,
  'insurance': 80,
  'transport': 251.60,
  'communications': 39.20,
  'healthcare': 49.70,
}

// ─── Category Labels ──────────────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<SpendingCategory, string> = {
  'energy': 'Energy',
  'groceries': 'Groceries',
  'mortgage': 'Housing',
  'rates': 'Council Rates',
  'insurance': 'Insurance',
  'transport': 'Transport',
  'communications': 'Communications',
  'healthcare': 'Healthcare',
}

// ─── Category Icons (Lucide icon names) ───────────────────────────────────────

export const CATEGORY_ICONS: Record<SpendingCategory, string> = {
  'energy': 'Zap',
  'groceries': 'ShoppingCart',
  'mortgage': 'Home',
  'rates': 'Landmark',
  'insurance': 'Shield',
  'transport': 'Car',
  'communications': 'Wifi',
  'healthcare': 'Heart',
}

// ─── Category Benchmarks ──────────────────────────────────────────────────────

export const CATEGORY_BENCHMARKS: CategoryBenchmark[] = [
  { category: 'energy', label: 'Energy', weeklyAverage: 45, monthlyAverage: 195, annualAverage: 2340, source: 'Powerswitch NZ 2025' },
  { category: 'groceries', label: 'Groceries', weeklyAverage: 299.50, monthlyAverage: 1297, annualAverage: 15574, source: 'Stats NZ HES 2023' },
  { category: 'mortgage', label: 'Housing', weeklyAverage: 658.20, monthlyAverage: 2852, annualAverage: 34226, source: 'Stats NZ Jun 2024 (mortgage holders)' },
  { category: 'rates', label: 'Council Rates', weeklyAverage: 85, monthlyAverage: 368, annualAverage: 4420, source: 'Taxpayers Union Rates Dashboard 2025' },
  { category: 'insurance', label: 'Insurance', weeklyAverage: 80, monthlyAverage: 347, annualAverage: 4160, source: 'Sorted.org.nz / Quashed 2024' },
  { category: 'transport', label: 'Transport', weeklyAverage: 251.60, monthlyAverage: 1090, annualAverage: 13083, source: 'Stats NZ HES 2023' },
  { category: 'communications', label: 'Communications', weeklyAverage: 39.20, monthlyAverage: 170, annualAverage: 2038, source: 'Stats NZ HES 2023' },
  { category: 'healthcare', label: 'Healthcare', weeklyAverage: 49.70, monthlyAverage: 215, annualAverage: 2584, source: 'Stats NZ HES 2023' },
]

// ─── Regional Council Rates (NZD per year, 2025/26) ──────────────────────────

export const COUNCIL_RATES: Partial<Record<Region, number>> = {
  'auckland': 4069,
  'wellington': 5512,
  'canterbury': 4212,
  'waikato': 3800,
  'bay-of-plenty': 4100,
  'otago': 3900,
  'nelson': 4400,
}

// ─── Average Electricity by Region (NZD per month, 2025) ──────────────────────

export const ELECTRICITY_MONTHLY: Partial<Record<Region, number>> = {
  'northland': 210,
  'auckland': 165,
  'waikato': 185,
  'bay-of-plenty': 180,
  'wellington': 190,
  'nelson': 180,
  'canterbury': 210,
  'otago': 220,
  'southland': 230,
}

// ─── Savings Potential by Category (NZD per year, evidence-backed) ────────────

export const SAVINGS_POTENTIAL: Record<SpendingCategory, { low: number; high: number; description: string }> = {
  'energy': { low: 400, high: 500, description: 'Switch retailer via Powerswitch' },
  'groceries': { low: 500, high: 825, description: 'Shop at Pak\'nSave, buy home-brand' },
  'mortgage': { low: 2000, high: 10000, description: 'Refinance at lower rate, fortnightly payments' },
  'rates': { low: 0, high: 500, description: 'Rates rebate scheme if eligible' },
  'insurance': { low: 1000, high: 3000, description: 'Compare quotes annually across all lines' },
  'transport': { low: 500, high: 2000, description: 'Fuel cards, WFH days, carpooling' },
  'communications': { low: 200, high: 500, description: 'Compare broadband + mobile plans' },
  'healthcare': { low: 100, high: 500, description: 'Review health insurance, use community services' },
}
