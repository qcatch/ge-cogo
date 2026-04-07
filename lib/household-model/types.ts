/** The 8 pillars of household cost */
export type SpendingCategory =
  | 'energy'
  | 'groceries'
  | 'mortgage'
  | 'rates'
  | 'insurance'
  | 'transport'
  | 'communications'
  | 'healthcare'

/** NZ regions for regional pricing and benchmarks */
export type Region =
  | 'northland'
  | 'auckland'
  | 'waikato'
  | 'bay-of-plenty'
  | 'gisborne'
  | 'hawkes-bay'
  | 'taranaki'
  | 'manawatu'
  | 'wellington'
  | 'nelson'
  | 'tasman'
  | 'marlborough'
  | 'west-coast'
  | 'canterbury'
  | 'otago'
  | 'southland'

/** Household archetypes for demo profiles */
export type HouseholdType = 'single-renter' | 'couple-mortgage' | 'family-mortgage' | 'retired-homeowner'

/** Housing situation affects which cost categories apply */
export type HousingSituation = 'renting' | 'mortgage' | 'owned-outright'

/** What defines a household */
export interface HouseholdProfile {
  name: string
  description: string
  region: Region
  occupants: number
  householdType: HouseholdType
  housingSituation: HousingSituation
  annualIncome: number
}

/** Spending for a single category */
export interface CategorySpending {
  category: SpendingCategory
  label: string
  monthlyAmount: number
  annualAmount: number
  percentOfTotal: number
  trend: 'up' | 'down' | 'stable'
  trendPercent: number
}

/** The full spending picture for a household */
export interface HouseholdSpending {
  profile: HouseholdProfile
  categories: CategorySpending[]
  totalMonthly: number
  totalAnnual: number
}

/** A single month in the spending history */
export interface MonthlySpendingRecord {
  month: string
  monthShort: string
  categories: Record<SpendingCategory, number>
  total: number
}

/** NZ benchmark for comparison */
export interface CategoryBenchmark {
  category: SpendingCategory
  label: string
  weeklyAverage: number
  monthlyAverage: number
  annualAverage: number
  source: string
}
