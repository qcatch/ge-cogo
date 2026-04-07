# Feature: NZ Energy Cost Model

## Summary

Build a TypeScript calculation engine that takes household energy inputs (electricity, gas, petrol, appliances, vehicles) and outputs: current total annual cost, projected fully-electrified cost, per-category savings, and a recommended switch order with payback periods. Based on the Rewiring Aotearoa open-source household-model methodology with 2026 NZ pricing data.

## User Story

As a New Zealand household member
I want to see my total energy spend across power, gas, and petrol compared to a fully-electrified alternative
So that I can understand the real cost of my energy and make informed decisions about switching

## Problem Statement

No existing NZ tool shows total household energy cost across all vectors (electricity + gas + petrol) or models the financial impact of full electrification. The calculation engine must be credible enough for stakeholder presentation (within 10% of EECA/Rewiring Aotearoa results).

## Solution Statement

A pure TypeScript module (`lib/energy-model/`) with no UI dependencies that: (1) defines input/output types for household energy profiles, (2) calculates current annual cost per energy vector, (3) models the electrified alternative using Rewiring Aotearoa methodology, (4) computes savings and payback periods, and (5) recommends a switch order. All NZ-specific pricing data and assumptions are centralised in a constants file for easy updating.

## Metadata

| Field            | Value                                         |
| ---------------- | --------------------------------------------- |
| Type             | NEW_CAPABILITY                                |
| Complexity       | HIGH                                          |
| Systems Affected | lib/energy-model/ (new module, no UI coupling)|
| Dependencies     | None (pure TypeScript, no external libs)      |
| Estimated Tasks  | 7                                             |

---

## UX Design

### Before State

```
╔═══════════════════════════════════════════════════════════╗
║                      BEFORE STATE                         ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║   No calculation engine exists.                           ║
║   Dashboard shows placeholder cards with no data.         ║
║                                                           ║
║   DATA_FLOW: None                                         ║
║   PAIN_POINT: Cannot compute any energy cost numbers      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

### After State

```
╔═══════════════════════════════════════════════════════════╗
║                       AFTER STATE                         ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║   ┌───────────────┐     ┌──────────────┐                  ║
║   │ HouseholdInput│────►│ calculateTCE │                  ║
║   │  - electricity│     │  (pure fn)   │                  ║
║   │  - gas        │     └──────┬───────┘                  ║
║   │  - petrol     │            │                          ║
║   │  - appliances │            ▼                          ║
║   │  - vehicles   │     ┌──────────────┐                  ║
║   │  - region     │     │  TCEResult   │                  ║
║   │  - occupants  │     │  - currentTotal                 ║
║   └───────────────┘     │  - electrifiedTotal             ║
║                         │  - annualSavings                ║
║                         │  - breakdown[]                  ║
║                         │  - roadmap[]                    ║
║                         │  - emissions                    ║
║                         └──────────────┘                  ║
║                                                           ║
║   DATA_FLOW: Input → validate → calculate → result        ║
║   VALUE: Credible TCE numbers for stakeholder demo        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

### Interaction Changes

| Location | Before | After | User Impact |
|----------|--------|-------|-------------|
| `lib/energy-model/` | Does not exist | Complete calculation engine | TCE numbers available for UI |
| Dashboard cards | Placeholder text | Can receive real computed data | Compelling financial story |

---

## Mandatory Reading

**CRITICAL: Implementation agent MUST read these files before starting any task:**

