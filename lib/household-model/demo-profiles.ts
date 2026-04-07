import type { HouseholdProfile, HouseholdSpending, CategorySpending } from './types'

/**
 * Pre-built NZ household profiles for stakeholder demonstrations.
 * Each profile represents a realistic household with spending data
 * sourced from Stats NZ HES 2023 and supplementary government data.
 */

function buildSpending(profile: HouseholdProfile, categories: CategorySpending[]): HouseholdSpending {
  const totalMonthly = categories.reduce((sum, c) => sum + c.monthlyAmount, 0)
  const totalAnnual = categories.reduce((sum, c) => sum + c.annualAmount, 0)
  // Recalculate percentages to ensure they sum to 100
  const withPercent = categories.map((c) => ({
    ...c,
    percentOfTotal: Math.round((c.monthlyAmount / totalMonthly) * 100),
  }))
  // Fix rounding — add remainder to largest category
  const percentSum = withPercent.reduce((sum, c) => sum + c.percentOfTotal, 0)
  if (percentSum !== 100 && withPercent.length > 0) {
    const largest = withPercent.reduce((max, c) => c.monthlyAmount > max.monthlyAmount ? c : max, withPercent[0])
    largest.percentOfTotal += 100 - percentSum
  }
  return { profile, categories: withPercent, totalMonthly, totalAnnual }
}

