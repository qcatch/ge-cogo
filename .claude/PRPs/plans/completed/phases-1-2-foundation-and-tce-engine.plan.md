# Feature: Foundation & Navigation + TCE Calculation Engine (Phases 1 & 2)

## Summary

Combined plan covering the two foundational phases of the Genesis Cost of Living Assistant POC. Phase 1 restructures the single-page household dashboard into a multi-section experience with a landing page, TCE calculator, results view, and cost-of-living playbook — all within a single scrollable page using anchor-based navigation (matching the existing pattern). Phase 2 rebuilds the TCE calculation engine as `lib/energy-model/` from the complete surviving specification, producing a `calculateTCE()` function that takes household energy inputs and returns current vs electrified cost comparisons with a switching roadmap. Together these phases establish the app shell and data engine that all subsequent phases depend on.

## User Story

As a New Zealand homeowner currently paying for electricity, petrol, and gas separately,
I want to see my total cost of energy in one confronting number and compare it against a fully electrified alternative,
So that I understand exactly how much I could save by switching and can take the first step toward reducing my household running costs.

## Problem Statement

The current codebase is a household cost-of-living dashboard showing 8 spending categories with demo profiles. It has no energy-specific calculation engine (the previous `lib/energy-model/` was deleted), no multi-section navigation beyond the existing dashboard, and no way to input household energy details or see a current-vs-electrified comparison. These two foundational pieces must exist before any UI, offers, or AI chat can be built on top.

## Solution Statement

1. **Foundation**: Transform the single-page app into a multi-section experience using the existing scroll-based navigation pattern. Add sections for: landing hook, TCE calculator input, TCE results, and placeholders for Power Circle offers and cost-of-living playbook. Update the header nav items. Update metadata.

2. **TCE Engine**: Create `lib/energy-model/` with 7 files (types, constants, consumption, costs, roadmap, demo-profiles, index) implementing the complete Rewiring Aotearoa-based calculation methodology. All constants are documented in the surviving spec. The public API is `calculateTCE(input: HouseholdInput): TCEResult`.

## Metadata

| Field            | Value                                              |
| ---------------- | -------------------------------------------------- |
| Type             | NEW_CAPABILITY                                     |
| Complexity       | HIGH                                               |
| Systems Affected | app shell, navigation, lib/energy-model (new), layout metadata |
| Dependencies     | zod@3.25.76, react-hook-form@^7.60.0 (installed, unused), recharts@2.15.4 |
| Estimated Tasks  | 12                                                 |

---

## UX Design

### Before State

```
+------------------------------------------------------------------+
| HEADER: Genesis Energy | Cost of Living Advisor [Prototype]       |
| Nav: Dashboard | Spending | Insights                              |
+------------------------------------------------------------------+
|                                                                    |
| #dashboard  ── Hero Stats (3 cards: monthly/annual/% of income)   |
|                Profile Switcher (4 demo profiles)                  |
|                                                                    |
| #spending   ── Tabs: Overview (donut) | Trends (area chart)       |
|                                                                    |
| #insights   ── Category Cards grid (8 categories)                 |
|                Receipt Scanner                                     |
|                Conversation Starters                                |
|                Command Bar                                         |
|                                                                    |
| [AI Chat Sheet slides in from right when triggered]                |
+------------------------------------------------------------------+

USER_FLOW: User lands → sees generic spending dashboard → explores
           categories → maybe asks AI a question
PAIN_POINT: No energy-specific calculation. No electrification comparison.
            Energy is one generic $195/mo line item among 8.
DATA_FLOW:  DEMO_PROFILES[key] → useMemo → HouseholdSpending →
            child components (donut, trend, cards, AI context)
```

### After State

```
+------------------------------------------------------------------+
| HEADER: Genesis Energy | Cost of Living Assistant [Prototype]     |
| Nav: Home | Calculator | Results | Savings | Dashboard             |
+------------------------------------------------------------------+
|                                                                    |
| #home       ── Landing hook: "Do you know what energy is          |
|                actually costing you — across everything?"           |
|                CTA: "Find out now" → scrolls to #calculator        |
|                                                                    |
| #calculator ── TCE Input Form                                      |
|                Region (select) | Household size (select)           |
|                Monthly power bill (slider)                          |
|                Monthly petrol spend (slider)                        |
|                Heating type (radio) | Hot water type (radio)        |
|                Cooktop type (radio) | Vehicle type (radio)          |
|                [Calculate] button                                   |
|                                                                    |
| #results    ── THE NUMBER: "$12,480 per year on energy"            |
|                vs "$6,240 electrified" = "$6,240 savings"          |
|                Breakdown bar chart (current vs electrified)         |
|                Switching roadmap cards (ranked by payback)          |
|                [Placeholder: Power Circle offers go here]           |
|                                                                    |
| #savings    ── [Placeholder: Cost of Living Playbook]              |
|                                                                    |
| #dashboard  ── Existing household cost dashboard                   |
|                (retained, scrolled past the energy sections)        |
|                                                                    |
| [AI Chat Sheet — same pattern, new TCE context when available]     |
+------------------------------------------------------------------+

USER_FLOW: User lands → sees confronting question → enters energy details →
           sees THE NUMBER → sees electrified comparison → sees roadmap →
           [future: Power Circle offers → cost of living ideas → AI chat]
VALUE_ADD: First time seeing total energy cost as one number.
           Instant comparison with electrified alternative.
DATA_FLOW: Form inputs → HouseholdInput → calculateTCE() → TCEResult →
           results view (charts, roadmap, savings) + AI system prompt
```

### Interaction Changes

| Location | Before | After | User Impact |
|----------|--------|-------|-------------|
| Header nav | Dashboard / Spending / Insights | Home / Calculator / Results / Savings / Dashboard | Clear journey through energy → savings → dashboard |
| Landing section | None | Confronting question + CTA | Emotional hook before any data entry |
| Calculator section | None | Multi-input form with sliders | User enters their real energy profile |
| Results section | None | Headline number + comparison + roadmap | The "wow" moment — sees total energy cost and savings |
| Layout metadata | "Household Cost Dashboard" | "Cost of Living Assistant" | Reflects product rename |

---

## Mandatory Reading

**CRITICAL: Implementation agent MUST read these files before starting any task:**

