# Feature: TCE Calculator UI (Phase 3)

## Summary

Replace the demo profile selector in `app/page.tsx`'s `#calculator` section with a real input form using react-hook-form + zod. The form captures region, household size, heating type, water heating type, cooktop type, and vehicle(s) — then feeds a `HouseholdInput` object directly into `calculateTCE()`. Because the results section already renders unconditionally and `calculateTCE` is pure/synchronous, form changes update the results view instantly via `useMemo`. Demo profiles are retained as quick-fill presets.

## User Story

As a NZ homeowner curious about my energy costs,
I want to enter my household's actual energy setup (heating, hot water, cooktop, vehicles, region),
So that I see my real total cost of energy and electrified comparison — not a generic demo.

## Problem Statement

The `#calculator` section currently shows a dropdown of 3 demo profiles. Users cannot enter their own household details. The form needs to capture all fields of `HouseholdInput` (region, occupants, heating, waterHeating, cooktop, vehicles[], includeSolar) with sensible defaults and immediate feedback.

## Solution Statement

Create a `components/calculator/tce-form.tsx` component using `react-hook-form` with `zodResolver`. The form is a single scrollable card with grouped inputs — not a multi-step wizard (simpler for POC, fewer components). `watch()` feeds live values into `calculateTCE()` via useMemo in the parent page. Demo profiles become "quick-fill" buttons that call `reset()` with preset values. Vehicle rows use `useFieldArray` for add/remove.

## Metadata

| Field            | Value |
| ---------------- | ----- |
| Type             | NEW_CAPABILITY |
| Complexity       | MEDIUM |
| Systems Affected | app/page.tsx, new components/calculator/ |
| Dependencies     | react-hook-form@^7.60.0, zod@3.25.76, @hookform/resolvers@^3.10.0 (all installed) |
| Estimated Tasks  | 6 |

---

## UX Design

### Before State

```
#calculator section:
┌──────────────────────────────────────────┐
│  "Your Household Energy Profile"         │
│                                          │
│  [ Select a demo household ▼ ]           │
│     Auckland Family                      │
│     Wellington Couple                    │
│     Christchurch Homeowner               │
│                                          │
│  ┌────────────────────────┐              │
│  │ Auckland Family         │              │
│  │ gas heating, 2 cars     │              │
│  │ [region] [4 ppl] [gas]  │              │
│  └────────────────────────┘              │
│                                          │
│  [ See your total cost of energy ↓ ]     │
└──────────────────────────────────────────┘

DATA_FLOW: tceProfileKey (string) → TCE_DEMO_PROFILES[key].input → calculateTCE()
PAIN_POINT: Users can only pick from 3 presets. No personalisation.
```

### After State

```
#calculator section:
┌──────────────────────────────────────────┐
│  "Your Household Energy Profile"         │
│                                          │
│  Quick-fill: [Auckland Family]           │
│    [Wellington Couple] [Chch Homeowner]  │
│                                          │
│  ┌── Your Details ───────────────────┐   │
│  │ Region:    [ Auckland        ▼ ]  │   │
│  │ People:    (1) (2) (3) (●4) (5+) │   │
│  │                                   │   │
│  │ Heating:       (●Gas) (HP) ...    │   │
│  │ Hot Water:     (●Gas) (HP) ...    │   │
│  │ Cooktop:       (●Gas) (Ind) ...   │   │
│  │ Include Solar: [ ] Yes            │   │
│  │                                   │   │
│  │ Vehicles:                         │   │
│  │  Car 1: [Petrol ▼] [Medium ▼]    │   │
│  │  Car 2: [Petrol ▼] [Low    ▼]    │   │
│  │  [+ Add vehicle] [- Remove]       │   │
│  └───────────────────────────────────┘   │
│                                          │
│  ┌── Live Preview ───────────────────┐   │
│  │ Current: $7,479/yr                │   │
│  │ Electrified: $4,488/yr            │   │
│  │ You could save $2,992/yr (40%)    │   │
│  └───────────────────────────────────┘   │
│                                          │
│  [ See full breakdown ↓ ]                │
└──────────────────────────────────────────┘

DATA_FLOW: form watch() → HouseholdInput → calculateTCE() → live preview + results
VALUE_ADD: Personalised numbers. Immediate feedback on every field change.
```

### Interaction Changes

| Location | Before | After | User Impact |
|----------|--------|-------|-------------|
| `#calculator` section | Demo profile dropdown | Full form with presets | Can enter their own household details |
| Results section | Static for selected demo | Updates live as form changes | Instant feedback — no "submit" needed |
| Page state | `tceProfileKey: string` | `householdInput: HouseholdInput` (from form watch) | Personalised TCE calculation |

