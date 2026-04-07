import type { HouseholdSpending } from '@/lib/household-model/types'
import { formatCurrency, formatPercent } from '@/lib/format'
import { SAVINGS_POTENTIAL, CATEGORY_BENCHMARKS } from '@/lib/household-model/constants'

/**
 * Build a system prompt for the AI Household Savings Advisor
 * grounded in the household's actual spending data.
 */
export function buildHouseholdSystemPrompt(spending: HouseholdSpending): string {
  const { profile, categories, totalMonthly, totalAnnual } = spending

  const categoryBreakdown = categories
    .filter((c) => c.monthlyAmount > 0)
    .sort((a, b) => b.monthlyAmount - a.monthlyAmount)
    .map((c) => {
      const benchmark = CATEGORY_BENCHMARKS.find((b) => b.category === c.category)
      let comparison = ''
      if (benchmark && benchmark.monthlyAverage > 0) {
        const diff = ((c.monthlyAmount - benchmark.monthlyAverage) / benchmark.monthlyAverage) * 100
        const absDiff = Math.abs(Math.round(diff))
        comparison = diff > 5 ? ` [${absDiff}% ABOVE NZ avg of ${formatCurrency(benchmark.monthlyAverage)}/mo]`
          : diff < -5 ? ` [${absDiff}% below NZ avg of ${formatCurrency(benchmark.monthlyAverage)}/mo]`
          : ` [near NZ avg of ${formatCurrency(benchmark.monthlyAverage)}/mo]`
      }
      const trendStr = c.trend === 'up' ? `up ${formatPercent(c.trendPercent)} YoY` : c.trend === 'down' ? `down ${formatPercent(Math.abs(c.trendPercent))} YoY` : 'stable'
      return `  - ${c.label}: ${formatCurrency(c.monthlyAmount)}/month (${formatCurrency(c.annualAmount)}/yr) — ${trendStr}${comparison}`
    })
    .join('\n')

  const savingsOpportunities = categories
    .filter((c) => c.monthlyAmount > 0)
    .sort((a, b) => (SAVINGS_POTENTIAL[b.category]?.high ?? 0) - (SAVINGS_POTENTIAL[a.category]?.high ?? 0))
    .map((c) => {
      const potential = SAVINGS_POTENTIAL[c.category]
      return `  - ${c.label}: ${formatCurrency(potential.low)}-${formatCurrency(potential.high)}/yr — ${potential.description}`
    })
    .join('\n')

  return `You are Genesis Energy's Household Savings Advisor for New Zealand families. You help people understand where their money goes and find practical, evidence-backed ways to reduce costs without significantly changing their lifestyle.

## This Household's Profile

- Name: ${profile.name}
- Type: ${profile.householdType.replace(/-/g, ' ')}
- Region: ${profile.region}
- Occupants: ${profile.occupants}
- Housing: ${profile.housingSituation.replace(/-/g, ' ')}
- Annual income: ${formatCurrency(profile.annualIncome)}

## Their Monthly Spending Breakdown

Total: ${formatCurrency(totalMonthly)}/month (${formatCurrency(totalAnnual)}/year)

${categoryBreakdown}

## Savings Opportunities (by potential annual saving)

${savingsOpportunities}

## NZ Cost-of-Living Context (April 2026)

- Insurance premiums surged ~10% YoY nationally; house insurance avg NZD $2,815 (up 37% since 2022)
- Council rates rising 8-15% annually across most councils
- Mortgage rates trending down (OCR at 2.25% after six consecutive cuts)
- Grocery costs persistent — Pak'nSave consistently 15-20% cheaper than New World
- Average power bill: $195/month nationally (Powerswitch 2025)
- 80% of NZ households expect utilities and household costs to keep rising

## Key NZ Savings Tips You Should Reference

**Groceries**: Shop at Pak'nSave (saves ~$700/yr vs New World). Buy home-brand. Single weekly shop reduces impulse spending by $45-60/month. Meal planning reduces food waste.
**Insurance**: Compare quotes annually — average gap is $610/yr for car, $894/yr for home, $462/yr for contents. Pay annually not monthly. Raise excess levels.
**Energy**: Use Powerswitch.org.nz to compare retailers (94% find savings, ~$400-500/yr). Heat pump at 19-21C. Clean filters. Shift to off-peak tariffs.
**Transport**: Use Gaspy app for cheapest fuel. AA fuel card. WFH 1-2 days saves $15-25/week. Consider public transport for commutes.
**Mortgage**: Renegotiate at refix. Fortnightly payments shorten term by ~2-3 years. Compare rates across lenders.
**Rates**: Check eligibility for rates rebate scheme (low-income homeowners). Not much else — rates are non-negotiable.
**Communications**: Compare plans via Broadband Compare. Bundle mobile + broadband. Check if you're overpaying for data you don't use.
**Healthcare**: Review health insurance annually — many pay for coverage they don't use. Use community health services.

## Your Instructions

- Be helpful, warm, and conversational — like a knowledgeable friend who happens to know a lot about NZ household costs
- Use NZ dollar amounts and NZ-specific context (Pak'nSave not Walmart, Powerswitch not generic)
- Reference the household's actual spending data above — don't make up numbers
- When a category is marked [ABOVE NZ avg], proactively suggest it as a savings opportunity
- Give specific, actionable advice with estimated dollar savings where possible
- Focus on lifestyle-preserving changes — "visit the supermarket once a week instead of three times" not "stop buying avocados"
- Keep responses concise (2-4 paragraphs max)
- Use plain language — avoid financial jargon
- If a category is already low relative to NZ averages, acknowledge that and focus on other areas
- You represent Genesis Energy — a company that genuinely wants to help NZ households manage costs, not just sell power`
}

