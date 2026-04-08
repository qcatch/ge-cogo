# Feature: Calculator Input Simplification + Stacked Bar Chart Redesign

## Summary

Stakeholder feedback: simplify the calculator input to two steps (rego lookup + mileage radio for vehicles, EIQ login placeholder for energy) and replace the confusing grouped bar chart with two side-by-side stacked bars matching the provided mockup. The right-side bar updates as users toggle individual electrification investments on/off. Priority: get the top section working for tomorrow's demo.

## User Story

As a NZ homeowner visiting the Genesis Cost of Living Assistant,
I want to enter my car rego and see my vehicle identified, then connect my energy bills,
So that I get a personalised total cost of energy comparison with minimal effort.

## Problem Statement

The current calculator form has 8+ fields (region, occupants, heating type, water heating, cooktop, vehicle type, usage, solar). This is too much data entry. The Cogo Go Electric calculator starts with just a rego plate — that's the benchmark for friction-free input. The current grouped bar chart (4 categories side-by-side) is confusing — it doesn't clearly show how fuel types stack up to the total, or how the total changes when you toggle electrification investments.

## Solution Statement

1. **New input flow**: Replace TCEForm with a 2-step flow: (a) Enter vehicle rego → demo lookup returns make/model/fuel type → select annual mileage (Low/Medium/High/Very High radio), (b) "Connect your energy bills" EIQ placeholder button (falls back to household energy radio selects for the POC). Keep demo profile quick-fill buttons.

2. **New stacked chart**: Two side-by-side stacked vertical bars — left bar is "Current Total Energy Costs" (Petrol dark purple on top, Gas yellow in middle, Electricity orange on bottom), right bar is "Fully Electrified" (Electricity orange + dashed savings gap on top). Toggle switches for each electrification investment (heating, hot water, cooktop, EV) update the right bar in real-time. Matches the provided PDF mockup exactly.

## Metadata

| Field            | Value |
| ---------------- | ----- |
| Type             | ENHANCEMENT |
| Complexity       | MEDIUM |
| Systems Affected | app/page.tsx, components/calculator/, components/results/, lib/energy-model/ |
| Dependencies     | recharts@2.15.4 (existing) |
| Estimated Tasks  | 7 |

---

## Mandatory Reading

| Priority | File | Lines | Why Read This |
|----------|------|-------|---------------|
| P0 | `app/page.tsx` | all | Full page to UPDATE — state, chart, form wiring |
| P0 | `components/calculator/tce-form.tsx` | all | Form to REWRITE |
| P0 | `lib/energy-model/types.ts` | all | HouseholdInput, EnergyBreakdown, TCEResult |
| P0 | `lib/energy-model/roadmap.ts` | all | How switches map to appliance names |
| P0 | `reference/Total Cost of Energy Calculator mock up.pdf` | all | The visual target |
| P1 | `lib/energy-model/costs.ts` | all | How current/electrified costs are computed |
| P1 | `lib/energy-model/demo-profiles.ts` | all | Default values for presets |

---

## Files to Change

| File | Action | Justification |
|------|--------|---------------|
| `lib/energy-model/rego-lookup.ts` | CREATE | Demo rego lookup with hardcoded NZ vehicles |
| `lib/energy-model/types.ts` | UPDATE | Add `ElectrificationToggles` interface |
| `lib/energy-model/index.ts` | UPDATE | Re-export new types and rego-lookup |
| `components/calculator/tce-form.tsx` | REWRITE | Simplified 2-step rego + energy flow |
| `components/results/stacked-comparison.tsx` | CREATE | Two stacked bars matching mockup |
| `app/page.tsx` | UPDATE | Wire toggle state, new chart, new form |

---

## NOT Building (Scope Limits)

- **No real CarJam API** — hardcoded demo vehicles. Production: CarJam at $0.21/lookup
- **No real EIQ integration** — placeholder button only
- **No changes below the chart** — Power Circle, AI chat, savings playbook stay as-is
- **No Switch UI primitive from Radix** — use styled Checkbox or Button toggle for speed

---

## Step-by-Step Tasks

### Task 1: CREATE `lib/energy-model/rego-lookup.ts`

