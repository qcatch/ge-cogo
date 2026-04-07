# Feature: Household Cost Dashboard — Phase 1: Foundation & Data Model

## Summary

Strip all energy-specific domain code from ge-cogo and replace it with a household cost-of-living data model. This creates the clean foundation for all subsequent phases: new TypeScript types for spending categories and household profiles, NZ benchmark constants sourced from Stats NZ HES 2023, 4 realistic demo household profiles, a new system prompt builder for the AI advisor, updated demo responses in the API route, and cleaned-up format utilities. The result is a buildable project where `npm run build` passes, the dashboard renders placeholder data from demo profiles, and the AI chat works in demo mode with household-cost responses.

## User Story

As a Genesis stakeholder viewing the prototype
I want to see realistic NZ household spending data across all major cost categories
So that I can evaluate whether this tool convincingly demonstrates Genesis as a cost-of-living ally

## Problem Statement

The ge-cogo codebase contains a fully working energy-specific calculator (TCE). Every domain type, constant, demo profile, system prompt, and dashboard component is coupled to electricity/gas/transport vectors. Phase 1 must cleanly replace this domain layer with household spending categories while preserving all reusable infrastructure (brand tokens, AI streaming, UI primitives, layout).

## Solution Statement

Delete `lib/energy-model/` (8 files) and `lib/tce-context.ts`. Create `lib/household-model/` with equivalent structure: types, constants (NZ benchmarks), demo profiles, spending history generator, and barrel index. Create `lib/household-context.ts` as the new system prompt builder. Update `lib/format.ts` to remove energy-specific formatters. Update `app/api/chat/route.ts` demo responses for household cost topics. Create a minimal `components/dashboard/index.tsx` that renders demo profile data as placeholder. Update `components/layout/header.tsx` nav items for new sections.

## Metadata

| Field            | Value                                             |
| ---------------- | ------------------------------------------------- |
| Type             | NEW_CAPABILITY                                    |
| Complexity       | MEDIUM                                            |
| Systems Affected | lib/household-model, lib/household-context, lib/format, app/api/chat, components/dashboard, components/layout |
| Dependencies     | No new external deps — all within existing stack  |
| Estimated Tasks  | 12                                                |

---

## UX Design

### Before State

```
╔═══════════════════════════════════════════════════════════════════╗
║                     CURRENT: ENERGY TCE CALCULATOR               ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║   ┌──────────────┐        ┌──────────────┐        ┌────────────┐ ║
║   │ Energy Form  │──────► │ calculateTCE │──────► │ TCEResults │ ║
║   │ (region,     │        │ (consumption,│        │ (cost bars,│ ║
║   │  heating,    │        │  costs,      │        │  bill area,│ ║
║   │  vehicles)   │        │  roadmap,    │        │  roadmap)  │ ║
║   └──────────────┘        │  emissions)  │        └────────────┘ ║
║                           └──────────────┘              │        ║
║                                                         ▼        ║
║   DOMAIN: Electricity / Gas / Transport vectors only    │        ║
║   CHAT: "AI Energy Advisor" with energy system prompt   │        ║
║                                                   ┌─────────────┐║
║                                                   │ AI Chat     │║
║                                                   │ (energy     │║
║                                                   │  context)   │║
║                                                   └─────────────┘║
╚═══════════════════════════════════════════════════════════════════╝
```

### After State (Phase 1 — Foundation Only)

```
╔═══════════════════════════════════════════════════════════════════╗
║                AFTER: HOUSEHOLD COST FOUNDATION                   ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║   ┌──────────────┐        ┌──────────────┐        ┌────────────┐ ║
║   │ Demo Profile │──────► │ Household    │──────► │ Placeholder│ ║
║   │ Selector     │        │ Model        │        │ Dashboard  │ ║
║   │ (4 profiles) │        │ (types,      │        │ (category  │ ║
║   └──────────────┘        │  constants,  │        │  list,     │ ║
║                           │  profiles,   │        │  totals)   │ ║
║                           │  history)    │        └────────────┘ ║
║                           └──────────────┘              │        ║
║                                                         ▼        ║
║   DOMAIN: 8 spending categories (energy, groceries,     │        ║
║           rates, mortgage, insurance, transport,        │        ║
║           communications, healthcare)                   │        ║
║   CHAT: "Household Cost Advisor" with spending prompt   │        ║
║                                                   ┌─────────────┐║
║                                                   │ AI Chat     │║
║                                                   │ (household  │║
║                                                   │  context)   │║
║                                                   └─────────────┘║
╚═══════════════════════════════════════════════════════════════════╝
```

