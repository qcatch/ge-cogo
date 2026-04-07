# Feature: Bill Tracker Dashboard

## Summary

Add a CashNav-style bill tracker section to the results view that shows a simulated 12-month energy spend history as a stacked area chart (electricity + gas + petrol), monthly totals, and trend indicators. Uses Recharts (already proven in Phase 3). The simulated history is generated from the user's TCE inputs with realistic seasonal variation (higher in winter, lower in summer — NZ Southern Hemisphere pattern).

## User Story

As a household member viewing my TCE results
I want to see my energy spend history over time in one place
So that I can understand the seasonal pattern and feel like this tool tracks my real energy costs

## Metadata

| Field | Value |
|-------|-------|
| Type | NEW_CAPABILITY |
| Complexity | MEDIUM |
| Systems Affected | lib/energy-model/, components/dashboard/ |
| Dependencies | recharts@2.15.4 (already installed) |
| Estimated Tasks | 4 |

---

## Mandatory Reading

| Priority | File | Why |
|----------|------|-----|
| P0 | `components/dashboard/cost-chart.tsx` | Existing Recharts pattern to mirror |
| P0 | `lib/energy-model/types.ts` | EnergyBreakdown type for monthly data |
| P1 | `components/dashboard/tce-results.tsx` | Where to integrate the bill tracker |
| P1 | `lib/format.ts` | Formatting utilities |

---

## Files to Change

| File | Action | Justification |
|------|--------|---------------|
| `lib/energy-model/bill-history.ts` | CREATE | Generate simulated 12-month history with seasonal variation |
| `components/dashboard/bill-tracker.tsx` | CREATE | Stacked area chart + monthly breakdown |
| `components/dashboard/tce-results.tsx` | UPDATE | Add Bill Tracker section between chart and emissions |

---

## Step-by-Step Tasks

### Task 1: CREATE `lib/energy-model/bill-history.ts`

- **ACTION**: Generate simulated 12-month energy spend history
- **IMPLEMENT**:
  - `generateBillHistory(currentCosts: EnergyBreakdown): MonthlyBill[]`
  - `MonthlyBill`: `{ month: string, electricity: number, gas: number, transport: number, total: number }`
  - Generate 12 months backwards from current month (April 2026 → May 2025)
  - Apply seasonal multipliers for NZ Southern Hemisphere:
    - Winter (Jun-Aug): electricity 1.3x, gas 1.5x (heating demand)
    - Spring/Autumn (Mar-May, Sep-Nov): 1.0x base
    - Summer (Dec-Feb): electricity 0.85x, gas 0.6x
  - Transport stays relatively flat (slight holiday bump in Dec-Jan)
  - Add ±5% random jitter for realism
  - Monthly values derived from `currentCosts` annual values / 12, then scaled
- **VALIDATE**: `npx tsc --noEmit`

### Task 2: CREATE `components/dashboard/bill-tracker.tsx`

- **ACTION**: Stacked area chart + summary
- **IMPLEMENT**:
  - Props: `history: MonthlyBill[]`
  - Recharts `<AreaChart>` with stacked areas for electricity, gas, transport
  - Use `--chart-1` (orange/electricity), `--chart-2` (violet/gas), `--chart-5` (teal/transport) colours
  - `<ResponsiveContainer>` with `width="100%"` `height={220}`
  - X-axis: month abbreviations (May, Jun, Jul...)
  - Y-axis: dollar amounts
  - Tooltip showing breakdown per month
  - Below the chart: current month summary card with trend vs last month (up/down arrow + percentage)
- **MIRROR**: `components/dashboard/cost-chart.tsx` — Recharts pattern, CSS variable colours
- **VALIDATE**: `npx tsc --noEmit`

### Task 3: UPDATE `components/dashboard/tce-results.tsx`

- **ACTION**: Add bill tracker section to results view
- **IMPLEMENT**:
  - Import `BillTracker` and `generateBillHistory`
  - Generate history from `result.currentCosts`: `const history = generateBillHistory(result.currentCosts)`
  - Add `<BillTracker history={history} />` section between the per-vector breakdown tiles and the emissions card
  - Wrap in a Card with title "Your energy spend over 12 months"
- **VALIDATE**: `npx tsc --noEmit && npm run build`

### Task 4: Build + verify

- **VALIDATE**: `npm run build` succeeds, dev server renders bill tracker with demo profiles

---

## Validation Commands

```bash
npx tsc --noEmit
npm run build
```

---

## Acceptance Criteria

- [ ] Stacked area chart shows 12 months of simulated energy spend
- [ ] Three stacked areas: electricity, gas, transport with distinct colours
- [ ] Winter months (Jun-Aug) show higher costs — seasonal pattern visible
- [ ] Tooltip shows monthly breakdown
- [ ] Trend indicator shows current month vs previous month
- [ ] Chart renders correctly with all 3 demo profiles
- [ ] `npx tsc --noEmit` and `npm run build` pass

---

## Notes

- This is simulated data — not real bill history. Clearly this is a prototype feature demonstrating what bill tracking could look like with real data integration.
- The seasonal pattern adds credibility: NZ winter (June-August) is when heating costs spike, making the chart look realistic.
- The ±5% jitter prevents the chart from looking artificially smooth.
- Transport is kept relatively flat since driving patterns don't vary as much seasonally (except a slight holiday bump).