- **ACTION**: Demo vehicle rego lookup
- **IMPLEMENT**:
  ```typescript
  export interface VehicleLookupResult {
    plate: string
    make: string
    model: string
    year: number
    fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'phev'
    fuelLabel: string
  }

  const DEMO_VEHICLES: Record<string, VehicleLookupResult> = {
    'ABC123': { plate: 'ABC123', make: 'TOYOTA', model: 'COROLLA', year: 2019, fuelType: 'petrol', fuelLabel: 'Petrol' },
    'DEF456': { plate: 'DEF456', make: 'FORD', model: 'RANGER', year: 2021, fuelType: 'diesel', fuelLabel: 'Diesel' },
    'GHI789': { plate: 'GHI789', make: 'TESLA', model: 'MODEL 3', year: 2023, fuelType: 'electric', fuelLabel: 'Electric' },
    'JKL012': { plate: 'JKL012', make: 'TOYOTA', model: 'RAV4 PRIME', year: 2022, fuelType: 'phev', fuelLabel: 'Plug-in Hybrid' },
    'MNO345': { plate: 'MNO345', make: 'TOYOTA', model: 'PRIUS', year: 2020, fuelType: 'hybrid', fuelLabel: 'Hybrid' },
    'SUV001': { plate: 'SUV001', make: 'MITSUBISHI', model: 'OUTLANDER', year: 2021, fuelType: 'petrol', fuelLabel: 'Petrol' },
    'UTE002': { plate: 'UTE002', make: 'TOYOTA', model: 'HILUX', year: 2020, fuelType: 'diesel', fuelLabel: 'Diesel' },
  }

  export function lookupRego(plate: string): VehicleLookupResult | null {
    return DEMO_VEHICLES[plate.toUpperCase().replace(/\s/g, '')] ?? null
  }

  export const DEMO_PLATES = Object.keys(DEMO_VEHICLES)
  ```
- **VALIDATE**: `npx tsc --noEmit`

### Task 2: UPDATE `lib/energy-model/types.ts` + `index.ts`

- **ACTION**: Add ElectrificationToggles type, re-export rego-lookup
- **IMPLEMENT**: Add to `types.ts`:
  ```typescript
  export interface ElectrificationToggles {
    heating: boolean
    waterHeating: boolean
    cooktop: boolean
    vehicles: boolean
    solar: boolean
  }
  ```
  Add to `index.ts` re-exports:
  ```typescript
  export type { ElectrificationToggles } from './types'
  export { lookupRego, DEMO_PLATES } from './rego-lookup'
  export type { VehicleLookupResult } from './rego-lookup'
  ```
- **VALIDATE**: `npx tsc --noEmit`

### Task 3: REWRITE `components/calculator/tce-form.tsx`

- **ACTION**: Simplified 2-step input — rego lookup + home energy
- **IMPLEMENT**:
  The form has two visual sections in a single card:

  **Section 1: Your Vehicle**
  - Rego text input (uppercase, monospace, plate-like styling)
  - "Look up" Button → calls `lookupRego(plate)` → shows result card with make/model/year/fuel
  - If not found: "Vehicle not found — try one of these:" with clickable demo plates
  - Annual mileage radio: Low (~5,000km) / Medium (~12,000km) / High (~20,000km) / Very High (~30,000km)
  - "Add another vehicle" button (max 2 vehicles)

  **Section 2: Your Home Energy**
  - "Connect your energy bills via EIQ" button → disabled, shows "Coming soon"
  - Below: compact radio rows for Region, Heating, Water Heating, Cooktop (existing options, but in a more compact grid — 1 row per field with icon-label buttons)
  - Occupants: 1-5+ button group (same as current)

  **Quick-fill presets**: 3 buttons at top (Auckland Family, Wellington Couple, Christchurch Homeowner)

  **Data flow**: Same `onInputChange(HouseholdInput)` callback. The rego result's `fuelType` maps to `VehicleType`. Mileage radio maps to `VehicleUsage`:
  - Low (~5,000km) → `'low'`
  - Medium (~12,000km) → `'medium'`
  - High (~20,000km) → `'high'`
  - Very High (~30,000km) → `'high'` (capped for now)

  **Keep**: The `useWatch` → ref-based `onInputChange` pattern from the current form to avoid infinite loop.

- **VALIDATE**: `npx tsc --noEmit`

### Task 4: CREATE `components/results/stacked-comparison.tsx`