### Interaction Changes

| Location | Before | After | User Impact |
|----------|--------|-------|-------------|
| Dashboard | Energy form → TCE results | Demo profile selector → category spending list | Sees household costs, not energy vectors |
| AI Chat title | "AI Energy Advisor" | "Savings Advisor" | Reflects broader scope |
| Chat demo responses | Energy-specific (solar, EV, heating) | Household cost-specific (groceries, insurance, rates, mortgage) | Relevant advice for all spending |
| Nav items | Calculator, Savings, Bill Tracker | Dashboard, Spending, Insights | Matches new domain |
| CommandBar placeholder | "Ask about your energy costs..." | "Ask how to reduce your household costs..." | Correct framing |

---

## Mandatory Reading

**CRITICAL: Implementation agent MUST read these files before starting any task:**

| Priority | File | Lines | Why Read This |
|----------|------|-------|---------------|
| P0 | `lib/energy-model/types.ts` | 1-113 | Type pattern to MIRROR exactly for household types |
| P0 | `lib/energy-model/constants.ts` | 1-217 | Constants pattern to MIRROR for NZ benchmarks |
| P0 | `lib/energy-model/demo-profiles.ts` | 1-57 | Demo profile pattern to MIRROR |
| P0 | `lib/energy-model/index.ts` | 1-134 | Barrel export pattern to MIRROR |
| P0 | `lib/energy-model/bill-history.ts` | 1-85 | History generator pattern to MIRROR |
| P0 | `lib/tce-context.ts` | 1-94 | System prompt builder pattern to MIRROR |
| P1 | `components/dashboard/index.tsx` | all | Orchestrator — understand view state, prop chains, nav registration |
| P1 | `app/api/chat/route.ts` | 1-175 | Demo responses + SSE format — update demo text only |
| P1 | `lib/format.ts` | 1-56 | Formatters to keep vs remove |
| P1 | `components/layout/header.tsx` | 1-130 | Nav items to update |
| P2 | `components/ai/conversation-panel.tsx` | 1-170 | Chat panel — title string to update |
| P2 | `components/ai/command-bar.tsx` | 1-65 | Placeholder text to update |
| P2 | `components/chat/chat-input.tsx` | 1-55 | Placeholder text to update |
| P2 | `app/page.tsx` | 1-25 | Root page — nav registration pattern |

**External Documentation:**

