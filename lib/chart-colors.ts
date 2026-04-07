import type { SpendingCategory } from '@/lib/household-model/types'

/**
 * Maps each spending category to a CSS chart colour variable.
 * Ordered by visual weight — largest categories get the most prominent colours.
 */
export const CHART_COLORS: Record<SpendingCategory, string> = {
  'mortgage': 'var(--chart-1)',       // Ultra Orange
  'groceries': 'var(--chart-2)',      // Ultra Violet
  'transport': 'var(--chart-5)',      // Teal
  'insurance': 'var(--chart-6)',      // Warm Coral
  'rates': 'var(--chart-3)',          // Space
  'energy': 'var(--chart-7)',         // Soft Purple
  'communications': 'var(--chart-8)', // Sage Green
  'healthcare': 'var(--chart-4)',     // Sunwash Yellow
}

/** Ordered list of categories for consistent chart rendering */
export const CHART_CATEGORY_ORDER: SpendingCategory[] = [
  'mortgage', 'groceries', 'transport', 'insurance',
  'rates', 'energy', 'communications', 'healthcare',
]