- **ACTION**: Two side-by-side stacked bars matching the PDF mockup
- **IMPLEMENT**: Custom CSS component (NOT Recharts — the mockup requires proportional stacked rectangles with embedded labels, not standard chart axes).

  **Structure**:
  ```tsx
  <div className="flex gap-6 md:gap-10 items-end justify-center">
    {/* Left: Current */}
    <div className="w-[200px] md:w-[240px] space-y-3">
      <div className="text-center">
        <p className="text-sm font-medium text-muted-foreground">Current Total Energy Costs</p>
        <p className="text-3xl font-bold text-foreground">{formatCurrency(current.total)} <span className="text-base font-normal">/ year</span></p>
      </div>
      <div className="relative" style={{ height: `${barHeight}px` }}>
        {/* Petrol segment — top, dark (Space) */}
        <div style={{ height: `${petrolPct}%` }} className="bg-foreground rounded-t-lg flex items-center justify-center text-white">
          <div className="text-center">
            <p className="font-semibold text-sm">Petrol</p>
            <p className="text-xs">{formatCurrency(current.petrol)} / year</p>
          </div>
        </div>
        {/* Gas segment — middle, yellow (Accent) */}
        <div style={{ height: `${gasPct}%` }} className="bg-accent flex items-center justify-center">
          <p className="text-xs font-medium text-foreground">Gas {formatCurrency(current.gas)} / year</p>
        </div>
        {/* Electricity segment — bottom, orange (Primary) */}
        <div style={{ height: `${elecPct}%` }} className="bg-primary rounded-b-lg flex items-center justify-center text-white">
          <div className="text-center">
            <p className="font-semibold text-sm">Electricity</p>
            <p className="text-xs">{formatCurrency(current.electricity)}</p>
          </div>
        </div>
      </div>
    </div>

    {/* Right: Electrified */}
    <div className="w-[200px] md:w-[240px] space-y-3">
      <div className="text-center">
        <p className="text-sm font-medium text-primary">Fully Electrified</p>
        <p className="text-3xl font-bold text-primary">{formatCurrency(electrified.total)} <span className="text-base font-normal">/ year</span></p>
      </div>
      <div className="relative" style={{ height: `${barHeight}px` }}>
        {/* Savings gap — top, dashed border */}
        <div style={{ height: `${savingsPct}%` }} className="border-2 border-dashed border-primary/30 bg-primary/5 rounded-t-lg flex items-center justify-center">
          <div className="text-center">
            <p className="text-xs font-medium text-muted-foreground">Annual Savings</p>
            <p className="text-sm font-bold text-primary">{formatCurrency(savings)}</p>
          </div>
        </div>
        {/* Remaining petrol if vehicles not toggled */}
        {electrified.petrol > 0 && (
          <div style={{ height: `${ePetrolPct}%` }} className="bg-foreground flex items-center justify-center text-white">
            <p className="text-xs">Petrol {formatCurrency(electrified.petrol)} / year</p>
          </div>
        )}
        {/* Electricity — fills rest, orange */}
        <div style={{ height: `${eElecPct}%` }} className="bg-primary rounded-b-lg flex items-center justify-center text-white">
          <div className="text-center">
            <p className="font-semibold text-sm">Electricity</p>
            <p className="text-xs">{formatCurrency(electrified.electricity)}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  ```

  **Height calculation**: Total bar height fixed at 400px. Each segment height = `(amount / currentTotal) * 100%`. The electrified bar is the same total height as the current bar, with savings gap filling the difference.

  **Props**:
  ```typescript
  interface StackedComparisonProps {
    currentCosts: EnergyBreakdown
    electrifiedCosts: EnergyBreakdown
    annualSavings: number
    roadmap: SwitchRecommendation[]
  }
  ```

  **Electrification legend** (right side of chart, matching mockup): List of electrification investments with filled/unfilled circles. These are read-only in this component — the toggle switches are rendered separately in page.tsx next to the chart.

- **VALIDATE**: `npx tsc --noEmit`

### Task 5: UPDATE `app/page.tsx` — Wire toggles + new chart + new form

