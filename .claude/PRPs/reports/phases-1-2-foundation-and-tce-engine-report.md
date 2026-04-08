# Implementation Report

**Plan**: `.claude/PRPs/plans/phases-1-2-foundation-and-tce-engine.plan.md`
**Branch**: `feature/household-cost-dashboard`
**Date**: 2026-04-08
**Status**: COMPLETE

---

## Summary

Implemented Phases 1 & 2 of the Genesis Cost of Living Assistant POC:

1. **Foundation & Navigation** — Restructured the single-page household dashboard into a multi-section scrollable experience with: a landing page hero ("Do you know what energy is actually costing you?"), a TCE calculator section with demo profile selector, a results section showing current vs electrified comparison with charts and roadmap, a savings playbook placeholder, and the existing household dashboard below.

2. **TCE Calculation Engine** — Built the complete `lib/energy-model/` library (7 files) implementing the Rewiring Aotearoa-based calculation methodology. All NZ energy constants, consumption formulas, cost calculations, switching roadmap generator, emissions comparison, and 3 demo profiles.

---

## Assessment vs Reality

| Metric     | Predicted | Actual | Reasoning |
|------------|-----------|--------|-----------|
| Complexity | HIGH      | HIGH   | 12 tasks, 7 new files + 3 updates. Calculation logic required careful fuel-type attribution. |
| Confidence | 8/10      | 8/10   | Spec was complete. Main deviation was demo profile numbers being lower than spec thresholds for Auckland (gas is cheap in Auckland's mild climate). |

**Deviations from plan:**

- Auckland Family TCE is $7,479/year vs spec target of >$10,000. This is because gas heating in Auckland (regional multiplier 0.63) is genuinely cheap. The honest number is more credible.
- Added logic to filter roadmap items with negative annual savings (gas cooking is cheaper than induction in some regions due to low gas rate per kWh).
- Capped payback period display at "20+ years" in the UI for items with very long paybacks.
- Used `vehicleRuc` field instead of `vehicleRunningCosts` in the EnergyBreakdown type for clearer semantics.
- Unused `calculateEmissions` helper function in index.ts — emissions calculation was inlined for simpler code.

---

## Tasks Completed

| # | Task | File | Status |
|---|------|------|--------|
| 1 | CREATE types | `lib/energy-model/types.ts` | done |
| 2 | CREATE constants | `lib/energy-model/constants.ts` | done |
| 3 | CREATE consumption | `lib/energy-model/consumption.ts` | done |
| 4 | CREATE costs | `lib/energy-model/costs.ts` | done |
| 5 | CREATE roadmap | `lib/energy-model/roadmap.ts` | done |
| 6 | CREATE index | `lib/energy-model/index.ts` | done |
| 7 | CREATE demo-profiles | `lib/energy-model/demo-profiles.ts` | done |
| 8 | UPDATE layout metadata | `app/layout.tsx` | done |
| 9 | UPDATE header nav | `components/layout/header.tsx` | done |
| 10 | UPDATE page with sections | `app/page.tsx` | done |
| 11 | VERIFY demo calculations | (tsx script) | done |
| 12 | FINAL validation | build + dev | done |

---

## Validation Results

| Check | Result | Details |
|-------|--------|---------|
| Type check | pass | `npx tsc --noEmit` — 0 errors |
| Build | pass | `npm run build` — compiled successfully |
| Dev server | pass | Running on localhost:3000, returning 200 |
| Demo profiles | pass | All 3 profiles produce credible numbers with positive savings |

---

## Demo Profile Results

| Profile | Current | Electrified | Savings | Roadmap Items |
|---------|---------|-------------|---------|---------------|
| Auckland Family | $7,479/yr | $4,488/yr | $2,992/yr (40%) | 5 |
| Wellington Couple | $4,558/yr | $2,612/yr | $1,947/yr (43%) | 5 |
| Christchurch Homeowner | $7,443/yr | $4,881/yr | $2,561/yr (34%) | 4 |

---

## Files Changed

| File | Action | Lines |
|------|--------|-------|
| `lib/energy-model/types.ts` | CREATE | +93 |
| `lib/energy-model/constants.ts` | CREATE | +142 |
| `lib/energy-model/consumption.ts` | CREATE | +100 |
| `lib/energy-model/costs.ts` | CREATE | +135 |
| `lib/energy-model/roadmap.ts` | CREATE | +166 |
| `lib/energy-model/demo-profiles.ts` | CREATE | +72 |
| `lib/energy-model/index.ts` | CREATE | +140 |
| `app/layout.tsx` | UPDATE | ~4 lines |
| `app/page.tsx` | UPDATE | rewrite (~260 lines) |
| `components/layout/header.tsx` | UPDATE | ~6 lines |

---

## Issues Encountered

1. **Gas vs electricity per-kWh pricing**: Gas at $0.118/kWh is much cheaper per kWh than electricity at $0.38-0.40/kWh. For low-consumption items (cooktops), gas can be cheaper even accounting for lower efficiency. Resolved by filtering negative-savings items from the roadmap.

2. **Auckland heating costs lower than expected**: Auckland's heating multiplier (0.63) means gas heating is relatively cheap there. The $10,000 threshold from the spec was aspirational. The honest number ($7,479) is still compelling for a demo.

3. **Node.js require() vs ESM**: TypeScript files in `lib/energy-model/` can't be run with `node -e` directly. Used `npx tsx` for verification.

---

## Next Steps

- [ ] Create PR or commit changes
- [ ] Continue with Phase 3 (TCE Calculator UI — multi-step form)
- [ ] Phases 5, 6, 7 can run in parallel after Phase 4