---

## Mandatory Reading

| Priority | File | Lines | Why Read This |
|----------|------|-------|---------------|
| P0 | `app/page.tsx` | 1-70, 107-153 | State + calculator section to REPLACE |
| P0 | `lib/energy-model/types.ts` | all | `HouseholdInput` contract — defines the form schema |
| P0 | `lib/energy-model/constants.ts` | 17-138 | All valid values for dropdowns/radios + defaults |
| P0 | `lib/energy-model/demo-profiles.ts` | all | Preset values for quick-fill buttons |
| P1 | `components/ui/select.tsx` | all | Select primitive to USE |
| P1 | `components/ui/radio-group.tsx` | all | RadioGroup primitive to USE |
| P1 | `components/ui/label.tsx` | all | Label primitive to USE |
| P1 | `components/dashboard/profile-switcher.tsx` | all | Select usage pattern to MIRROR |
| P2 | `lib/energy-model/index.ts` | 47 | `calculateTCE` is the function we call |

**External Documentation:**

| Source | Section | Why Needed |
|--------|---------|------------|
| [RHF useForm](https://react-hook-form.com/docs/useform) | defaultValues, mode, watch | Form initialisation and live preview |
| [RHF useFieldArray](https://react-hook-form.com/docs/usefieldarray) | append, remove, fields | Vehicle rows add/remove |
| [RHF zodResolver](https://github.com/react-hook-form/resolvers#zod) | zodResolver setup | Schema validation |

---

## Patterns to Mirror

**COMPONENT_STRUCTURE:**
```typescript
// SOURCE: components/dashboard/profile-switcher.tsx:1-4
// COPY THIS PATTERN: 'use client', named export, inline interface
'use client'

interface TCEFormProps {
  onInputChange: (input: HouseholdInput) => void
  defaultInput: HouseholdInput
}

export function TCEForm({ onInputChange, defaultInput }: TCEFormProps) {
```

**SELECT_USAGE:**
```typescript
// SOURCE: app/page.tsx:116-125
// COPY THIS PATTERN: Controlled Select with onValueChange
<Select value={tceProfileKey} onValueChange={setTceProfileKey}>
  <SelectTrigger>
    <SelectValue placeholder="Select a household" />
  </SelectTrigger>
  <SelectContent>
    {Object.entries(TCE_DEMO_PROFILES).map(([key, profile]) => (
      <SelectItem key={key} value={key}>{profile.label}</SelectItem>
    ))}
  </SelectContent>
</Select>
```

**CARD_LAYOUT:**
```typescript
// SOURCE: app/page.tsx:128-138
// COPY THIS PATTERN: Card with py-4 px-5 content, badges for tags
<Card className="max-w-md mx-auto">
  <CardContent className="py-4 px-5">
    ...
  </CardContent>
</Card>
```

---

## Files to Change

| File | Action | Justification |
|------|--------|---------------|
| `lib/energy-model/schemas.ts` | CREATE | Zod schema for `HouseholdInput` form validation |
| `components/calculator/tce-form.tsx` | CREATE | The calculator form component |
| `app/page.tsx` | UPDATE | Replace demo-profile state with form-driven HouseholdInput state |

---

## NOT Building (Scope Limits)

- **No multi-step wizard** — a single scrollable form card is simpler for POC and avoids step-management complexity. Progressive disclosure comes from live preview, not step progression.
- **No slider components** — no `slider.tsx` exists. Use Select dropdowns and RadioGroup buttons for all inputs. Good enough for POC.
- **No custom number input** — occupants uses a button group (1-5), not a stepper or free-text input.
- **No address/postcode lookup** — region is a simple Select of 8 NZ regions.
- **No form persistence** — form state resets on page reload. No localStorage or URL params.

---

## Step-by-Step Tasks

### Task 1: CREATE `lib/energy-model/schemas.ts`

- **ACTION**: Define Zod validation schema matching `HouseholdInput`
- **IMPLEMENT**:
  ```typescript
  import { z } from 'zod'

  const energyRegions = ['northland', 'auckland', 'waikato', 'bay-of-plenty', 'wellington', 'canterbury', 'otago', 'southland'] as const

  const vehicleInputSchema = z.object({
    type: z.enum(['petrol', 'diesel', 'electric', 'phev', 'hybrid', 'none']),
    usage: z.enum(['low', 'medium', 'high']),
  })

  export const householdInputSchema = z.object({
    region: z.enum(energyRegions),
    occupants: z.number().min(1).max(6),
    heating: z.enum(['gas', 'lpg', 'wood', 'electric-resistive', 'heat-pump']),
    waterHeating: z.enum(['gas', 'lpg', 'electric-resistive', 'heat-pump', 'solar']),
    cooktop: z.enum(['gas', 'lpg', 'electric-resistive', 'induction']),
    vehicles: z.array(vehicleInputSchema),
    includeSolar: z.boolean().optional(),
  })

  export type HouseholdInputForm = z.infer<typeof householdInputSchema>
  ```
- **MIRROR**: String literal union types from `lib/energy-model/types.ts` — the Zod `z.enum()` values must match exactly.
- **GOTCHA**: Import from `'zod'` not `'zod/v4'` — this codebase is on zod@3.25.76 where bare import = v3.
- **VALIDATE**: `npx tsc --noEmit`

### Task 2: CREATE `components/calculator/tce-form.tsx`

- **ACTION**: Build the complete calculator form component
- **IMPLEMENT**: A `'use client'` component that:
  1. Uses `useForm<HouseholdInputForm>` with `zodResolver(householdInputSchema)` and `mode: 'onChange'`
  2. Initialises `defaultValues` from the Auckland Family demo profile
  3. Uses `useFieldArray` for the `vehicles` array
  4. Calls `onInputChange(watch())` via a `useEffect` watching all form values — this propagates every change to the parent for live `calculateTCE()` preview
  5. Has a "Quick-fill" preset row with 3 buttons that call `reset(TCE_DEMO_PROFILES[key].input)`

  **Form layout** (single card, grouped sections):
  - **Region**: `<Select>` with 8 NZ regions. Display names: Northland, Auckland, Waikato, Bay of Plenty, Wellington, Canterbury, Otago, Southland.
  - **Household size**: Button group (1, 2, 3, 4, 5+) — visually like segmented control using `Button` variant `outline` with `bg-primary text-primary-foreground` for selected.
  - **Heating type**: `<RadioGroup>` — Gas, LPG, Wood burner, Electric (resistive), Heat pump
  - **Hot water type**: `<RadioGroup>` — Gas, LPG, Electric (resistive), Heat pump, Solar
  - **Cooktop type**: `<RadioGroup>` — Gas, LPG, Electric (resistive), Induction
  - **Include solar**: `<Checkbox>` — "Include rooftop solar in electrified scenario"
  - **Vehicles**: Each row has a vehicle type `<Select>` and usage `<Select>`. Buttons to add/remove rows. Default: 1 petrol vehicle, medium usage.

  **Form → parent communication**:
  ```typescript
  const formValues = watch()
  useEffect(() => {
    onInputChange(formValues as HouseholdInput)
  }, [formValues, onInputChange])
  ```

- **IMPORTS**:
  ```typescript
  import { useForm, useFieldArray, Controller } from 'react-hook-form'
  import { zodResolver } from '@hookform/resolvers/zod'
  import { householdInputSchema, type HouseholdInputForm } from '@/lib/energy-model/schemas'
  import { TCE_DEMO_PROFILES } from '@/lib/energy-model'
  import type { HouseholdInput } from '@/lib/energy-model'
  ```

- **UI PRIMITIVES TO USE**:
  - `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem` from `@/components/ui/select`
  - `RadioGroup`, `RadioGroupItem` from `@/components/ui/radio-group`
  - `Label` from `@/components/ui/label`
  - `Button` from `@/components/ui/button`
  - `Card`, `CardContent` from `@/components/ui/card`
  - `Checkbox` from `@/components/ui/checkbox`
  - `Badge` from `@/components/ui/badge`

- **CONTROLLED FIELDS**: react-hook-form's `register` doesn't work with Radix UI Select/RadioGroup. Use `Controller` from RHF to wrap each Radix primitive:
  ```typescript
  <Controller
    control={control}
    name="region"
    render={({ field }) => (
      <Select value={field.value} onValueChange={field.onChange}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          {REGION_OPTIONS.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
        </SelectContent>
      </Select>
    )}
  />
  ```

- **LABEL/OPTION DATA**: Define option arrays at the top of the file:
  ```typescript
  const REGION_OPTIONS = [
    { value: 'northland', label: 'Northland' },
    { value: 'auckland', label: 'Auckland' },
    { value: 'waikato', label: 'Waikato' },
    { value: 'bay-of-plenty', label: 'Bay of Plenty' },
    { value: 'wellington', label: 'Wellington' },
    { value: 'canterbury', label: 'Canterbury' },
    { value: 'otago', label: 'Otago' },
    { value: 'southland', label: 'Southland' },
  ]

  const HEATING_OPTIONS = [
    { value: 'heat-pump', label: 'Heat pump' },
    { value: 'gas', label: 'Gas' },
    { value: 'lpg', label: 'LPG' },
    { value: 'electric-resistive', label: 'Electric (resistive)' },
    { value: 'wood', label: 'Wood burner' },
  ]

  const WATER_HEATING_OPTIONS = [
    { value: 'electric-resistive', label: 'Electric (resistive)' },
    { value: 'gas', label: 'Gas' },
    { value: 'lpg', label: 'LPG' },
    { value: 'heat-pump', label: 'Heat pump' },
    { value: 'solar', label: 'Solar' },
  ]

  const COOKTOP_OPTIONS = [
    { value: 'gas', label: 'Gas' },
    { value: 'electric-resistive', label: 'Electric (resistive)' },
    { value: 'induction', label: 'Induction' },
    { value: 'lpg', label: 'LPG' },
  ]

  const VEHICLE_TYPE_OPTIONS = [
    { value: 'petrol', label: 'Petrol' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'phev', label: 'Plug-in Hybrid' },
    { value: 'electric', label: 'Electric' },
    { value: 'none', label: 'No vehicle' },
  ]

  const VEHICLE_USAGE_OPTIONS = [
    { value: 'low', label: 'Low (~50km/wk)' },
    { value: 'medium', label: 'Medium (~210km/wk)' },
    { value: 'high', label: 'High (~400km/wk)' },
  ]

  const OCCUPANT_OPTIONS = [1, 2, 3, 4, 5]
  ```

- **DEFAULT VALUES**: Use Auckland Family demo profile:
  ```typescript
  const DEFAULT_INPUT: HouseholdInputForm = {
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
  }
  ```

- **GOTCHA**: `useFieldArray` requires `fields`, `append`, `remove` destructured. Vehicle rows must have unique `id` — RHF provides this automatically via `fields[i].id`.
- **GOTCHA**: `watch()` returns the entire form state. Wrap the `useEffect` with a `JSON.stringify` comparison or use RHF's `useWatch` to avoid infinite loops. Safest: use `useWatch({ control })` which is designed for this.
- **GOTCHA**: Occupants button group needs `setValue('occupants', n)` on click since it's not a native input. Use `Controller` or manual `setValue`.
- **VALIDATE**: `npx tsc --noEmit && npm run build`

### Task 3: UPDATE `app/page.tsx` — Replace State and Calculator Section

- **ACTION**: Replace demo-profile-driven state with form-driven `HouseholdInput` state
- **IMPLEMENT**:
  1. Remove `tceProfileKey` state and `activeProfile` derived value
  2. Add `householdInput` state initialised from Auckland Family default:
     ```typescript
     const [householdInput, setHouseholdInput] = useState<HouseholdInput>(
       TCE_DEMO_PROFILES['auckland-family'].input
     )
     ```
  3. Update `useMemo` to compute directly from `householdInput`:
     ```typescript
     const tceResult: TCEResult = useMemo(() => {
       return calculateTCE(householdInput)
     }, [householdInput])
     ```
  4. Replace the `#calculator` section's inner content with `<TCEForm>`:
     ```typescript
     <TCEForm onInputChange={setHouseholdInput} defaultInput={householdInput} />
     ```
  5. Add a **live preview card** below the form showing current total, electrified total, and savings — a compact summary that updates instantly.
  6. Remove unused imports: `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue` (now in TCEForm).
  7. Keep the `#results` section entirely unchanged — it already consumes `tceResult`.

- **LIVE PREVIEW** (inside the `#calculator` section, below the form):
  ```tsx
  <Card className="max-w-2xl mx-auto bg-accent/10 border-primary/20">
    <CardContent className="py-4 px-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Current</p>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(Math.round(tceResult.currentCosts.total))}</p>
          <p className="text-xs text-muted-foreground">per year</p>
        </div>
        <ArrowRight className="h-5 w-5 text-primary hidden sm:block" />
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Electrified</p>
          <p className="text-2xl font-bold text-primary">{formatCurrency(Math.round(tceResult.electrifiedCosts.total))}</p>
          <p className="text-xs text-muted-foreground">per year</p>
        </div>
        <Badge variant="secondary" className="text-sm px-3 py-1">
          Save {formatCurrency(tceResult.annualSavings)}/yr
        </Badge>
      </div>
    </CardContent>
  </Card>
  ```

- **REMOVE**: The demo profile card (lines 128-138) and the profile-specific Badge tags — the form now IS the input, the card is redundant.
- **KEEP**: The "See full breakdown" button scrolling to `#results`.
- **GOTCHA**: `householdInput` is an object — React's `useState` setter with an object means `useMemo` dependency is by reference. Since `setHouseholdInput` receives a new object from `watch()` on every form change, the memo will recalculate correctly. No special comparison needed.
- **VALIDATE**: `npx tsc --noEmit && npm run build`

### Task 4: UPDATE `lib/energy-model/index.ts` — Re-export schema

- **ACTION**: Add schema re-export to the barrel file
- **IMPLEMENT**: Add to index.ts:
  ```typescript
  export { householdInputSchema } from './schemas'
  export type { HouseholdInputForm } from './schemas'
  ```
- **VALIDATE**: `npx tsc --noEmit`

### Task 5: VERIFY form-to-calculation flow

- **ACTION**: Start dev server and verify the full form → calculateTCE → results flow
- **IMPLEMENT**:
  1. `npm run dev`
  2. Navigate to `#calculator` section
  3. Verify: changing region updates the results numbers
  4. Verify: changing heating type updates the results numbers
  5. Verify: adding/removing vehicles updates the results
  6. Verify: clicking a quick-fill preset fills the form and updates results
  7. Verify: live preview card shows correct summary
  8. Verify: scrolling to `#results` shows the full comparison chart and roadmap
- **VALIDATE**: All interactions produce updated numbers in both preview and results

### Task 6: FINAL build validation

- **ACTION**: Full type-check and production build
- **IMPLEMENT**:
  1. `npx tsc --noEmit` — 0 errors
  2. `npm run build` — succeeds
  3. Quick visual check in dev mode
- **VALIDATE**: All pass

---

## Testing Strategy

### Verification Approach

No test framework in project. Validation via:
1. TypeScript compilation
2. Production build
3. Manual form interaction in dev mode

### Edge Cases Checklist

- [ ] Empty vehicles array (user removes all vehicles)
- [ ] Single occupant (multiplier 0.56 — lowest)
- [ ] 5+ occupants (multiplier 1.37 — highest)
- [ ] All-electric household (no gas costs, minimal savings to show)
- [ ] All-gas household (maximum gas costs, biggest savings)
- [ ] Solar checkbox toggle (should reduce electrified cost by ~$1,600)
- [ ] Quick-fill preset restores correct form state
- [ ] Switching between presets clears previous values correctly

---

## Validation Commands

### Level 1: STATIC_ANALYSIS
```bash
npx tsc --noEmit
```
**EXPECT**: Exit 0

### Level 2: BUILD
```bash
npm run build
```
**EXPECT**: Exit 0, compiled successfully

### Level 3: DEV_SERVER
```bash
npm run dev
```
**EXPECT**: All form interactions update results live

---

## Acceptance Criteria

- [ ] Calculator section shows a real form with all HouseholdInput fields
- [ ] Form has sensible defaults (Auckland Family preset)
- [ ] 3 quick-fill preset buttons reset the form to demo profile values
- [ ] Changing any form field immediately updates the live preview and results section
- [ ] Vehicle rows can be added and removed
- [ ] Region select shows all 8 NZ regions
- [ ] Heating/water/cooktop show correct option sets
- [ ] Occupants uses a 1-5 button group
- [ ] Include Solar checkbox toggles the solar offset in calculations
- [ ] `npx tsc --noEmit` and `npm run build` pass

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| `watch()` causes excessive re-renders | Medium | Low | `calculateTCE` is fast (<1ms). If needed, debounce with `useDeferredValue` or `useWatch` with specific fields. POC: acceptable to recalculate on every keystroke. |
| Controller + Radix Select doesn't sync | Low | Medium | This is a documented RHF pattern. Test each field individually during Task 2. |
| useFieldArray vehicle rows lose state on add/remove | Low | Medium | RHF handles this automatically via internal `id` tracking. Don't use array index as React key — use `field.id`. |
| Form default values don't match HouseholdInput type | Low | High | Zod schema and TypeScript types both derive from the same enum values. Type-check catches mismatches. |

---

## Notes

- **No multi-step wizard**: The PRD calls for "progressive disclosure — show first result after 3 inputs, refine with more." The live preview card achieves this without step UI — the user sees results updating as they fill in fields, starting from sensible defaults. Every field change is a progressive refinement.
- **`useWatch` vs `watch`**: `useWatch({ control })` is the RHF-recommended way to reactively observe form values in a child/sibling component. In the parent, `watch()` works fine since we're already in the form scope. For the live preview in `page.tsx`, the `onInputChange` callback propagating to `useState` is the cleanest pattern.
- **Demo profiles as presets**: Quick-fill buttons calling `reset(TCE_DEMO_PROFILES[key].input)` is the standard RHF pattern for form presets. This preserves the stakeholder demo flow while enabling real user input.
