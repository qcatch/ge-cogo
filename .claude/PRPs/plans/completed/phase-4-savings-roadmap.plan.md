# Feature: Savings Roadmap

## Summary

Add a savings roadmap section to the TCE results view that displays the ordered list of electrification switches from `TCEResult.roadmap`, showing each switch's title, upfront cost, annual saving, and payback period. Includes a cumulative savings visualisation. The disabled "See savings roadmap" button becomes a scroll-to-section anchor.

## User Story

As a household member who just saw their TCE results
I want to see a clear, prioritised list of what to switch and in what order
So that I can plan my electrification journey with confidence

## Metadata

| Field | Value |
|-------|-------|
| Type | NEW_CAPABILITY |
| Complexity | LOW |
| Systems Affected | components/dashboard/ |
| Dependencies | None (consumes existing TCEResult.roadmap) |
| Estimated Tasks | 3 |

---

## Mandatory Reading

| Priority | File | Lines | Why |
|----------|------|-------|-----|
| P0 | `lib/energy-model/types.ts` | 64-80 | SwitchRecommendation type |
| P0 | `components/dashboard/tce-results.tsx` | all | Where roadmap integrates |
| P1 | `lib/format.ts` | all | Formatting utilities |

---

## Files to Change

| File | Action | Justification |
|------|--------|---------------|
| `components/dashboard/savings-roadmap.tsx` | CREATE | Roadmap display component |
| `components/dashboard/tce-results.tsx` | UPDATE | Add roadmap section, enable button |

---

## Step-by-Step Tasks

### Task 1: CREATE `components/dashboard/savings-roadmap.tsx`

- **ACTION**: Create the savings roadmap component
- **IMPLEMENT**:
  - Props: `roadmap: SwitchRecommendation[]`, `totalUpfrontCost: number`
  - Numbered list of switches, each showing:
    - Priority number badge (1, 2, 3...)
    - Title + description
    - Upfront cost (or "Running cost only" for vehicles where cost=0)
    - Annual saving
    - Payback period (or "Immediate" for vehicles)
  - Cumulative savings row at the bottom
  - Skip items with payback > 50 years (not worth recommending)
  - Use Card component, consistent with existing patterns
  - Category icons: heating=Flame, water-heating=Droplets, cooktop=CookingPot, vehicle=Car, solar=Sun (from lucide-react)
- **VALIDATE**: `npx tsc --noEmit`

### Task 2: UPDATE `components/dashboard/tce-results.tsx`

- **ACTION**: Integrate roadmap into results view, enable the button
- **IMPLEMENT**:
  - Import and render `<SavingsRoadmap>` between the emissions card and action buttons
  - Change the "See savings roadmap" button from `disabled` to a scroll anchor (`onClick` scrolls to roadmap section via `id` and `scrollIntoView`)
  - Add `id="savings-roadmap"` to the roadmap section for scroll targeting
- **VALIDATE**: `npx tsc --noEmit`

### Task 3: Build + verify

- **ACTION**: `npm run build` + dev server check
- **VALIDATE**: Build succeeds, roadmap renders with demo profile data

---

## Validation Commands

```bash
npx tsc --noEmit
npm run build
```

---

## Acceptance Criteria

- [ ] Roadmap displays ordered switches with correct data
- [ ] Items with payback > 50 years are excluded or marked as "not recommended"
- [ ] Vehicle switches show "Running cost savings" instead of payback
- [ ] Cumulative annual savings shown
- [ ] "See savings roadmap" button scrolls to the section
- [ ] `npx tsc --noEmit` and `npm run build` pass