| Priority | File | Lines | Why Read This |
|----------|------|-------|---------------|
| P0 | `lib/household-model/types.ts` | all | Type patterns to MIRROR — string literal unions, interface structure |
| P0 | `lib/household-model/constants.ts` | all | Constants pattern to MIRROR — JSDoc sources, Record types, Partial<Record> for regional data |
| P0 | `lib/household-model/demo-profiles.ts` | all | Demo profile pattern to MIRROR — `buildSpending()` helper, percent rounding fix |
| P0 | `lib/household-model/index.ts` | all | Barrel export pattern to MIRROR |
| P0 | `.claude/PRPs/plans/completed/phase-2-energy-cost-model.plan.md` | 280-408 | Complete TCE spec — all constant values, formulas, type definitions, function signatures |
| P1 | `components/layout/header.tsx` | all | Header to UPDATE — nav items, title text |
| P1 | `app/page.tsx` | all | Root page to UPDATE — add new sections |
| P1 | `app/layout.tsx` | all | Layout to UPDATE — metadata |
| P1 | `components/dashboard/index.tsx` | 28-115 | Dashboard state pattern — how derived state flows to children |
| P2 | `lib/format.ts` | all | Format utilities to REUSE — formatCurrency, formatPercent |
| P2 | `app/globals.css` | 1-65 | Design tokens to USE — primary (orange), secondary (violet), accent (yellow) |

**External Documentation:**