| Priority | File | Lines | Why Read This |
|----------|------|-------|---------------|
| P0 | [Rewiring Aotearoa METHODOLOGY.md](https://github.com/rewiring-nz/household-model/blob/main/METHODOLOGY.md) | all | Source methodology for all calculations |
| P1 | `/Users/qfogarty/Sites/Genesis/Azure/gen-agentforce-poc/lib/customer-context.ts` | all | PoC's CustomerContext type — reference for input shape |
| P1 | `/Users/qfogarty/Sites/Genesis/Azure/gen-agentforce-poc/lib/insights.ts` | all | PoC's derived calculation patterns |
| P2 | `/Users/qfogarty/Sites/Genesis/POC/ge-cogo/tsconfig.json` | all | TypeScript config (strict mode, path aliases) |

**External Documentation:**

| Source | Section | Why Needed |
|--------|---------|------------|
| [Rewiring Aotearoa Methodology (GitHub)](https://github.com/rewiring-nz/household-model/blob/main/METHODOLOGY.md) | All | Complete calculation formulas, default values, regional factors |
| [Powerswitch NZ Power Prices 2026](https://www.powerswitch.org.nz/finding-the-best-power-plan/power-prices-nz) | Regional pricing | Electricity rates by region |
| [EECA Home Energy Savings Calculator](https://www.eeca.govt.nz/for-homes/energy-saving-technology/plan-your-home-energy-upgrades/home-energy-savings-calculator/) | Input categories | What inputs EECA uses for comparison |

---

## NZ Energy Data Reference (2026)

### Electricity Pricing

| Metric | Value | Source |
|--------|-------|--------|
| National avg rate | 39.3c/kWh | Powerswitch 2026 |
| Auckland avg | ~38c/kWh | Powerswitch regional |
| Wellington avg | 34.6c/kWh | Powerswitch regional |
| Christchurch avg | ~40c/kWh | Powerswitch regional |
| Kerikeri/Balclutha (highest) | 48c/kWh | Powerswitch regional |
| Annual fixed charges | ~$768/year | Rewiring Aotearoa |
| Avg household consumption | ~7,000 kWh/year | MBIE |

### Gas Pricing

| Metric | Value | Source |
|--------|-------|--------|
| Volume rate | ~11.8c/kWh | Rewiring Aotearoa / MBIE |
| Annual fixed charges | ~$689/year | Rewiring Aotearoa |
| Homes on piped gas | ~300,000 (North Island) | Industry data |

### Petrol/Transport

| Metric | Value | Source |
|--------|-------|--------|
| 91 octane price | $3.42/litre (April 2026, crisis pricing) | Gaspy/1News |
| Pre-crisis baseline | ~$2.80/litre | Historical avg |
| Avg weekly fuel purchase | 43 litres | 1News |
| Avg annual petrol spend | ~$7,600 (crisis) / ~$6,300 (normal) | Calculated |
| EV running cost | ~3-5c/km | Industry consensus |
| Petrol running cost | ~15-20c/km | EECA |
| Avg km/week | 210 km | Rewiring Aotearoa |

### Appliance Costs (Installed, 2026 NZD)

| Appliance | Unit + Install | Source |
|-----------|---------------|--------|
| Heat pump (space heating) | $3,778 ($2,728 + $1,050) | Rewiring Aotearoa |
| Hot water heat pump | $6,999 ($4,678 + $2,321) | Rewiring Aotearoa |
| Induction cooktop | $2,695 ($1,430 + $1,265) | Rewiring Aotearoa |
| 5kW solar system | $9,000 | Market avg 2026 |
| Home battery (10kWh) | $12,000 | Market avg 2026 |

### Rewiring Aotearoa Energy Consumption (kWh/day)

**Space Heating (base national, before regional multiplier):**
| Type | kWh/day |
|------|---------|
| Wood | 14.44 |
| Natural gas | 11.73 |
| LPG | 11.73 |
| Electric resistance | 9.39 |
| Heat pump | 2.30 |

**Regional Heating Multipliers:**
| Region | Multiplier |
|--------|-----------|
| Northland | 0.49 |
| Auckland | 0.63 |
| Waikato | 1.06 |
| Bay of Plenty | 0.78 |
| Wellington | 1.13 |
| Canterbury | 1.56 |
| Otago | 1.60 |
| Southland | 1.76 |

**Water Heating (kWh/day):**
| Type | kWh/day |
|------|---------|
| Gas | 6.60 |
| LPG | 6.60 |
| Electric resistive | 6.97 |
| Heat pump | 1.71 |

**Cooktop (kWh/day):**
| Type | kWh/day |
|------|---------|
| Gas/LPG | 1.94 |
| Electric resistive | 0.83 |
| Induction | 0.75 |

**Occupancy Scaling (base = 2.7 people):**
| Occupants | Multiplier |
|-----------|-----------|
| 1 | 0.56 |
| 2 | 0.90 |
| 3 | 1.03 |
| 4 | 1.07 |
| 5+ | 1.37 |

**Vehicle Energy (kWh/day at 210km/week):**
| Type | kWh/day |
|------|---------|
| Petrol | 31.40 |
| Diesel | 22.80 |
| Electric | 7.324 |
| PHEV | 60% petrol + 40% electric |
| Hybrid | 70% petrol + 30% electric |

**Emissions Factors (kgCO2e/kWh):**
| Source | Factor |
|--------|--------|
| Electricity | 0.074 |
| Natural gas | 0.201 |
| LPG | 0.219 |
| Petrol | 0.258 |
| Diesel | 0.253 |
| Wood | 0.016 |

---

## Patterns to Mirror

**TYPE_DEFINITIONS:**
```typescript
// SOURCE: gen-agentforce-poc/lib/customer-context.ts:6-54
// The PoC defines types inline in the data file.
// For the energy model, define types in a dedicated types.ts file.
// Use string literal unions for enums (not TypeScript enums).
```

**FUNCTION_PATTERN:**
```typescript
// SOURCE: gen-agentforce-poc/lib/insights.ts
// Pure functions that take an input context and return derived data.
// No side effects, no state, no async.
export function calculateTCE(input: HouseholdInput): TCEResult {
  // ...
}
```

**NAMING_CONVENTION:**
```typescript
// SOURCE: ge-cogo codebase
// camelCase for functions and variables
// PascalCase for types and interfaces
// kebab-case for file names
// @/ import alias for project root
```

---

## Files to Change

| File | Action | Justification |
|------|--------|---------------|
| `lib/energy-model/types.ts` | CREATE | Input/output type definitions |
| `lib/energy-model/constants.ts` | CREATE | NZ pricing data, regional factors, emissions factors |
| `lib/energy-model/consumption.ts` | CREATE | Energy consumption calculations per appliance/vehicle |
| `lib/energy-model/costs.ts` | CREATE | Cost calculations (current and electrified) |
| `lib/energy-model/roadmap.ts` | CREATE | Switch order recommendation + payback periods |
| `lib/energy-model/index.ts` | CREATE | Public API: calculateTCE() and demo profiles |
| `lib/energy-model/demo-profiles.ts` | CREATE | Pre-built household profiles for stakeholder demos |

---

## NOT Building (Scope Limits)

- No UI components — this is pure calculation logic
- No API routes — data stays client-side for now
- No real-time pricing feeds — using static 2026 data
- No solar generation modelling — simplified solar savings estimate only
- No battery storage modelling — too complex for prototype
- No 15-year lifetime cost projections — annual comparison only
- No financing/loan calculations — out of scope per PRD

---

## Step-by-Step Tasks

### Task 1: CREATE `lib/energy-model/types.ts`

- **ACTION**: Define all TypeScript types for the energy cost model
- **IMPLEMENT**:
  - `Region` — string literal union of NZ regions
  - `HeatingType` — 'gas' | 'lpg' | 'wood' | 'electric-resistive' | 'heat-pump'
  - `WaterHeatingType` — 'gas' | 'lpg' | 'electric-resistive' | 'heat-pump' | 'solar'
  - `CooktopType` — 'gas' | 'lpg' | 'electric-resistive' | 'induction'
  - `VehicleType` — 'petrol' | 'diesel' | 'electric' | 'phev' | 'hybrid' | 'none'
  - `VehicleUsage` — 'low' | 'medium' | 'high'
  - `HouseholdInput` — complete input shape (region, occupants, heating, water, cooktop, vehicles[], electricity spend, gas spend, petrol spend)
  - `EnergyBreakdown` — per-vector cost breakdown (electricity, gas, petrol, total)
  - `SwitchRecommendation` — individual switch item (appliance, upfrontCost, annualSaving, paybackYears, priority)
  - `EmissionsResult` — current vs electrified CO2 emissions
  - `TCEResult` — complete output (currentTotal, electrifiedTotal, annualSavings, breakdown, roadmap, emissions)
- **MIRROR**: PoC's CustomerContext pattern but more structured
- **VALIDATE**: `npx tsc --noEmit`

### Task 2: CREATE `lib/energy-model/constants.ts`

- **ACTION**: Centralise all NZ energy pricing data and assumptions
- **IMPLEMENT**:
  - `ELECTRICITY_RATES` — per-region rates in $/kWh (Auckland 0.38, Wellington 0.346, national avg 0.393, etc.)
  - `ELECTRICITY_FIXED_ANNUAL` — $768/year
  - `GAS_RATE` — $0.118/kWh
  - `GAS_FIXED_ANNUAL` — $689/year
  - `LPG_RATE` — $0.255/kWh
  - `PETROL_RATE` — $0.289/kWh (energy equivalent)
  - `PETROL_PRICE_PER_LITRE` — $3.42
  - `HEATING_CONSUMPTION` — lookup table by HeatingType (kWh/day base values)
  - `REGIONAL_HEATING_MULTIPLIERS` — lookup table by Region
  - `WATER_HEATING_CONSUMPTION` — lookup table by WaterHeatingType
  - `COOKTOP_CONSUMPTION` — lookup table by CooktopType
  - `OCCUPANCY_MULTIPLIERS` — lookup table by occupant count
  - `VEHICLE_CONSUMPTION` — lookup table by VehicleType (kWh/day at 210km/week)
  - `VEHICLE_WEEKLY_KM` — { low: 50, medium: 210, high: 400 }
  - `APPLIANCE_COSTS` — lookup table (unit + install per appliance)
  - `SOLAR_COST_5KW` — $9,000
  - `SOLAR_ANNUAL_SAVINGS` — $1,600 (simplified)
  - `EMISSIONS_FACTORS` — lookup table by fuel type
  - `EV_RUC_PER_1000KM` — $76
- **GOTCHA**: All rates in NZD. Use consistent units ($/kWh for energy, kWh/day for consumption). Add JSDoc comments with data sources and dates.
- **VALIDATE**: `npx tsc --noEmit`

### Task 3: CREATE `lib/energy-model/consumption.ts`

- **ACTION**: Calculate daily/annual energy consumption per category
- **IMPLEMENT**:
  - `calculateHeatingConsumption(type, region, occupants)` → kWh/year
  - `calculateWaterHeatingConsumption(type, occupants)` → kWh/year
  - `calculateCooktopConsumption(type, occupants)` → kWh/year
  - `calculateBaseApplianceConsumption(occupants)` → kWh/year (electronics, fridge, etc.)
  - `calculateVehicleConsumption(type, usage)` → kWh/year
  - `calculateTotalConsumption(input: HouseholdInput)` → ConsumptionBreakdown
  - Apply occupancy scaling using OCCUPANCY_MULTIPLIERS
  - Apply regional heating multipliers
  - Scale vehicle consumption by usage category (low/medium/high km)
- **FORMULA**: `annual_kWh = daily_kWh × 365 × occupancy_multiplier × regional_multiplier`
- **VALIDATE**: `npx tsc --noEmit`

### Task 4: CREATE `lib/energy-model/costs.ts`

- **ACTION**: Calculate current and electrified annual costs
- **IMPLEMENT**:
  - `calculateCurrentCosts(input, consumption)` → EnergyBreakdown
    - Electricity: consumption × regional rate + fixed charges
    - Gas: consumption × gas rate + fixed charges (only if gas appliances present)
    - Petrol: vehicle consumption × petrol rate + RUCs
    - Total: sum of all vectors
  - `calculateElectrifiedCosts(input, consumption)` → EnergyBreakdown
    - All heating → heat pump consumption × electricity rate
    - All water → heat pump consumption × electricity rate
    - All cooking → induction consumption × electricity rate
    - All vehicles → EV consumption × electricity rate + EV RUCs
    - No gas fixed charges (disconnected)
    - Optional: solar offset ($1,600/year savings if solar selected)
  - `calculateSavings(current, electrified)` → { annual, monthly, percentage }
- **FORMULA**: `cost = (consumption_kWh × rate_per_kWh) + fixed_annual_charges`
- **VALIDATE**: `npx tsc --noEmit`

### Task 5: CREATE `lib/energy-model/roadmap.ts`

- **ACTION**: Generate recommended electrification switch order with payback periods
- **IMPLEMENT**:
  - `generateRoadmap(input, currentCosts, electrifiedCosts)` → SwitchRecommendation[]
  - For each non-electric appliance/vehicle, calculate:
    - `upfrontCost` from APPLIANCE_COSTS
    - `annualSaving` = current annual cost for that category - electrified annual cost
    - `paybackYears` = upfrontCost / annualSaving
  - Sort by payback period (shortest first = best ROI)
  - Include cumulative savings column
  - Skip items where user already has the electric version
- **EDGE_CASES**:
  - If annual saving is 0 or negative, set payback to Infinity and mark as "not recommended"
  - If user has no gas at all, skip gas-related switches
  - If user has no vehicle, skip EV recommendation
- **VALIDATE**: `npx tsc --noEmit`

### Task 6: CREATE `lib/energy-model/index.ts`

- **ACTION**: Public API that wires everything together
- **IMPLEMENT**:
  - `calculateTCE(input: HouseholdInput): TCEResult` — the main entry point
    1. Validate input (basic guards)
    2. Calculate consumption via `calculateTotalConsumption`
    3. Calculate current costs via `calculateCurrentCosts`
    4. Calculate electrified costs via `calculateElectrifiedCosts`
    5. Calculate emissions (current vs electrified)
    6. Generate roadmap via `generateRoadmap`
    7. Return complete TCEResult
  - Re-export all types from types.ts
- **VALIDATE**: `npx tsc --noEmit && npm run build`

### Task 7: CREATE `lib/energy-model/demo-profiles.ts`

- **ACTION**: Pre-built household profiles for stakeholder demos
- **IMPLEMENT**: Three realistic NZ household profiles:
  - **Auckland Family** — 4 occupants, gas heating, gas hot water, gas cooktop, 2 petrol vehicles (medium usage), no solar. Region: Auckland.
  - **Wellington Renter** — 2 occupants, electric resistance heating, electric hot water, electric cooktop, 1 petrol vehicle (low usage), no solar. Region: Wellington.
  - **Christchurch Homeowner** — 3 occupants, heat pump heating, gas hot water, gas cooktop, 1 petrol + 1 hybrid vehicle (medium usage), considering solar. Region: Canterbury.
- Each profile should produce credible TCE numbers when run through `calculateTCE`
- **VALIDATE**: Run each profile through calculateTCE and verify:
  - Auckland Family total > $10,000/year (high gas + petrol)
  - Wellington Renter total > $5,000/year (mostly electricity + petrol)
  - Christchurch Homeowner total > $7,000/year (mixed)
  - All electrified totals lower than current totals
  - Payback periods between 2-15 years for each switch

---

## Testing Strategy

### Unit Tests to Write

| Test File | Test Cases | Validates |
|-----------|-----------|-----------|
| Manual verification via demo profiles | Run 3 profiles through calculateTCE | End-to-end calculation accuracy |

### Edge Cases Checklist

- [ ] Household with NO gas (all-electric already) — should show vehicle-only savings
- [ ] Household with NO vehicle — should show appliance-only savings
- [ ] Already fully electrified household — should show $0 savings, empty roadmap
- [ ] Single-person household — occupancy scaling works correctly
- [ ] 5+ person household — scaling caps correctly
- [ ] Southland region — highest heating multiplier produces credible numbers
- [ ] Northland region — lowest heating multiplier produces credible numbers
- [ ] Zero annual saving on a category — payback = Infinity, excluded from roadmap

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

**EXPECT**: Build succeeds

### Level 3: SMOKE_TEST

```bash
# Create a quick test script or use the demo profiles
# Run calculateTCE with each demo profile and log results
node -e "
const { calculateTCE } = require('./.next/server/chunks/...') // or via a test route
"
```

**Note**: For a pure lib module, the primary validation is type-checking + build + manual review of demo profile outputs in Phase 3 (TCE Calculator UI).

---

## Acceptance Criteria

- [ ] `calculateTCE()` accepts a HouseholdInput and returns a TCEResult
- [ ] Auckland Family demo: total current > $10k, savings > $2k
- [ ] Wellington Renter demo: total current > $5k, some savings shown
- [ ] Christchurch demo: total current > $7k, mixed savings
- [ ] All payback periods are positive and reasonable (2-15 years)
- [ ] Emissions reduction shown for all electrification switches
- [ ] Roadmap sorted by best ROI first
- [ ] All NZ pricing data sourced and documented in constants.ts
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` succeeds

---

## Completion Checklist

- [ ] All 7 tasks completed in order
- [ ] Each task passes `npx tsc --noEmit`
- [ ] Final `npm run build` succeeds
- [ ] Demo profiles produce credible numbers
- [ ] Constants file has JSDoc comments citing data sources

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Calculation outputs don't match EECA/Rewiring Aotearoa | Medium | High | Use Rewiring Aotearoa's exact published methodology and constants |
| NZ energy prices change significantly before August | Medium | Low | All pricing in centralised constants.ts — easy to update |
| Regional data gaps for gas/petrol | Low | Medium | Use national averages as fallback, note in JSDoc |
| Stakeholders question the numbers | Medium | High | Document all data sources and dates in constants.ts |
| Occupancy scaling produces unrealistic results at extremes | Low | Low | Cap at 5+ multiplier, add sanity checks |

---

## Notes

- The Rewiring Aotearoa methodology uses 2024 base prices with inflation projections. For the prototype, we use 2026 actual prices where available (electricity: 39.3c/kWh, petrol: $3.42/L) and Rewiring Aotearoa defaults elsewhere.
- The model is deliberately simplified compared to Rewiring Aotearoa's full 15-year lifetime model. We calculate annual costs only, which is sufficient for the stakeholder demo and more intuitive for consumers.
- Solar and battery modelling is simplified to a flat annual savings figure rather than the full generation/self-consumption model. This can be enhanced in later phases.
- Petrol pricing is volatile (crisis pricing at $3.42 in April 2026 vs ~$2.80 baseline). The constants file should include both values with a note.
- The model is pure TypeScript with no external dependencies — it runs entirely client-side with zero API calls.