- **ACTION**: Replace the chart section and add toggle state
- **IMPLEMENT**:
  1. Add `ElectrificationToggles` state (all true by default = fully electrified)
  2. Compute `partialInput` by applying toggles to `householdInput`
  3. Compute `partialResult = calculateTCE(partialInput)`
  4. Replace the `#results` section chart area:
     - Remove old `chartData` computation and `<BarChart>` JSX
     - Add `<StackedComparison>` with `currentCosts={tceResult.currentCosts}` and `electrifiedCosts={partialResult.currentCosts}` (the partialResult's CURRENT costs = the scenario with selected switches applied)
     - Add toggle switches next to the chart showing each roadmap item with on/off state
  5. Update imports (remove unused Recharts BarChart imports from the chart section, add new components)

  **Toggle rendering** (next to or below the stacked chart):
  ```tsx
  <div className="space-y-2">
    {tceResult.roadmap.map(item => {
      const key = mapApplianceToToggle(item.appliance)
      if (!key) return null
      return (
        <label key={item.appliance} className="flex items-center justify-between gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50">
          <div>
            <p className="text-sm font-medium">{item.appliance}</p>
            <p className="text-xs text-muted-foreground">est. {formatCurrency(item.upfrontCost)}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-primary">Save {formatCurrency(item.annualSaving)}/yr</span>
            <Checkbox checked={toggles[key]} onCheckedChange={(checked) => setToggles(prev => ({...prev, [key]: !!checked}))} />
          </div>
        </label>
      )
    })}
  </div>
  ```

  **CRITICAL**: The `partialInput` needs careful construction. When a toggle is ON, we DON'T change the `householdInput` (that stays as the user entered it). Instead, we build the electrified scenario by selectively overriding fields:
  ```typescript
  const electrifiedInput = useMemo((): HouseholdInput => {
    return {
      ...householdInput,
      heating: toggles.heating ? 'heat-pump' : householdInput.heating,
      waterHeating: toggles.waterHeating ? 'heat-pump' : householdInput.waterHeating,
      cooktop: toggles.cooktop ? 'induction' : householdInput.cooktop,
      vehicles: toggles.vehicles
        ? householdInput.vehicles.map(v => ({ ...v, type: 'electric' as const }))
        : householdInput.vehicles,
      includeSolar: toggles.solar,
    }
  }, [householdInput, toggles])

  const electrifiedResult = useMemo(() => calculateTCE(electrifiedInput), [electrifiedInput])
  ```
  Then the chart uses `tceResult.currentCosts` (unchanged user input) vs `electrifiedResult.currentCosts` (with toggles applied).

  Wait — actually this is simpler. We already have `tceResult.currentCosts` (the user's real costs). We need the "electrified" costs for the right bar. The `electrifiedResult.currentCosts` after applying the toggle overrides IS the right bar — it's "what would this household's costs be if they made these specific switches?"

  Actually, cleaner: just call `calculateTCE` on the `electrifiedInput` and read `.currentCosts` from it — because the "current costs" of an already-electrified input IS the electrified scenario.

- **VALIDATE**: `npx tsc --noEmit && npm run build`

### Task 6: Remove old chart code

- **ACTION**: Clean up unused BarChart imports and chartData computation from page.tsx
- **IMPLEMENT**: Remove:
  - `import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'` (if no longer used — check if SpendingDonut or other components still need Recharts)
  - The `chartData` const
  - The `<BarChart>` JSX block
- **GOTCHA**: The `BarChart` import may still be needed if other chart components on the page use it. Check before removing.
- **VALIDATE**: `npx tsc --noEmit`

### Task 7: FINAL build validation

- **VALIDATE**: `npx tsc --noEmit && npm run build`
- Visual checks:
  - Rego input: type "ABC123" → "2019 TOYOTA COROLLA (Petrol)" appears
  - Mileage radio works
  - EIQ button shows placeholder
  - Stacked bars match mockup (Petrol dark/Gas yellow/Electricity orange)
  - Toggles update right bar live
  - Demo presets still work

---

## Acceptance Criteria

- [ ] Rego input with demo lookup (7 vehicles) + "not found" with suggestions
- [ ] Mileage radio: Low / Medium / High / Very High
- [ ] EIQ placeholder button
- [ ] Compact home energy selects (region, heating, water, cooktop, occupants)
- [ ] Two stacked bars matching mockup colours and layout
- [ ] Both bars same visual height; savings gap as dashed section
- [ ] Electrification toggle switches update right bar in real-time
- [ ] Labels inside bar segments (Petrol $X/yr, Gas $X/yr, Electricity $X/yr)
- [ ] `npx tsc --noEmit` and `npm run build` pass

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Custom stacked bar hard to get pixel-perfect | Medium | Medium | Use simple CSS divs with percentage heights — much simpler than Recharts for this layout |
| Partial electrification math wrong | Low | High | Test: toggle all ON = same as full electrification. Toggle all OFF = same as current. Each individual toggle should only change its category. |
| Text too small inside narrow bar segments | Medium | Low | Hide labels for segments < 10% height; show as tooltip instead |