| Source | Section | Why Needed |
|--------|---------|------------|
| [Stats NZ HES 2023](https://www.stats.govt.nz/information-releases/household-expenditure-statistics-year-ended-june-2023/) | Weekly expenditure by category | Source for benchmark constants |
| [Powerswitch](https://www.powerswitch.org.nz/finding-the-best-power-plan/what-is-the-average-monthly-power-bill) | Average power bill | Energy category benchmarks |
| [Sorted.org.nz — Insurance](https://sorted.org.nz/blog/five-things-to-do-when-your-premiums-surge/) | Quote comparison gaps | Insurance savings data for AI tips |
| [AI SDK v6 Migration](https://ai-sdk.dev/docs/migration-guides/migration-guide-6-0) | Breaking changes | Verify no deprecated APIs in use |

---

## Patterns to Mirror

**TYPE_DEFINITIONS:**

```typescript
// SOURCE: lib/energy-model/types.ts:1-10
// COPY THIS PATTERN — union string literals for enums, interfaces for data shapes:
export type Region =
  | 'northland'
  | 'auckland'
  | 'waikato'
  // ...

export type HeatingType = 'gas' | 'lpg' | 'wood' | 'electric-resistive' | 'heat-pump'
```

**CONSTANTS_WITH_SOURCE_CITATION:**

```typescript
// SOURCE: lib/energy-model/constants.ts:1-20
// COPY THIS PATTERN — JSDoc source block, section banners, Record<UnionType, number>:

/**
 * NZ Energy Cost Constants — 2026
 *
 * Sources:
 * - Rewiring Aotearoa household-model (GitHub, 2024 base data)
 * - Powerswitch NZ (2026 regional pricing)
 */

// ─── Electricity Rates (NZD per kWh, inclusive of GST + lines) ──────────────

export const ELECTRICITY_RATES: Record<Region, number> = {
  'northland': 0.44,
  'auckland': 0.38,
  // ...
}
```

**DEMO_PROFILE_STRUCTURE:**

```typescript
// SOURCE: lib/energy-model/demo-profiles.ts:3-15
// COPY THIS PATTERN — Record<string, { name, description, input }>:
export const DEMO_PROFILES: Record<string, { name: string; description: string; input: HouseholdInput }> = {
  'auckland-family': {
    name: 'Auckland Family',
    description: '4-person family in Grey Lynn with gas appliances and two petrol cars',
    input: { /* full HouseholdInput */ },
  },
}
```

**BARREL_INDEX:**

```typescript
// SOURCE: lib/energy-model/index.ts:1-30
// COPY THIS PATTERN — type re-exports, single public function, data re-export:
export type { HouseholdProfile, MonthlySpending, SpendingCategory /* ... */ } from './types'
export function getHouseholdSpending(profile: HouseholdProfile): MonthlySpending { ... }
export { DEMO_PROFILES } from './demo-profiles'
```

**SYSTEM_PROMPT_BUILDER:**

```typescript
// SOURCE: lib/tce-context.ts:7-80
// COPY THIS PATTERN — takes input + result, returns markdown template literal:
export function buildHouseholdSystemPrompt(profile: HouseholdProfile, spending: MonthlySpending): string {
  return `You are Genesis Energy's Household Savings Advisor...
## This Household's Profile
- Type: ${profile.type}
...`
}
```

**HISTORY_GENERATOR:**

```typescript
// SOURCE: lib/energy-model/bill-history.ts:12-50
// COPY THIS PATTERN — seasonal multipliers, deterministic jitter:
const SEASONAL_MULTIPLIERS: Record<number, number> = {
  0: 0.95,  // January (summer — lower heating)
  // ...
  6: 1.15,  // July (winter — higher heating)
}
```

**INTL_FORMATTER:**

```typescript
// SOURCE: lib/format.ts:20-25
// COPY THIS PATTERN — module-scope Intl.NumberFormat, function wrapper:
const currencyFormatter = new Intl.NumberFormat('en-NZ', {
  style: 'currency', currency: 'NZD', minimumFractionDigits: 0, maximumFractionDigits: 0,
})
export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount)
}
```

---

## Files to Change

| File | Action | Justification |
| ---- | ------ | ------------- |
| `lib/energy-model/types.ts` | DELETE | Replaced by household-model/types.ts |
| `lib/energy-model/constants.ts` | DELETE | Replaced by household-model/constants.ts |
| `lib/energy-model/consumption.ts` | DELETE | No equivalent needed |
| `lib/energy-model/costs.ts` | DELETE | No equivalent needed |
| `lib/energy-model/roadmap.ts` | DELETE | No equivalent needed (future phase) |
| `lib/energy-model/bill-history.ts` | DELETE | Replaced by household-model/spending-history.ts |
| `lib/energy-model/demo-profiles.ts` | DELETE | Replaced by household-model/demo-profiles.ts |
| `lib/energy-model/index.ts` | DELETE | Replaced by household-model/index.ts |
| `lib/tce-context.ts` | DELETE | Replaced by household-context.ts |
| `lib/household-model/types.ts` | CREATE | Household spending type definitions |
| `lib/household-model/constants.ts` | CREATE | NZ spending benchmarks from Stats NZ HES 2023 |
| `lib/household-model/demo-profiles.ts` | CREATE | 4 NZ household demo profiles |
| `lib/household-model/spending-history.ts` | CREATE | 12-month spending history generator with seasonal variation |
| `lib/household-model/index.ts` | CREATE | Barrel exports |
| `lib/household-context.ts` | CREATE | System prompt builder for household spending AI advisor |
| `lib/format.ts` | UPDATE | Remove `formatKwh` and `formatTonnes`; keep all currency/percent/number formatters |
| `app/api/chat/route.ts` | UPDATE | Replace energy demo responses with household cost responses |
| `components/dashboard/index.tsx` | UPDATE | Replace energy orchestration with household spending placeholder |
| `components/dashboard/energy-form.tsx` | DELETE | Replaced in Phase 2 |
| `components/dashboard/tce-results.tsx` | DELETE | Replaced in Phase 2 |
| `components/dashboard/savings-roadmap.tsx` | DELETE | Replaced in Phase 5 |
| `components/dashboard/cost-chart.tsx` | DELETE | Replaced in Phase 2 |
| `components/dashboard/bill-tracker.tsx` | DELETE | Replaced in Phase 2 |
| `components/layout/header.tsx` | UPDATE | New nav items for household dashboard sections |
| `components/ai/conversation-panel.tsx` | UPDATE | Change SheetTitle from "AI Energy Advisor" to "Savings Advisor" |
| `components/ai/command-bar.tsx` | UPDATE | Change placeholder text |
| `components/chat/chat-input.tsx` | UPDATE | Change placeholder text |
| `app/layout.tsx` | UPDATE | Update metadata title/description |

---

## NOT Building (Scope Limits)

- **Dashboard visualisations** (pie charts, trend charts, category cards) — Phase 2
- **AI prompt tuning and savings knowledge base** — Phase 3 (we create the builder in Phase 1, but deep prompt crafting is Phase 3)
- **Receipt scanning** — Phase 4
- **Multiple selectable demo profiles in UI** — Phase 5 (we define the profiles in Phase 1, but the selection UI is Phase 5)
- **Form inputs for self-reported expenses** — Phase 2
- **Any new shadcn/ui components** (Input, Tabs, Badge, Progress) — Phase 2

---

## Step-by-Step Tasks

### Task 1: DELETE all energy-model files

- **ACTION**: Delete the entire `lib/energy-model/` directory (8 files) and `lib/tce-context.ts`
- **IMPLEMENT**: `rm -rf lib/energy-model/ && rm lib/tce-context.ts`
- **GOTCHA**: Do NOT delete `lib/format.ts`, `lib/utils.ts` — those are shared
- **VALIDATE**: Files gone; project will not build yet (expected — dependent files still reference deleted imports)

### Task 2: DELETE all energy-specific dashboard components

- **ACTION**: Delete the 5 energy-specific components that import from energy-model
- **IMPLEMENT**: Delete `components/dashboard/energy-form.tsx`, `components/dashboard/tce-results.tsx`, `components/dashboard/savings-roadmap.tsx`, `components/dashboard/cost-chart.tsx`, `components/dashboard/bill-tracker.tsx`
- **GOTCHA**: Do NOT delete `components/dashboard/index.tsx` — it will be rewritten in Task 8
- **VALIDATE**: Files gone

### Task 3: CREATE `lib/household-model/types.ts`

- **ACTION**: Create household spending type definitions
- **MIRROR**: `lib/energy-model/types.ts` — same pattern: union string literals for enums, interfaces for data shapes
- **IMPLEMENT**:

```typescript
// Spending categories — the 8 pillars of household cost
export type SpendingCategory =
  | 'energy'
  | 'groceries'
  | 'mortgage'       // or rent
  | 'rates'
  | 'insurance'
  | 'transport'
  | 'communications'
  | 'healthcare'

// NZ regions (reuse from energy model — same 16 regions)
export type Region =
  | 'northland' | 'auckland' | 'waikato' | 'bay-of-plenty'
  | 'gisborne' | 'hawkes-bay' | 'taranaki' | 'manawatu-whanganui'
  | 'wellington' | 'tasman-nelson' | 'marlborough' | 'west-coast'
  | 'canterbury' | 'otago' | 'southland'

// Household archetypes for demo profiles
export type HouseholdType = 'single-renter' | 'couple-mortgage' | 'family-mortgage' | 'retired-homeowner'

// Housing situation affects which cost categories apply
export type HousingSituation = 'renting' | 'mortgage' | 'owned-outright'

// The input shape — what defines a household
export interface HouseholdProfile {
  name: string
  description: string
  region: Region
  occupants: number
  householdType: HouseholdType
  housingSituation: HousingSituation
  annualIncome: number     // Gross household income NZD
}

// Spending for a single category in a single month
export interface CategorySpending {
  category: SpendingCategory
  label: string            // Human-readable: "Groceries", "Council Rates"
  monthlyAmount: number    // NZD
  annualAmount: number     // NZD
  percentOfTotal: number   // 0-100
  trend: 'up' | 'down' | 'stable'    // vs last year
  trendPercent: number     // YoY change
}

// The full spending picture for a household
export interface HouseholdSpending {
  profile: HouseholdProfile
  categories: CategorySpending[]
  totalMonthly: number
  totalAnnual: number
}

// A single month in the spending history
export interface MonthlySpendingRecord {
  month: string            // "2025-07"
  monthShort: string       // "Jul"
  categories: Record<SpendingCategory, number>  // Monthly NZD per category
  total: number
}

// NZ benchmark for comparison
export interface CategoryBenchmark {
  category: SpendingCategory
  label: string
  weeklyAverage: number    // NZ national average (Stats NZ HES 2023)
  monthlyAverage: number
  annualAverage: number
  source: string           // Citation
}
```

- **GOTCHA**: Use `export type` for all type-only exports (isolatedModules: true in tsconfig)
- **VALIDATE**: `npx tsc --noEmit` — types file should compile standalone

### Task 4: CREATE `lib/household-model/constants.ts`

- **ACTION**: Create NZ household spending benchmark constants
- **MIRROR**: `lib/energy-model/constants.ts` — JSDoc source block, section banners, typed Record maps
- **IMPLEMENT**: All figures from Stats NZ HES 2023 + supplementary sources

```typescript
import type { SpendingCategory, CategoryBenchmark, Region } from './types'

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

// ─── National Averages (NZD per week, Stats NZ HES 2023) ─────────────────

export const NZ_AVERAGE_WEEKLY_TOTAL = 1597.50

export const NZ_AVERAGE_WEEKLY: Record<SpendingCategory, number> = {
  'energy': 45,           // Electricity + gas (Powerswitch 2025)
  'groceries': 299.50,    // Food group (Stats NZ HES 2023)
  'mortgage': 658.20,     // Mortgage holders only (Stats NZ Jun 2024)
  'rates': 85,            // National approx from council data
  'insurance': 80,        // Dwelling + contents + vehicle (estimated)
  'transport': 251.60,    // Transport group (Stats NZ HES 2023)
  'communications': 39.20, // Communications group (Stats NZ HES 2023)
  'healthcare': 49.70,    // Health group (Stats NZ HES 2023)
}

// ─── Category Labels ──────────────────────────────────────────────────────

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

// ─── Category Benchmarks (for "vs NZ average" comparisons) ────────────────

export const CATEGORY_BENCHMARKS: CategoryBenchmark[] = [
  // ... one entry per category with weeklyAverage, monthlyAverage, annualAverage, source
]

// ─── Regional Council Rates (NZD per year, 2025/26) ──────────────────────

export const COUNCIL_RATES: Partial<Record<Region, number>> = {
  'auckland': 4069,
  'wellington': 5512,
  'canterbury': 4212,
  // ... more regions as data available
}

// ─── Average Electricity by Region (NZD per month, 2025) ──────────────────

export const ELECTRICITY_MONTHLY: Partial<Record<Region, number>> = {
  'auckland': 165,
  'wellington': 190,
  'canterbury': 210,
  // ...
}

// ─── Savings Potential by Category (NZD per year, evidence-backed) ────────

export const SAVINGS_POTENTIAL: Record<SpendingCategory, { low: number; high: number; description: string }> = {
  'energy': { low: 400, high: 500, description: 'Switch retailer via Powerswitch' },
  'groceries': { low: 500, high: 825, description: 'Shop at Pak\'nSave, buy home-brand' },
  'insurance': { low: 1000, high: 3000, description: 'Compare quotes annually across all lines' },
  'mortgage': { low: 2000, high: 10000, description: 'Refinance at lower rate, fortnightly payments' },
  'rates': { low: 0, high: 500, description: 'Rates rebate scheme if eligible' },
  'transport': { low: 500, high: 2000, description: 'Fuel cards, WFH days, carpooling' },
  'communications': { low: 200, high: 500, description: 'Compare broadband + mobile plans' },
  'healthcare': { low: 100, high: 500, description: 'Review health insurance, use community services' },
}
```

- **GOTCHA**: Use `Partial<Record<Region, number>>` for regional data where not all 15 regions have data
- **VALIDATE**: `npx tsc --noEmit`

### Task 5: CREATE `lib/household-model/demo-profiles.ts`

- **ACTION**: Create 4 realistic NZ household demo profiles with full spending data
- **MIRROR**: `lib/energy-model/demo-profiles.ts` — `Record<string, { name, description, ... }>` keyed by kebab-case slug
- **IMPLEMENT**: Based on Stats NZ HES 2023 data and research profiles:

Profile A — `'auckland-single'`: Single professional, renting in Auckland. ~$4,100/month total.
Profile B — `'wellington-couple'`: Couple with mortgage in Wellington. ~$6,500/month total.
Profile C — `'christchurch-family'`: Family of 4, mortgage in Christchurch. ~$7,800/month total.
Profile D — `'tauranga-retired'`: Retired couple, own home outright in Tauranga. ~$3,250/month total.

Each profile includes: `HouseholdProfile` metadata + pre-computed `CategorySpending[]` for all 8 categories with realistic monthly amounts, annual amounts, percentOfTotal, trend direction, and YoY trend percentage.

- **GOTCHA**: Ensure all `percentOfTotal` values sum to 100 within each profile. Mortgage field should say "Rent" for renters.
- **VALIDATE**: `npx tsc --noEmit`

### Task 6: CREATE `lib/household-model/spending-history.ts`

- **ACTION**: Create 12-month spending history generator with seasonal variation
- **MIRROR**: `lib/energy-model/bill-history.ts` — seasonal multipliers, deterministic jitter
- **IMPLEMENT**:

```typescript
import type { SpendingCategory, HouseholdSpending, MonthlySpendingRecord } from './types'

// Southern hemisphere: energy peaks in winter (Jun-Aug), groceries peak Dec
const SEASONAL_MULTIPLIERS: Record<SpendingCategory, Record<number, number>> = {
  'energy': { 0: 0.80, 1: 0.80, 2: 0.85, 3: 0.95, 4: 1.10, 5: 1.20, 6: 1.25, 7: 1.20, 8: 1.10, 9: 0.95, 10: 0.85, 11: 0.80 },
  'groceries': { /* Dec spike for holidays */ },
  // ... other categories (most are flat, rates quarterly, insurance annual)
}

export function generateSpendingHistory(spending: HouseholdSpending): MonthlySpendingRecord[] {
  // Generate 12 months ending at current month
  // Apply per-category seasonal multipliers
  // Add ±3% deterministic jitter (seeded by month index)
  // Return MonthlySpendingRecord[]
}
```

Export the `MonthlySpendingRecord` type from this file (mirroring how `bill-history.ts` exported `MonthlyBill`).

- **VALIDATE**: `npx tsc --noEmit`

### Task 7: CREATE `lib/household-model/index.ts`

- **ACTION**: Create barrel index re-exporting all types and public functions
- **MIRROR**: `lib/energy-model/index.ts` — `export type {}` for types, named exports for functions/data
- **IMPLEMENT**:

```typescript
export type {
  SpendingCategory,
  Region,
  HouseholdType,
  HousingSituation,
  HouseholdProfile,
  CategorySpending,
  HouseholdSpending,
  MonthlySpendingRecord,
  CategoryBenchmark,
} from './types'

export { DEMO_PROFILES } from './demo-profiles'
export { NZ_AVERAGE_WEEKLY, CATEGORY_LABELS, CATEGORY_BENCHMARKS, SAVINGS_POTENTIAL, COUNCIL_RATES } from './constants'
export { generateSpendingHistory } from './spending-history'
```

- **VALIDATE**: `npx tsc --noEmit`

### Task 8: CREATE `lib/household-context.ts`

- **ACTION**: Create system prompt builder for household cost AI advisor
- **MIRROR**: `lib/tce-context.ts` — takes data objects, returns markdown template literal with `## Heading` sections
- **IMPLEMENT**:

Two exported functions:
1. `buildHouseholdSystemPrompt(spending: HouseholdSpending): string` — includes:
   - Persona: Genesis Household Savings Advisor, warm, non-judgemental, NZ-specific
   - Household profile details (type, region, occupants, income)
   - Full spending breakdown by category with monthly and annual amounts
   - Comparison to NZ averages where available
   - Known savings potential per category (from constants)
   - NZ cost-of-living context (April 2026)
   - Instructions: be specific, give dollar estimates, suggest lifestyle-preserving changes, cite NZ sources

2. `buildDefaultSystemPrompt(): string` — generic prompt when no profile is loaded

- **GOTCHA**: Import `formatCurrency`, `formatPercent` from `@/lib/format` (NOT the deleted energy formatters)
- **VALIDATE**: `npx tsc --noEmit`

### Task 9: UPDATE `lib/format.ts`

- **ACTION**: Remove `formatKwh` (line 38) and `formatTonnes` (line 48) — energy-specific
- **KEEP**: `formatCurrency`, `formatCurrencyDecimal`, `formatCurrencyShort`, `formatPercent`, `formatNumber`
- **VALIDATE**: `npx tsc --noEmit`

### Task 10: UPDATE `app/api/chat/route.ts`

- **ACTION**: Replace energy-specific demo responses with household cost responses
- **WHAT TO CHANGE**:
  - Lines 4–54: Replace all `demoResponses` entries. New keyword-matched topics: `groceries`, `insurance`, `rates`, `mortgage`, `transport`, `energy`/`power`, `savings`, `budget`. Each response should be 2-3 sentences of genuinely useful NZ-specific advice.
  - Lines 66–74: Update `getDemoResponse()` keyword matching for new topics
  - Line 136: Update fallback system prompt from `'You are a helpful NZ energy advisor.'` to `'You are Genesis Energy\'s Household Savings Advisor for New Zealand families.'`
- **DO NOT CHANGE**: SSE streaming format, `createSSEResponse()`, `streamWords()`, live Claude path, message extraction — all domain-agnostic
- **VALIDATE**: `npx tsc --noEmit && npm run build`

### Task 11: UPDATE `components/dashboard/index.tsx`

- **ACTION**: Rewrite dashboard orchestrator for household spending
- **WHAT TO CHANGE**:
  - Remove all imports from `@/lib/energy-model` and `@/lib/tce-context`
  - Import from `@/lib/household-model` and `@/lib/household-context`
  - Replace `view` state machine (`'form' | 'results'`) with single dashboard view that loads a default demo profile
  - State: `const [spending, setSpending] = useState<HouseholdSpending>(DEMO_PROFILES['christchurch-family'])` — start with a pre-loaded profile
  - Compute system prompt: `const systemPrompt = spending ? buildHouseholdSystemPrompt(spending) : buildDefaultSystemPrompt()`
  - Render placeholder content: a simple list of category spending from the loaded profile (Card with category name + monthly amount for each). This is temporary — Phase 2 replaces with full dashboard.
  - Keep: `chatOpen`/`chatContext` state, `handleCommandSubmit`, `ConversationPanel` integration, `CommandBar` integration, nav registration pattern
  - Update `id` attributes for scroll targets: `id="dashboard"`, `id="spending"`, `id="insights"`
- **VALIDATE**: `npx tsc --noEmit && npm run build`

### Task 12: UPDATE UI text strings

- **ACTION**: Update text across 4 files to reflect household cost domain
- **FILES AND CHANGES**:

  **`components/layout/header.tsx`** (lines 7–11):
  ```typescript
  const navItems = [
    { label: 'Dashboard', target: 'dashboard' },
    { label: 'Spending', target: 'spending' },
    { label: 'Insights', target: 'insights' },
  ]
  ```

  **`components/ai/conversation-panel.tsx`** (line 141):
  - Change `SheetTitle` from `"AI Energy Advisor"` to `"Savings Advisor"`

  **`components/ai/command-bar.tsx`** (line 39 + line 56):
  - Placeholder: `"Ask how to reduce your household costs..."`
  - Footer: `"Get personalised savings tips from our AI advisor"`

  **`components/chat/chat-input.tsx`** (line 46):
  - Placeholder: `"Ask about your household costs..."`

  **`app/layout.tsx`** (lines 18–31):
  - `title`: `"Genesis | Household Cost Dashboard"`
  - `description`: `"See where your money goes and get AI-powered tips to reduce household costs"`

- **VALIDATE**: `npm run build` — full build must pass

---

## Testing Strategy

### Build Validation

No test framework is installed (`package.json` has no jest/vitest). Validation is via TypeScript compilation and Next.js build.

| Check | Command | What It Validates |
|-------|---------|-------------------|
| Type check | `npx tsc --noEmit` | All types resolve, no import errors |
| Full build | `npm run build` | Pages compile, no runtime import failures |
| Dev server | `npm run dev` | Page renders, no hydration errors |

### Manual Validation

After all tasks complete:

1. Run `npm run dev` — page loads without errors
2. Dashboard shows placeholder category spending list from default demo profile
3. Click AI chat (CommandBar) → ConversationPanel opens with title "Savings Advisor"
4. Type a message → demo mode responds with household cost advice (not energy advice)
5. Nav items show "Dashboard", "Spending", "Insights" (not energy terms)
6. No console errors referencing `energy-model`, `tce-context`, or deleted files
7. `npm run build` completes successfully

### Edge Cases Checklist

- [ ] All energy-model imports removed (grep for `energy-model` and `tce-context` returns nothing)
- [ ] No orphaned imports referencing deleted components (energy-form, tce-results, etc.)
- [ ] Demo profiles have consistent data (percentOfTotal sums to 100)
- [ ] Format utilities work without energy formatters (formatKwh, formatTonnes references gone)
- [ ] System prompt includes actual spending data, not placeholder text

---

## Validation Commands

### Level 1: STATIC_ANALYSIS

```bash
npx tsc --noEmit
```

**EXPECT**: Exit 0, no type errors

### Level 2: IMPORT_VERIFICATION

```bash
grep -r "energy-model" --include="*.ts" --include="*.tsx" lib/ components/ app/ && echo "FAIL: energy-model references remain" || echo "PASS: no energy-model references"
grep -r "tce-context" --include="*.ts" --include="*.tsx" lib/ components/ app/ && echo "FAIL: tce-context references remain" || echo "PASS: no tce-context references"
grep -r "formatKwh\|formatTonnes" --include="*.ts" --include="*.tsx" lib/ components/ app/ && echo "FAIL: energy formatters remain" || echo "PASS: no energy formatters"
```

**EXPECT**: All three show PASS

### Level 3: FULL_BUILD

```bash
npm run build
```

**EXPECT**: Build succeeds with exit 0

### Level 5: BROWSER_VALIDATION

- Load `http://localhost:3000`
- Page renders with Genesis branding
- Placeholder dashboard shows spending categories
- AI chat opens and responds in demo mode
- No console errors

---

## Acceptance Criteria

- [ ] All 8 energy-model files deleted
- [ ] `lib/tce-context.ts` deleted
- [ ] 5 energy dashboard components deleted
- [ ] `lib/household-model/` created with types, constants, demo-profiles, spending-history, index (5 files)
- [ ] `lib/household-context.ts` created with system prompt builder
- [ ] `lib/format.ts` cleaned (no energy formatters)
- [ ] API route demo responses updated for household costs
- [ ] Dashboard renders placeholder from demo profile data
- [ ] All UI text updated (no energy/TCE references)
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` passes
- [ ] `grep -r "energy-model"` returns nothing in source files
- [ ] Dev server loads without errors

---

## Completion Checklist

- [ ] All 12 tasks completed in dependency order
- [ ] Each task validated immediately after completion
- [ ] Level 1: TypeScript type-check passes
- [ ] Level 2: No orphaned energy-model imports
- [ ] Level 3: Full Next.js build succeeds
- [ ] Level 5: Browser renders correctly
- [ ] All acceptance criteria met

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
| ---- | ---------- | ------ | ---------- |
| Orphaned imports cause build failure | Medium | Low | Run grep checks after Tasks 1-2 before proceeding; `ignoreBuildErrors: true` in next.config provides safety net but don't rely on it |
| Demo profile data feels unrealistic | Medium | Medium | All figures sourced from Stats NZ HES 2023 and supplementary government data; cross-reference with Sorted.org.nz benchmarks |
| Dashboard placeholder too minimal for Phase 1 review | Low | Low | Phase 1 goal is foundation, not visual polish. Placeholder just needs to prove data flows correctly. |
| System prompt too generic without Phase 3 tuning | Low | Low | Phase 1 prompt builder creates the structure; Phase 3 adds NZ-specific savings knowledge depth |

---

## Notes

- **No new dependencies needed** — all work uses existing TypeScript, React, and Next.js patterns
- **Demo profiles are the single source of truth** for Phase 2 dashboard rendering — invest time making the data realistic
- **The spending-history generator** should produce data that tells a visual story (winter energy spikes, December grocery peaks) so Phase 2 charts look compelling
- **The system prompt builder** is the bridge between data and AI quality — even in Phase 1, structure it well so Phase 3 can extend it rather than rewrite
- **`ignoreBuildErrors: true`** in next.config.mjs means TypeScript errors won't fail the build, but we should still target zero TS errors for code quality