| Source | Section | Why Needed |
|--------|---------|------------|
| [RHF Advanced — Wizard Form](https://react-hook-form.com/advanced-usage) | Multi-step forms | Pattern for `FormProvider` + `trigger(fieldNames[])` per-step validation |
| [Recharts BarChart](https://recharts.org/en-US/api/BarChart) | Grouped bars | Two `<Bar>` children without `stackId` for current vs electrified |
| [Zod v3.25 API](https://zod.dev) | Schema definition | `z.object()`, `z.enum()`, `z.number()` for form validation |

---

## Patterns to Mirror

**TYPE_DEFINITIONS:**
```typescript
// SOURCE: lib/household-model/types.ts:1-10
// COPY THIS PATTERN: string literal unions, not enums
export type SpendingCategory =
  | 'energy'
  | 'groceries'
  | 'mortgage'
  // ...

// SOURCE: lib/household-model/types.ts:38-46
// COPY THIS PATTERN: interfaces with JSDoc
/** What defines a household */
export interface HouseholdProfile {
  name: string
  description: string
  region: Region
  occupants: number
  // ...
}
```

**CONSTANTS_WITH_SOURCES:**
```typescript
// SOURCE: lib/household-model/constants.ts:1-14
// COPY THIS PATTERN: JSDoc header citing ALL data sources and dates
/**
 * NZ Energy Cost Constants — April 2026
 *
 * Sources:
 * - Rewiring Aotearoa household energy model (2024)
 * - Powerswitch NZ regional electricity rates (2025)
 * - MBIE weekly fuel price monitoring (March 2026)
 * - Waka Kotahi EV road user charges (2025)
 */

// SOURCE: lib/household-model/constants.ts:25-34
// COPY THIS PATTERN: Record type keyed by domain type
export const NZ_AVERAGE_WEEKLY: Record<SpendingCategory, number> = {
  'energy': 45,
  // ...
}

// SOURCE: lib/household-model/constants.ts:77-85
// COPY THIS PATTERN: Partial<Record> for incomplete regional data
export const COUNCIL_RATES: Partial<Record<Region, number>> = {
  'auckland': 4069,
  // ...
}
```

**DEMO_PROFILES:**
```typescript
// SOURCE: lib/household-model/demo-profiles.ts:9-24
// COPY THIS PATTERN: builder helper function with percent rounding fix
function buildSpending(profile: HouseholdProfile, categories: CategorySpending[]): HouseholdSpending {
  const totalMonthly = categories.reduce((sum, c) => sum + c.monthlyAmount, 0)
  // ... percent rounding fix to ensure sum = 100
}

export const DEMO_PROFILES: Record<string, HouseholdSpending> = {
  'auckland-single': buildSpending(/* ... */),
}
```

**BARREL_EXPORT:**
```typescript
// SOURCE: lib/household-model/index.ts:1-27
// COPY THIS PATTERN: named re-exports, types separate from values
export type { Region, HeatingType, /* ... */ } from './types'
export { calculateTCE } from './calculator'
export { ELECTRICITY_RATES, /* ... */ } from './constants'
export { TCE_DEMO_PROFILES } from './demo-profiles'
```

**COMPONENT_PATTERN:**
```typescript
// SOURCE: components/layout/header.tsx:1-16
// COPY THIS PATTERN: 'use client', named export, inline interface
'use client'

import { useState } from 'react'

interface HeaderProps {
  onNavigate?: (target: string) => void
}

export function Header({ onNavigate }: HeaderProps) {
  // ...
}
```

**SCROLL_NAVIGATION:**
```typescript
// SOURCE: components/dashboard/index.tsx:91-100
// COPY THIS PATTERN: scroll-based section navigation
function handleNavigate(target: string) {
  if (target === 'dashboard') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    const el = document.getElementById(target)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
```

---

## Files to Change

| File | Action | Justification |
|------|--------|---------------|
| `lib/energy-model/types.ts` | CREATE | All TCE type definitions |
| `lib/energy-model/constants.ts` | CREATE | NZ energy pricing data — Rewiring Aotearoa methodology |
| `lib/energy-model/consumption.ts` | CREATE | Energy consumption calculations per category |
| `lib/energy-model/costs.ts` | CREATE | Current vs electrified cost calculations |
| `lib/energy-model/roadmap.ts` | CREATE | Switching roadmap generator |
| `lib/energy-model/demo-profiles.ts` | CREATE | 3 pre-built NZ household energy profiles |
| `lib/energy-model/index.ts` | CREATE | Public API: `calculateTCE()` + barrel exports |
| `app/layout.tsx` | UPDATE | Metadata: title → "Genesis \| Cost of Living Assistant" |
| `app/page.tsx` | UPDATE | Add landing, calculator, results sections + new nav registration |
| `components/layout/header.tsx` | UPDATE | Nav items → Home / Calculator / Results / Savings / Dashboard. Title text → "Cost of Living Assistant" |

---

## NOT Building (Scope Limits)

- **No TCE Calculator UI form** — that is Phase 3. This plan builds the engine and page structure only. Results section will show demo profile data, not user-entered data.
- **No Power Circle offers** — placeholder section only. Phase 5.
- **No AI chat modifications** — existing chat works as-is. TCE-specific system prompt is Phase 6.
- **No cost-of-living playbook content** — placeholder section only. Phase 7.
- **No animated number reveals** — Phase 10 polish. Static numbers for now.
- **No shareable output** — Phase 10.
- **No API routes** — all TCE calculation is client-side.
- **No new npm packages** — everything needed is already installed.

---

## Step-by-Step Tasks

Execute in order. Each task is atomic and independently verifiable.

---

### Task 1: CREATE `lib/energy-model/types.ts`

- **ACTION**: Define all TypeScript types for the TCE calculation engine
- **IMPLEMENT**:
  ```typescript
  /** NZ regions for regional energy pricing */
  export type EnergyRegion = 'northland' | 'auckland' | 'waikato' | 'bay-of-plenty' | 'wellington' | 'canterbury' | 'otago' | 'southland'

  export type HeatingType = 'gas' | 'lpg' | 'wood' | 'electric-resistive' | 'heat-pump'
  export type WaterHeatingType = 'gas' | 'lpg' | 'electric-resistive' | 'heat-pump' | 'solar'
  export type CooktopType = 'gas' | 'lpg' | 'electric-resistive' | 'induction'
  export type VehicleType = 'petrol' | 'diesel' | 'electric' | 'phev' | 'hybrid' | 'none'
  export type VehicleUsage = 'low' | 'medium' | 'high'

  export interface VehicleInput {
    type: VehicleType
    usage: VehicleUsage
  }

  export interface HouseholdInput {
    region: EnergyRegion
    occupants: number
    heating: HeatingType
    waterHeating: WaterHeatingType
    cooktop: CooktopType
    vehicles: VehicleInput[]
    /** Override: user's actual monthly electricity bill in NZD (optional) */
    monthlyElectricityBill?: number
    /** Override: user's actual monthly petrol spend in NZD (optional) */
    monthlyPetrolSpend?: number
    /** Override: user's actual monthly gas spend in NZD (optional) */
    monthlyGasSpend?: number
    /** Whether to include solar in the electrified scenario */
    includeSolar?: boolean
  }

  export interface ConsumptionBreakdown {
    heatingKwhPerYear: number
    waterHeatingKwhPerYear: number
    cooktopKwhPerYear: number
    baseAppliancesKwhPerYear: number
    vehiclesKwhPerYear: number
    totalKwhPerYear: number
  }

  export interface EnergyBreakdown {
    electricity: number
    gas: number
    petrol: number
    vehicleRunningCosts: number
    total: number
  }

  export interface SwitchRecommendation {
    appliance: string
    description: string
    currentAnnualCost: number
    electrifiedAnnualCost: number
    annualSaving: number
    upfrontCost: number
    paybackYears: number
    priority: number
  }

  export interface EmissionsResult {
    currentKgCO2e: number
    electrifiedKgCO2e: number
    reductionKgCO2e: number
    reductionPercent: number
  }

  export interface TCEResult {
    input: HouseholdInput
    currentCosts: EnergyBreakdown
    electrifiedCosts: EnergyBreakdown
    annualSavings: number
    monthlySavings: number
    savingsPercent: number
    roadmap: SwitchRecommendation[]
    emissions: EmissionsResult
    consumption: ConsumptionBreakdown
  }
  ```
- **MIRROR**: `lib/household-model/types.ts` — string literal unions, interface pattern, JSDoc comments
- **GOTCHA**: Use `EnergyRegion` (8 regions with heating data) not the household model's `Region` (16 regions). The energy model only has heating multiplier data for these 8 regions.
- **VALIDATE**: `npx tsc --noEmit`

---

### Task 2: CREATE `lib/energy-model/constants.ts`

- **ACTION**: Centralise all NZ energy pricing data and Rewiring Aotearoa assumptions
- **IMPLEMENT**: All values from the spec (exact numbers listed below). Every constant must have a JSDoc comment citing its data source.
  ```typescript
  /**
   * NZ Energy Cost Constants — April 2026
   *
   * Sources:
   * - Rewiring Aotearoa household energy model (2024)
   * - Powerswitch NZ regional electricity rates (2025)
   * - MBIE weekly fuel price monitoring (March 2026)
   * - Waka Kotahi EV road user charges (2025)
   * - EECA GenLess appliance efficiency data (2025)
   */

  import type { EnergyRegion, HeatingType, WaterHeatingType, CooktopType, VehicleType } from './types'

  // ─── Electricity ────────────────────────────────────────────
  /** Regional electricity rates in NZD per kWh (Powerswitch 2025) */
  export const ELECTRICITY_RATES: Record<EnergyRegion, number> = {
    'northland': 0.48,
    'auckland': 0.38,
    'waikato': 0.393,
    'bay-of-plenty': 0.393,
    'wellington': 0.346,
    'canterbury': 0.40,
    'otago': 0.42,
    'southland': 0.45,
  }
  export const NATIONAL_AVG_ELECTRICITY_RATE = 0.393
  export const ELECTRICITY_FIXED_ANNUAL = 768

  // ─── Gas ────────────────────────────────────────────────────
  export const GAS_RATE = 0.118          // NZD per kWh
  export const GAS_FIXED_ANNUAL = 689    // NZD per year
  export const LPG_RATE = 0.255          // NZD per kWh

  // ─── Petrol ─────────────────────────────────────────────────
  export const PETROL_PRICE_PER_LITRE = 3.20    // NZD, slider default
  export const PETROL_ENERGY_RATE = 0.289        // NZD per kWh equivalent
  export const PETROL_LITRES_PER_100KM = 8.5     // average NZ car

  // ─── EV ─────────────────────────────────────────────────────
  export const EV_KWH_PER_100KM = 18
  export const EV_RUC_PER_1000KM = 76   // NZD, Waka Kotahi 2025

  // ─── Space Heating Consumption (kWh/day, base before regional multiplier) ──
  export const HEATING_CONSUMPTION: Record<HeatingType, number> = {
    'wood': 14.44,
    'gas': 11.73,
    'lpg': 11.73,
    'electric-resistive': 9.39,
    'heat-pump': 2.30,
  }

  // ─── Regional Heating Multipliers (Rewiring Aotearoa) ──────
  export const REGIONAL_HEATING_MULTIPLIERS: Record<EnergyRegion, number> = {
    'northland': 0.49,
    'auckland': 0.63,
    'waikato': 1.06,
    'bay-of-plenty': 0.78,
    'wellington': 1.13,
    'canterbury': 1.56,
    'otago': 1.60,
    'southland': 1.76,
  }

  // ─── Water Heating Consumption (kWh/day) ───────────────────
  export const WATER_HEATING_CONSUMPTION: Record<WaterHeatingType, number> = {
    'gas': 6.60,
    'lpg': 6.60,
    'electric-resistive': 6.97,
    'heat-pump': 1.71,
    'solar': 0.50,   // minimal electric boost
  }

  // ─── Cooktop Consumption (kWh/day) ─────────────────────────
  export const COOKTOP_CONSUMPTION: Record<CooktopType, number> = {
    'gas': 1.94,
    'lpg': 1.94,
    'electric-resistive': 0.83,
    'induction': 0.75,
  }

  // ─── Occupancy Multipliers (base = 2.7 people, Rewiring Aotearoa) ──
  export const OCCUPANCY_MULTIPLIERS: Record<number, number> = {
    1: 0.56,
    2: 0.90,
    3: 1.03,
    4: 1.07,
    5: 1.37,
  }

  // ─── Vehicle Consumption (kWh/day at 210km/week) ───────────
  export const VEHICLE_CONSUMPTION_DAILY: Record<VehicleType, number> = {
    'petrol': 31.40,
    'diesel': 22.80,
    'electric': 7.324,
    'phev': 0,   // calculated as 60% petrol + 40% electric
    'hybrid': 0, // calculated as 70% petrol + 30% electric
    'none': 0,
  }

  export const VEHICLE_WEEKLY_KM: Record<import('./types').VehicleUsage, number> = {
    'low': 50,
    'medium': 210,
    'high': 400,
  }

  // ─── Appliance Installed Costs (NZD incl installation) ──────
  export const APPLIANCE_COSTS: Record<string, number> = {
    'heat-pump-heating': 3778,
    'heat-pump-hot-water': 6999,
    'induction-cooktop': 2695,
    'solar-5kw': 9000,
  }

  export const SOLAR_ANNUAL_SAVINGS = 1600  // simplified offset

  // ─── Emissions Factors (kgCO2e per kWh) ────────────────────
  export const EMISSIONS_FACTORS: Record<string, number> = {
    'electricity': 0.074,
    'gas': 0.201,
    'lpg': 0.219,
    'petrol': 0.258,
    'diesel': 0.253,
    'wood': 0.016,
  }

  // ─── Base Appliance Consumption ─────────────────────────────
  export const BASE_APPLIANCE_KWH_PER_DAY = 8.0  // fridge, electronics, lighting, etc.
  ```
- **MIRROR**: `lib/household-model/constants.ts` — JSDoc header with all sources, `Record<Type, number>` pattern, section divider comments
- **GOTCHA**: All rates in NZD. kWh/day for consumption, $/kWh for rates, $/year for fixed charges. PHEV and Hybrid vehicle consumption is calculated in `consumption.ts`, not stored here (set to 0 in the lookup).
- **VALIDATE**: `npx tsc --noEmit`

---

### Task 3: CREATE `lib/energy-model/consumption.ts`

- **ACTION**: Calculate annual energy consumption per category
- **IMPLEMENT**:
  ```typescript
  import type { HouseholdInput, ConsumptionBreakdown, VehicleInput } from './types'
  import {
    HEATING_CONSUMPTION, REGIONAL_HEATING_MULTIPLIERS,
    WATER_HEATING_CONSUMPTION, COOKTOP_CONSUMPTION,
    OCCUPANCY_MULTIPLIERS, VEHICLE_CONSUMPTION_DAILY,
    VEHICLE_WEEKLY_KM, BASE_APPLIANCE_KWH_PER_DAY,
  } from './constants'

  function getOccupancyMultiplier(occupants: number): number {
    if (occupants >= 5) return OCCUPANCY_MULTIPLIERS[5]
    return OCCUPANCY_MULTIPLIERS[occupants] ?? OCCUPANCY_MULTIPLIERS[2]
  }

  export function calculateHeatingConsumption(
    type: HouseholdInput['heating'],
    region: HouseholdInput['region'],
    occupants: number,
  ): number {
    const dailyBase = HEATING_CONSUMPTION[type]
    const regionalMultiplier = REGIONAL_HEATING_MULTIPLIERS[region]
    const occupancyMultiplier = getOccupancyMultiplier(occupants)
    return dailyBase * 365 * occupancyMultiplier * regionalMultiplier
  }

  export function calculateWaterHeatingConsumption(
    type: HouseholdInput['waterHeating'],
    occupants: number,
  ): number {
    const dailyBase = WATER_HEATING_CONSUMPTION[type]
    const occupancyMultiplier = getOccupancyMultiplier(occupants)
    return dailyBase * 365 * occupancyMultiplier
  }

  export function calculateCooktopConsumption(
    type: HouseholdInput['cooktop'],
    occupants: number,
  ): number {
    const dailyBase = COOKTOP_CONSUMPTION[type]
    const occupancyMultiplier = getOccupancyMultiplier(occupants)
    return dailyBase * 365 * occupancyMultiplier
  }

  export function calculateBaseApplianceConsumption(occupants: number): number {
    const occupancyMultiplier = getOccupancyMultiplier(occupants)
    return BASE_APPLIANCE_KWH_PER_DAY * 365 * occupancyMultiplier
  }

  function calculateSingleVehicleConsumption(vehicle: VehicleInput): number {
    const weeklyKm = VEHICLE_WEEKLY_KM[vehicle.usage]
    const scaleFactor = weeklyKm / 210 // base data is at 210km/week

    if (vehicle.type === 'phev') {
      const petrolDaily = VEHICLE_CONSUMPTION_DAILY['petrol'] * 0.6
      const electricDaily = VEHICLE_CONSUMPTION_DAILY['electric'] * 0.4
      return (petrolDaily + electricDaily) * 365 * scaleFactor
    }
    if (vehicle.type === 'hybrid') {
      const petrolDaily = VEHICLE_CONSUMPTION_DAILY['petrol'] * 0.7
      const electricDaily = VEHICLE_CONSUMPTION_DAILY['electric'] * 0.3
      return (petrolDaily + electricDaily) * 365 * scaleFactor
    }
    if (vehicle.type === 'none') return 0

    return VEHICLE_CONSUMPTION_DAILY[vehicle.type] * 365 * scaleFactor
  }

  export function calculateVehicleConsumption(vehicles: VehicleInput[]): number {
    return vehicles.reduce((total, v) => total + calculateSingleVehicleConsumption(v), 0)
  }

  export function calculateTotalConsumption(input: HouseholdInput): ConsumptionBreakdown {
    const heating = calculateHeatingConsumption(input.heating, input.region, input.occupants)
    const waterHeating = calculateWaterHeatingConsumption(input.waterHeating, input.occupants)
    const cooktop = calculateCooktopConsumption(input.cooktop, input.occupants)
    const baseAppliances = calculateBaseApplianceConsumption(input.occupants)
    const vehicles = calculateVehicleConsumption(input.vehicles)

    return {
      heatingKwhPerYear: heating,
      waterHeatingKwhPerYear: waterHeating,
      cooktopKwhPerYear: cooktop,
      baseAppliancesKwhPerYear: baseAppliances,
      vehiclesKwhPerYear: vehicles,
      totalKwhPerYear: heating + waterHeating + cooktop + baseAppliances + vehicles,
    }
  }
  ```
- **FORMULA**: `annual_kWh = daily_kWh * 365 * occupancy_multiplier * regional_multiplier`
- **GOTCHA**: Vehicle consumption does NOT use occupancy multiplier (it's per-vehicle, not per-household). Regional multiplier only applies to heating, not water/cooktop/appliances. PHEV = 60% petrol + 40% electric. Hybrid = 70% petrol + 30% electric. `getOccupancyMultiplier` caps at 5+ and defaults to 2 if invalid.
- **VALIDATE**: `npx tsc --noEmit`

---

### Task 4: CREATE `lib/energy-model/costs.ts`

- **ACTION**: Calculate current and electrified annual costs from consumption
- **IMPLEMENT**:
  ```typescript
  import type { HouseholdInput, ConsumptionBreakdown, EnergyBreakdown } from './types'
  import {
    ELECTRICITY_RATES, ELECTRICITY_FIXED_ANNUAL,
    GAS_RATE, GAS_FIXED_ANNUAL, LPG_RATE,
    PETROL_ENERGY_RATE, EV_RUC_PER_1000KM, EV_KWH_PER_100KM,
    VEHICLE_WEEKLY_KM, SOLAR_ANNUAL_SAVINGS,
    HEATING_CONSUMPTION, WATER_HEATING_CONSUMPTION, COOKTOP_CONSUMPTION,
    REGIONAL_HEATING_MULTIPLIERS,
  } from './constants'
  import { getOccupancyMultiplier } from './consumption' // export this helper

  function getElectricityRate(region: HouseholdInput['region']): number {
    return ELECTRICITY_RATES[region]
  }

  function hasGasAppliances(input: HouseholdInput): boolean {
    return input.heating === 'gas' || input.waterHeating === 'gas' || input.cooktop === 'gas'
  }

  function hasLpgAppliances(input: HouseholdInput): boolean {
    return input.heating === 'lpg' || input.waterHeating === 'lpg' || input.cooktop === 'lpg'
  }

  export function calculateCurrentCosts(input: HouseholdInput, consumption: ConsumptionBreakdown): EnergyBreakdown {
    const elecRate = getElectricityRate(input.region)

    // Electricity cost: all electric appliance consumption × rate + fixed
    // Only count consumption from electric-type appliances toward the electricity bill
    let electricKwh = consumption.baseAppliancesKwhPerYear
    if (input.heating === 'electric-resistive' || input.heating === 'heat-pump') {
      electricKwh += consumption.heatingKwhPerYear
    }
    if (input.waterHeating === 'electric-resistive' || input.waterHeating === 'heat-pump') {
      electricKwh += consumption.waterHeatingKwhPerYear
    }
    if (input.cooktop === 'electric-resistive' || input.cooktop === 'induction') {
      electricKwh += consumption.cooktopKwhPerYear
    }
    const electricity = electricKwh * elecRate + ELECTRICITY_FIXED_ANNUAL

    // Gas cost
    let gasKwh = 0
    const gasRate = hasLpgAppliances(input) ? LPG_RATE : GAS_RATE
    if (['gas', 'lpg'].includes(input.heating)) gasKwh += consumption.heatingKwhPerYear
    if (['gas', 'lpg'].includes(input.waterHeating)) gasKwh += consumption.waterHeatingKwhPerYear
    if (['gas', 'lpg'].includes(input.cooktop)) gasKwh += consumption.cooktopKwhPerYear
    const gasFixed = hasGasAppliances(input) || hasLpgAppliances(input) ? GAS_FIXED_ANNUAL : 0
    const gas = gasKwh * gasRate + gasFixed

    // Petrol cost (vehicle fuel only)
    let petrolKwh = 0
    for (const v of input.vehicles) {
      if (['petrol', 'diesel'].includes(v.type)) petrolKwh += /* their share of vehicle consumption */
      // For PHEV: 60% of vehicle consumption is petrol
      // For hybrid: 70% is petrol
    }
    // Simplified: use petrol energy rate for all fossil vehicle consumption
    const petrol = consumption.vehiclesKwhPerYear * PETROL_ENERGY_RATE
    // Better: split by vehicle type — but for POC the above is sufficient

    // Vehicle running costs (maintenance, RUC for EVs is in electrified)
    const vehicleRunningCosts = 0 // excluded for POC simplicity

    return {
      electricity,
      gas,
      petrol,
      vehicleRunningCosts,
      total: electricity + gas + petrol + vehicleRunningCosts,
    }
  }

  export function calculateElectrifiedCosts(input: HouseholdInput, consumption: ConsumptionBreakdown): EnergyBreakdown {
    const elecRate = getElectricityRate(input.region)
    const occMultiplier = getOccupancyMultiplier(input.occupants)
    const regionalMultiplier = REGIONAL_HEATING_MULTIPLIERS[input.region]

    // All heating → heat pump
    const hpHeatingKwh = HEATING_CONSUMPTION['heat-pump'] * 365 * occMultiplier * regionalMultiplier
    // All water → heat pump
    const hpWaterKwh = WATER_HEATING_CONSUMPTION['heat-pump'] * 365 * occMultiplier
    // All cooking → induction
    const inductionKwh = COOKTOP_CONSUMPTION['induction'] * 365 * occMultiplier
    // Base appliances unchanged
    const baseKwh = consumption.baseAppliancesKwhPerYear

    // All vehicles → EV
    let evKwh = 0
    let totalEvKm = 0
    for (const v of input.vehicles) {
      if (v.type === 'none') continue
      const weeklyKm = VEHICLE_WEEKLY_KM[v.usage]
      const annualKm = weeklyKm * 52
      evKwh += (annualKm / 100) * EV_KWH_PER_100KM
      totalEvKm += annualKm
    }

    const totalElecKwh = hpHeatingKwh + hpWaterKwh + inductionKwh + baseKwh + evKwh
    const electricity = totalElecKwh * elecRate + ELECTRICITY_FIXED_ANNUAL

    // EV RUC
    const evRuc = (totalEvKm / 1000) * EV_RUC_PER_1000KM

    // Solar offset
    const solarOffset = input.includeSolar ? SOLAR_ANNUAL_SAVINGS : 0

    // No gas costs (disconnected in fully electrified scenario)
    return {
      electricity: electricity - solarOffset,
      gas: 0,
      petrol: 0,
      vehicleRunningCosts: evRuc,
      total: electricity - solarOffset + evRuc,
    }
  }

  export function calculateSavings(current: EnergyBreakdown, electrified: EnergyBreakdown) {
    const annual = current.total - electrified.total
    return {
      annual,
      monthly: Math.round(annual / 12),
      percentage: Math.round((annual / current.total) * 100),
    }
  }
  ```
- **FORMULA**: `cost = (consumption_kWh * rate_per_kWh) + fixed_annual_charges`
- **GOTCHA**: `getOccupancyMultiplier` must be exported from `consumption.ts` so `costs.ts` can use it. In the electrified scenario: no gas fixed charges, no gas variable costs, all vehicles become EVs with RUC. Solar offset subtracts from electricity cost. Petrol cost attribution for mixed vehicle types (PHEV/hybrid) — for POC, simplify by treating all non-electric vehicle kWh as petrol-rate.
- **VALIDATE**: `npx tsc --noEmit`

---

### Task 5: CREATE `lib/energy-model/roadmap.ts`

- **ACTION**: Generate prioritised switching roadmap with payback periods
- **IMPLEMENT**:
  ```typescript
  import type { HouseholdInput, EnergyBreakdown, SwitchRecommendation } from './types'
  import { APPLIANCE_COSTS, SOLAR_ANNUAL_SAVINGS } from './constants'

  export function generateRoadmap(
    input: HouseholdInput,
    currentCosts: EnergyBreakdown,
    electrifiedCosts: EnergyBreakdown,
  ): SwitchRecommendation[] {
    const recommendations: SwitchRecommendation[] = []

    // Heating: gas/lpg/wood/resistive → heat pump
    if (input.heating !== 'heat-pump') {
      // Calculate annual cost difference for heating specifically
      // ... (derive from consumption difference * rate)
      recommendations.push({
        appliance: 'Heat Pump (Heating)',
        description: 'Replace current heating with an efficient heat pump',
        currentAnnualCost: /* heating portion of current costs */,
        electrifiedAnnualCost: /* heat pump heating cost */,
        annualSaving: /* difference */,
        upfrontCost: APPLIANCE_COSTS['heat-pump-heating'],
        paybackYears: /* upfrontCost / annualSaving */,
        priority: 0, // set after sorting
      })
    }

    // Water: gas/lpg/resistive → heat pump hot water
    if (input.waterHeating !== 'heat-pump') {
      // similar pattern
    }

    // Cooktop: gas/lpg/resistive → induction
    if (input.cooktop !== 'induction') {
      // similar pattern
    }

    // Vehicle: petrol/diesel/hybrid → EV (per vehicle)
    for (const v of input.vehicles) {
      if (v.type !== 'electric' && v.type !== 'none') {
        // calculate per-vehicle saving
      }
    }

    // Solar (optional — always shown as an option)
    if (!input.includeSolar) {
      recommendations.push({
        appliance: 'Solar Panels (5kW)',
        description: 'Generate your own electricity and reduce grid dependence',
        currentAnnualCost: 0,
        electrifiedAnnualCost: 0,
        annualSaving: SOLAR_ANNUAL_SAVINGS,
        upfrontCost: APPLIANCE_COSTS['solar-5kw'],
        paybackYears: APPLIANCE_COSTS['solar-5kw'] / SOLAR_ANNUAL_SAVINGS,
        priority: 0,
      })
    }

    // Sort by payback period (shortest first = best ROI)
    recommendations.sort((a, b) => a.paybackYears - b.paybackYears)

    // Assign priority numbers
    recommendations.forEach((r, i) => { r.priority = i + 1 })

    return recommendations
  }
  ```
- **EDGE_CASES**:
  - If `annualSaving <= 0`, set `paybackYears = Infinity` — still include in roadmap but mark as "not recommended at current prices"
  - If user already has heat pump heating, skip heating recommendation
  - If user has no vehicles (all `'none'`), skip EV recommendation
  - Solar always shown unless already included in electrified scenario
- **VALIDATE**: `npx tsc --noEmit`

---

### Task 6: CREATE `lib/energy-model/index.ts`

- **ACTION**: Public API that wires consumption → costs → roadmap → result
- **IMPLEMENT**:
  ```typescript
  import type { HouseholdInput, TCEResult } from './types'
  import { calculateTotalConsumption } from './consumption'
  import { calculateCurrentCosts, calculateElectrifiedCosts, calculateSavings } from './costs'
  import { generateRoadmap } from './roadmap'
  import { EMISSIONS_FACTORS } from './constants'

  export function calculateTCE(input: HouseholdInput): TCEResult {
    const consumption = calculateTotalConsumption(input)
    const currentCosts = calculateCurrentCosts(input, consumption)
    const electrifiedCosts = calculateElectrifiedCosts(input, consumption)
    const savings = calculateSavings(currentCosts, electrifiedCosts)
    const roadmap = generateRoadmap(input, currentCosts, electrifiedCosts)

    // Emissions calculation
    const currentEmissions = /* sum each fuel type's kWh * emissions factor */
    const electrifiedEmissions = consumption.totalKwhPerYear * EMISSIONS_FACTORS['electricity']

    return {
      input,
      currentCosts,
      electrifiedCosts,
      annualSavings: savings.annual,
      monthlySavings: savings.monthly,
      savingsPercent: savings.percentage,
      roadmap,
      emissions: {
        currentKgCO2e: currentEmissions,
        electrifiedKgCO2e: electrifiedEmissions,
        reductionKgCO2e: currentEmissions - electrifiedEmissions,
        reductionPercent: Math.round(((currentEmissions - electrifiedEmissions) / currentEmissions) * 100),
      },
      consumption,
    }
  }

  // Re-export all types
  export type {
    EnergyRegion, HeatingType, WaterHeatingType, CooktopType,
    VehicleType, VehicleUsage, VehicleInput,
    HouseholdInput, ConsumptionBreakdown, EnergyBreakdown,
    SwitchRecommendation, EmissionsResult, TCEResult,
  } from './types'

  // Re-export constants needed by UI
  export {
    ELECTRICITY_RATES, REGIONAL_HEATING_MULTIPLIERS,
    APPLIANCE_COSTS, SOLAR_ANNUAL_SAVINGS,
    PETROL_PRICE_PER_LITRE, EV_RUC_PER_1000KM,
  } from './constants'

  // Re-export demo profiles
  export { TCE_DEMO_PROFILES } from './demo-profiles'
  ```
- **VALIDATE**: `npx tsc --noEmit && npm run build`

---

### Task 7: CREATE `lib/energy-model/demo-profiles.ts`

- **ACTION**: 3 pre-built household profiles for stakeholder demos
- **IMPLEMENT**:
  ```typescript
  import type { HouseholdInput } from './types'

  /** Pre-built profiles for stakeholder demonstrations */
  export const TCE_DEMO_PROFILES: Record<string, { label: string; description: string; input: HouseholdInput }> = {
    'auckland-family': {
      label: 'Auckland Family',
      description: 'Family of 4 in Remuera — gas heating, gas hot water, gas cooktop, 2 petrol cars',
      input: {
        region: 'auckland',
        occupants: 4,
        heating: 'gas',
        waterHeating: 'gas',
        cooktop: 'gas',
        vehicles: [
          { type: 'petrol', usage: 'medium' },
          { type: 'petrol', usage: 'low' },
        ],
        includeSolar: false,
      },
    },
    'wellington-couple': {
      label: 'Wellington Couple',
      description: 'Couple in Karori — electric resistive heating, electric hot water, electric cooktop, 1 petrol car',
      input: {
        region: 'wellington',
        occupants: 2,
        heating: 'electric-resistive',
        waterHeating: 'electric-resistive',
        cooktop: 'electric-resistive',
        vehicles: [
          { type: 'petrol', usage: 'low' },
        ],
        includeSolar: false,
      },
    },
    'christchurch-homeowner': {
      label: 'Christchurch Homeowner',
      description: 'Family of 3 in Riccarton — heat pump, gas hot water, gas cooktop, 1 petrol + 1 hybrid',
      input: {
        region: 'canterbury',
        occupants: 3,
        heating: 'heat-pump',
        waterHeating: 'gas',
        cooktop: 'gas',
        vehicles: [
          { type: 'petrol', usage: 'medium' },
          { type: 'hybrid', usage: 'low' },
        ],
        includeSolar: false,
      },
    },
  }
  ```
- **VALIDATION THRESHOLDS** (from spec):
  - Auckland Family: `currentCosts.total > 10000` (high gas + 2 petrol vehicles)
  - Wellington Couple: `currentCosts.total > 5000` (mostly electricity + petrol)
  - Christchurch Homeowner: `currentCosts.total > 7000` (mixed)
  - All: `electrifiedCosts.total < currentCosts.total`
  - All: roadmap payback periods between 2–15 years
- **VALIDATE**: `npx tsc --noEmit` then manually verify by adding a temporary test script or console.log in a scratch file

---

### Task 8: UPDATE `app/layout.tsx`

- **ACTION**: Update metadata to reflect product rename
- **IMPLEMENT**:
  - Change `title` from `'Genesis | Household Cost Dashboard'` to `'Genesis | Cost of Living Assistant'`
  - Change `description` from `'See where your money goes and get AI-powered tips to reduce household costs.'` to `'See what energy is really costing your household — and how much you could save by switching to electricity.'`
  - Update `openGraph.title` and `openGraph.description` to match
- **MIRROR**: Existing pattern at `app/layout.tsx:18-32`
- **VALIDATE**: `npm run build` — metadata renders correctly

---

### Task 9: UPDATE `components/layout/header.tsx`

- **ACTION**: Update nav items and branding for new multi-section structure
- **IMPLEMENT**:
  - Replace `navItems` array (line 7-11) with:
    ```typescript
    const navItems = [
      { label: 'Home', target: 'home' },
      { label: 'Calculator', target: 'calculator' },
      { label: 'Results', target: 'results' },
      { label: 'Savings', target: 'savings' },
      { label: 'Dashboard', target: 'dashboard' },
    ]
    ```
  - Update subtitle text (line 43): `'Cost of Living Advisor'` → `'Cost of Living Assistant'`
- **MIRROR**: Existing header pattern — no structural changes, just data updates
- **VALIDATE**: `npx tsc --noEmit`

---

### Task 10: UPDATE `app/page.tsx`

- **ACTION**: Add landing, calculator, and results sections above the existing dashboard
- **IMPLEMENT**:
  - Keep existing `Header` + `Dashboard` rendering
  - Add new sections between `Header` and `Dashboard`:
    1. **Landing section** (`id="home"`): Full-viewport hero with the confronting question "Do you know what energy is actually costing you — across everything?", a brief sub-headline, and a CTA button that scrolls to `#calculator`
    2. **Calculator section** (`id="calculator"`): For now, renders a demo profile selector (similar to existing `ProfileSwitcher`) that picks from `TCE_DEMO_PROFILES`. The actual multi-step form is Phase 3. Show the selected profile's description.
    3. **Results section** (`id="results"`): Renders the `TCEResult` from `calculateTCE(selectedProfile.input)`. Show: headline current total, electrified total, annual savings. A grouped `BarChart` comparing current vs electrified by category (electricity, gas, petrol). Switching roadmap as a list of cards.
    4. **Savings placeholder** (`id="savings"`): A section with the heading "Your Savings Playbook" and a "Coming soon" message. Placeholder for Phase 7 content.
  - Wire up the navigate handler to include the new section IDs
  - Import and use `calculateTCE`, `TCE_DEMO_PROFILES` from `@/lib/energy-model`
  - Import and use `formatCurrency`, `formatPercent` from `@/lib/format`
  - Use Recharts `BarChart` for the comparison chart (two `<Bar>` children, no `stackId`)
  - Use existing `Card`, `Button`, `Badge` from `@/components/ui/`
- **GOTCHA**: The existing `Dashboard` component registers its own navigate handler. The new page-level navigate handler must handle BOTH new sections (home, calculator, results, savings) AND delegate to Dashboard's handler for existing sections (dashboard, spending, insights). Extend the ref pattern at `app/page.tsx:8` to handle this.
- **DESIGN**: Use `bg-primary` (Ultra Orange) for the CTA button. Use `text-primary` for the headline savings number. Use `bg-accent/30` (Sunwash Yellow) for the savings highlight badge. Chart colours: `var(--chart-1)` for current costs, `var(--chart-2)` for electrified costs.
- **VALIDATE**: `npm run build && npm run dev` — visually verify all sections render and navigation works

---

### Task 11: VERIFY demo profile calculations

- **ACTION**: Validate that `calculateTCE()` produces credible numbers for all 3 demo profiles
- **IMPLEMENT**: Add a temporary verification by calling `calculateTCE` with each demo profile and checking:
  - Auckland Family: `currentCosts.total` > $10,000, `annualSavings` > $3,000
  - Wellington Couple: `currentCosts.total` > $5,000, `annualSavings` > $1,000
  - Christchurch Homeowner: `currentCosts.total` > $7,000, `annualSavings` > $1,500
  - All: `electrifiedCosts.total < currentCosts.total`
  - All: `roadmap` has at least 2 items
  - All: `emissions.reductionPercent > 0`
- **GOTCHA**: If numbers seem too high or too low, check: occupancy multiplier application, regional heating multiplier, whether gas fixed charges are being double-counted, whether vehicle consumption is being scaled correctly by usage level
- **VALIDATE**: Console output matches expected ranges

---

### Task 12: FINAL validation pass

- **ACTION**: Run full build and verify end-to-end
- **IMPLEMENT**:
  1. `npx tsc --noEmit` — all types compile
  2. `npm run build` — production build succeeds
  3. `npm run dev` — dev server starts
  4. Visual check: landing section shows confronting question
  5. Visual check: calculator section shows demo profile selector
  6. Visual check: results section shows TCE numbers and comparison chart
  7. Visual check: all nav items scroll to correct sections
  8. Visual check: existing dashboard still works below the new sections
- **VALIDATE**: All checks pass

---

## Testing Strategy

### Verification Approach

No formal test framework is configured in this project (no `__tests__/`, no test runner in `package.json`). Validation is through:

1. **TypeScript compilation**: `npx tsc --noEmit` catches type errors
2. **Build verification**: `npm run build` catches runtime import/export issues
3. **Demo profile threshold checks**: Each profile through `calculateTCE()` must hit numeric thresholds
4. **Visual verification**: Dev server + browser inspection

### Edge Cases Checklist

- [ ] Single occupant household (multiplier 0.56)
- [ ] 5+ occupant household (multiplier 1.37)
- [ ] Household with no gas at all (electric everything) — gas cost should be $0, no gas fixed charges
- [ ] Household with no vehicles (all `'none'`) — petrol cost should be $0, no EV in roadmap
- [ ] Already-electrified household (heat pump + heat pump HW + induction + EV) — savings should be near $0
- [ ] Northland (lowest heating multiplier 0.49) vs Southland (highest 1.76)
- [ ] PHEV vehicle (60/40 split)
- [ ] Solar included — electricity cost reduced by $1,600
- [ ] Division by zero in payback period (annualSaving = 0)

---

## Validation Commands

### Level 1: STATIC_ANALYSIS
```bash
npx tsc --noEmit
```
**EXPECT**: Exit 0, no type errors

### Level 2: BUILD
```bash
npm run build
```
**EXPECT**: Exit 0, production build succeeds

### Level 3: DEV_SERVER
```bash
npm run dev
```
**EXPECT**: Server starts on localhost:3000, all sections render

### Level 5: BROWSER_VALIDATION

Verify in browser:
- [ ] Landing section: question headline, sub-text, CTA button
- [ ] CTA scrolls to calculator section
- [ ] Calculator: demo profile selector works, description updates
- [ ] Results: shows current total, electrified total, savings
- [ ] Results: bar chart renders with correct colours
- [ ] Results: roadmap cards show appliance, saving, payback
- [ ] Nav: all 5 items scroll to correct sections
- [ ] Existing dashboard: still renders correctly below new sections

---

## Acceptance Criteria

- [ ] `lib/energy-model/` contains 7 files: types, constants, consumption, costs, roadmap, demo-profiles, index
- [ ] `calculateTCE()` returns credible results for all 3 demo profiles within threshold ranges
- [ ] App has 5 navigable sections: Home, Calculator, Results, Savings (placeholder), Dashboard
- [ ] Header shows "Cost of Living Assistant" and new nav items
- [ ] Layout metadata reflects product rename
- [ ] Comparison bar chart renders current vs electrified side-by-side
- [ ] Switching roadmap shows prioritised recommendations with payback periods
- [ ] Existing household dashboard functionality is preserved (not broken)
- [ ] `npx tsc --noEmit` and `npm run build` both pass

---

## Completion Checklist

- [ ] All 12 tasks completed in dependency order
- [ ] Each task validated immediately after completion
- [ ] Level 1: TypeScript compilation passes
- [ ] Level 2: Production build succeeds
- [ ] Level 3: Dev server runs
- [ ] Level 5: Browser validation passes
- [ ] All acceptance criteria met

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| TCE calculation produces unrealistic numbers | Medium | High | Validate against 3 demo profiles with explicit numeric thresholds from the spec. Cross-check against Rewiring Aotearoa calculator outputs. |
| Scroll navigation breaks with more sections | Low | Medium | Existing scroll pattern already works. New sections use same `id` + `scrollIntoView` approach. |
| Current costs incorrectly attribute consumption to wrong fuel type | Medium | High | Careful separation: only electric-type appliance consumption goes to electricity bill, only gas-type goes to gas bill. Test with all-electric and all-gas profiles. |
| Page becomes too long / slow with all sections | Low | Low | POC concern only. All calculation is client-side (fast). Chart rendering is lazy (Recharts only renders visible). |
| Existing dashboard components break when page structure changes | Low | Medium | Dashboard component is self-contained — receives only `onRegisterNavigate`. New sections are sibling elements, not wrappers. |

---

## Notes

- **Phase 2 spec completeness**: The surviving `phase-2-energy-cost-model.plan.md` contains every constant value, every type, and every formula needed. No research or estimation required — this is a rebuild from a complete blueprint.
- **EnergyRegion vs Region**: The energy model uses `EnergyRegion` (8 regions) because Rewiring Aotearoa only provides heating multiplier data for 8 NZ regions. The household model's `Region` type (16 regions) is broader. A mapping from 16 → 8 will be needed in the calculator UI (Phase 3) but not in the engine itself.
- **`getOccupancyMultiplier` export**: This helper must be exported from `consumption.ts` because `costs.ts` needs it for the electrified scenario calculation (re-computing heat pump consumption from scratch, not using the current consumption figures).
- **Petrol cost simplification**: For the POC, all fossil vehicle consumption is multiplied by `PETROL_ENERGY_RATE`. A production version would differentiate petrol vs diesel rates. This is acceptable for the POC and noted in the PRD's "Won't build" section.
- **No user input form yet**: Task 10 uses a demo profile selector, not a multi-step form. The actual form with react-hook-form + zod is Phase 3. This keeps Phases 1 & 2 focused on engine + structure.