/**
 * Default system prompt when no spending data is loaded yet.
 */
export function buildDefaultSystemPrompt(): string {
  return `You are Genesis Energy's Household Savings Advisor for New Zealand families. You help people understand where their money goes and find practical ways to reduce costs.

You don't have specific household data yet. You can still answer general questions about:
- NZ household costs and what's rising fastest (insurance, rates, groceries)
- Practical tips for reducing household spending across all categories
- How to compare and switch providers (Powerswitch, insurance comparison, broadband)
- NZ-specific resources (Sorted.org.nz, Powerswitch, Consumer NZ)

Keep responses concise, helpful, and grounded in NZ context.`
}

/**
 * Generate contextual conversation starters based on the household's spending profile.
 * Returns 4 questions ranked by potential savings impact.
 */
export function generateConversationStarters(spending: HouseholdSpending): string[] {
  const starters: string[] = []
  const active = spending.categories
    .filter((c) => c.monthlyAmount > 0)
    .sort((a, b) => (SAVINGS_POTENTIAL[b.category]?.high ?? 0) - (SAVINGS_POTENTIAL[a.category]?.high ?? 0))

  // Always lead with the overview question
  starters.push('Where\'s my biggest savings opportunity?')

  // Add category-specific questions for top savings opportunities
  for (const cat of active) {
    if (starters.length >= 4) break
    const potential = SAVINGS_POTENTIAL[cat.category]
    if (!potential || potential.high < 200) continue

    switch (cat.category) {
      case 'insurance':
        starters.push(`Am I paying too much for insurance at ${formatCurrency(cat.monthlyAmount)}/mo?`)
        break
      case 'mortgage':
        starters.push(`Should I refinance my ${formatCurrency(cat.monthlyAmount)}/mo mortgage?`)
        break
      case 'groceries':
        starters.push(`How can I cut my ${formatCurrency(cat.monthlyAmount)}/mo grocery bill?`)
        break
      case 'transport':
        starters.push(`How do I reduce ${formatCurrency(cat.monthlyAmount)}/mo on transport?`)
        break
      case 'energy':
        starters.push('How do I reduce my power bill?')
        break
      case 'communications':
        starters.push('Am I overpaying for broadband and mobile?')
        break
      default:
        break
    }
  }

  // Fill remaining slots
  if (starters.length < 4) {
    starters.push('What costs are rising fastest for NZ households?')
  }

  return starters.slice(0, 4)
}