export const DEMO_PROFILES: Record<string, HouseholdSpending> = {
  'auckland-single': buildSpending(
    {
      name: 'Auckland Single Professional',
      description: 'Young professional renting a one-bedroom in Grey Lynn',
      region: 'auckland',
      occupants: 1,
      householdType: 'single-renter',
      housingSituation: 'renting',
      annualIncome: 72000,
    },
    [
      { category: 'mortgage', label: 'Rent', monthlyAmount: 2000, annualAmount: 24000, percentOfTotal: 0, trend: 'up', trendPercent: 9 },
      { category: 'groceries', label: 'Groceries', monthlyAmount: 580, annualAmount: 6960, percentOfTotal: 0, trend: 'up', trendPercent: 4 },
      { category: 'transport', label: 'Transport', monthlyAmount: 420, annualAmount: 5040, percentOfTotal: 0, trend: 'up', trendPercent: 6 },
      { category: 'energy', label: 'Energy', monthlyAmount: 165, annualAmount: 1980, percentOfTotal: 0, trend: 'up', trendPercent: 8 },
      { category: 'insurance', label: 'Insurance', monthlyAmount: 220, annualAmount: 2640, percentOfTotal: 0, trend: 'up', trendPercent: 12 },
      { category: 'communications', label: 'Communications', monthlyAmount: 155, annualAmount: 1860, percentOfTotal: 0, trend: 'stable', trendPercent: 2 },
      { category: 'healthcare', label: 'Healthcare', monthlyAmount: 95, annualAmount: 1140, percentOfTotal: 0, trend: 'stable', trendPercent: 3 },
      { category: 'rates', label: 'Council Rates', monthlyAmount: 0, annualAmount: 0, percentOfTotal: 0, trend: 'stable', trendPercent: 0 },
    ],
  ),

  'wellington-couple': buildSpending(
    {
      name: 'Wellington Couple',
      description: 'Couple with a mortgage in Karori, both working',
      region: 'wellington',
      occupants: 2,
      householdType: 'couple-mortgage',
      housingSituation: 'mortgage',
      annualIncome: 145000,
    },
    [
      { category: 'mortgage', label: 'Mortgage', monthlyAmount: 3030, annualAmount: 36360, percentOfTotal: 0, trend: 'down', trendPercent: -5 },
      { category: 'groceries', label: 'Groceries', monthlyAmount: 1080, annualAmount: 12960, percentOfTotal: 0, trend: 'up', trendPercent: 4 },
      { category: 'transport', label: 'Transport', monthlyAmount: 780, annualAmount: 9360, percentOfTotal: 0, trend: 'up', trendPercent: 6 },
      { category: 'rates', label: 'Council Rates', monthlyAmount: 460, annualAmount: 5520, percentOfTotal: 0, trend: 'up', trendPercent: 15 },
      { category: 'insurance', label: 'Insurance', monthlyAmount: 410, annualAmount: 4920, percentOfTotal: 0, trend: 'up', trendPercent: 10 },
      { category: 'energy', label: 'Energy', monthlyAmount: 250, annualAmount: 3000, percentOfTotal: 0, trend: 'up', trendPercent: 8 },
      { category: 'communications', label: 'Communications', monthlyAmount: 195, annualAmount: 2340, percentOfTotal: 0, trend: 'stable', trendPercent: 1 },
      { category: 'healthcare', label: 'Healthcare', monthlyAmount: 140, annualAmount: 1680, percentOfTotal: 0, trend: 'stable', trendPercent: 3 },
    ],
  ),

  'christchurch-family': buildSpending(
    {
      name: 'Christchurch Family',
      description: 'Family of 4 with a mortgage in Riccarton, two school-age kids',
      region: 'canterbury',
      occupants: 4,
      householdType: 'family-mortgage',
      housingSituation: 'mortgage',
      annualIncome: 160000,
    },
    [
      { category: 'mortgage', label: 'Mortgage', monthlyAmount: 2820, annualAmount: 33840, percentOfTotal: 0, trend: 'down', trendPercent: -5 },
      { category: 'groceries', label: 'Groceries', monthlyAmount: 1650, annualAmount: 19800, percentOfTotal: 0, trend: 'up', trendPercent: 5 },
      { category: 'transport', label: 'Transport', monthlyAmount: 1050, annualAmount: 12600, percentOfTotal: 0, trend: 'up', trendPercent: 7 },
      { category: 'insurance', label: 'Insurance', monthlyAmount: 540, annualAmount: 6480, percentOfTotal: 0, trend: 'up', trendPercent: 14 },
      { category: 'rates', label: 'Council Rates', monthlyAmount: 351, annualAmount: 4212, percentOfTotal: 0, trend: 'up', trendPercent: 12 },
      { category: 'energy', label: 'Energy', monthlyAmount: 310, annualAmount: 3720, percentOfTotal: 0, trend: 'up', trendPercent: 8 },
      { category: 'communications', label: 'Communications', monthlyAmount: 250, annualAmount: 3000, percentOfTotal: 0, trend: 'stable', trendPercent: 2 },
      { category: 'healthcare', label: 'Healthcare', monthlyAmount: 230, annualAmount: 2760, percentOfTotal: 0, trend: 'up', trendPercent: 5 },
    ],
  ),

  'tauranga-retired': buildSpending(
    {
      name: 'Tauranga Retired Couple',
      description: 'Retired couple in Mount Maunganui, home owned outright',
      region: 'bay-of-plenty',
      occupants: 2,
      householdType: 'retired-homeowner',
      housingSituation: 'owned-outright',
      annualIncome: 62000,
    },
    [
      { category: 'groceries', label: 'Groceries', monthlyAmount: 870, annualAmount: 10440, percentOfTotal: 0, trend: 'up', trendPercent: 4 },
      { category: 'healthcare', label: 'Healthcare', monthlyAmount: 480, annualAmount: 5760, percentOfTotal: 0, trend: 'up', trendPercent: 8 },
      { category: 'transport', label: 'Transport', monthlyAmount: 520, annualAmount: 6240, percentOfTotal: 0, trend: 'up', trendPercent: 5 },
      { category: 'insurance', label: 'Insurance', monthlyAmount: 420, annualAmount: 5040, percentOfTotal: 0, trend: 'up', trendPercent: 11 },
      { category: 'rates', label: 'Council Rates', monthlyAmount: 342, annualAmount: 4104, percentOfTotal: 0, trend: 'up', trendPercent: 10 },
      { category: 'energy', label: 'Energy', monthlyAmount: 280, annualAmount: 3360, percentOfTotal: 0, trend: 'up', trendPercent: 7 },
      { category: 'communications', label: 'Communications', monthlyAmount: 130, annualAmount: 1560, percentOfTotal: 0, trend: 'stable', trendPercent: 1 },
      { category: 'mortgage', label: 'Housing', monthlyAmount: 0, annualAmount: 0, percentOfTotal: 0, trend: 'stable', trendPercent: 0 },
    ],
  ),
}
