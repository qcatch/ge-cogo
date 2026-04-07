# Feature: Household Cost Dashboard — Phase 5: Demo Profiles & Polish

## Summary

Add a profile switcher so stakeholders can see different NZ household types (single professional, couple, family, retirees), each telling a different but compelling cost story. Add NZ benchmark comparison badges to the hero stats, loading/transition states, responsive polish, and a Brand 4.0 visual audit. This is the phase that makes the prototype feel production-quality.

## User Story

As a Genesis stakeholder running the demo
I want to switch between different household profiles and see immediately how costs differ
So that I can understand the product works for diverse NZ households, not just one scenario

## Metadata

| Field            | Value                                             |
| ---------------- | ------------------------------------------------- |
| Type             | ENHANCEMENT                                       |
| Complexity       | MEDIUM                                            |
| Systems Affected | components/dashboard, lib/household-model          |
| Dependencies     | Select component (already installed as shadcn/ui)  |
| Estimated Tasks  | 6                                                 |

---

## Mandatory Reading

| Priority | File | Lines | Why Read This |
|----------|------|-------|---------------|
| P0 | `components/dashboard/index.tsx` | all | Dashboard — wire profile switcher state |
| P0 | `lib/household-model/demo-profiles.ts` | all | All 4 profiles — data source |
| P1 | `components/ui/select.tsx` | all | Select component for profile dropdown |
| P1 | `lib/household-context.ts` | 100-130 | `generateConversationStarters` — recalculates on profile change |

---

## Files to Change

| File | Action | Justification |
| ---- | ------ | ------------- |
| `components/dashboard/profile-switcher.tsx` | CREATE | Dropdown to select demo household profile |
| `components/dashboard/index.tsx` | UPDATE | Wire profile switcher, add setState for spending, smooth transitions |
| `app/globals.css` | UPDATE | Add transition animation for profile switch |

---

## NOT Building (Scope Limits)

- **Custom profile creation** — demo only uses pre-built profiles
- **Data persistence** — switching profiles replaces state, no saving
- **Animation library** — use CSS transitions only, no framer-motion

---

## Step-by-Step Tasks

### Task 1: CREATE `components/dashboard/profile-switcher.tsx`

- **ACTION**: Create a profile selection component
- **IMPLEMENT**:
  - `'use client'` directive
  - Props: `{ profiles: Record<string, HouseholdSpending>, activeKey: string, onSelect: (key: string) => void }`
  - Use shadcn `Select` component (already installed at `components/ui/select.tsx`)
  - Each option shows: profile name + short description + total monthly
  - Style: compact, fits in the hero section below the heading
  - Show a small avatar/emoji per profile type (single person, couple, family, retirees)
- **VALIDATE**: `npx tsc --noEmit`

### Task 2: UPDATE `components/dashboard/index.tsx` — Wire profile switching

- **ACTION**: Add profile state management and wire the switcher
- **IMPLEMENT**:
  1. Change spending state to have a setter:
     ```typescript
     const [profileKey, setProfileKey] = useState('christchurch-family')
     const spending = DEMO_PROFILES[profileKey]
     ```
  2. Import and render `ProfileSwitcher` in the hero section (between heading and hero stats)
  3. Pass `DEMO_PROFILES`, `profileKey`, and `setProfileKey` as props
  4. System prompt, conversation starters, charts, and category cards all derive from `spending` — they auto-update when profile changes
  5. Scroll to top on profile switch
- **GOTCHA**: The `ConversationPanel` should reset when profile changes — clear chat history. Currently it only resets on close (`handleOpenChange`). Add a `useEffect` that clears `chatContext` and closes the panel when `profileKey` changes.
- **VALIDATE**: `npx tsc --noEmit`

### Task 3: ADD hero stat benchmark annotations

- **ACTION**: Add small "vs NZ avg" text under each hero stat
- **IMPLEMENT**: In the 3 hero stat cards:
  - Monthly: show "NZ avg: $X,XXX/mo" using `NZ_AVERAGE_WEEKLY_TOTAL * 4.33`
  - Annual: show "NZ avg: $XX,XXX/yr" using `NZ_AVERAGE_WEEKLY_TOTAL * 52`
  - % of income: no benchmark (income varies too much)
- **IMPORT**: `NZ_AVERAGE_WEEKLY_TOTAL` from `@/lib/household-model`
- **VALIDATE**: `npx tsc --noEmit`

### Task 4: ADD smooth transitions on profile switch

- **ACTION**: Add a subtle fade transition when switching profiles
- **IMPLEMENT**:
  - Add CSS class `transition-opacity duration-300` to the main content container
  - On profile switch, briefly set opacity to 0.5 then back to 1 using a state flag
  - Simple approach: `const [transitioning, setTransitioning] = useState(false)` + `useEffect` with 300ms timeout
  - Add `opacity-50` class conditionally during transition
- **VALIDATE**: `npx tsc --noEmit`

### Task 5: RESPONSIVE POLISH

- **ACTION**: Fine-tune mobile responsiveness across all components
- **IMPLEMENT**:
  - Profile switcher: full-width on mobile (`w-full sm:w-auto`)
  - Hero stats: already `grid-cols-1 sm:grid-cols-3` — verify
  - Donut chart: check `h-80` renders well on small screens
  - Trend chart: check axis labels don't overflow
  - Category cards: already `grid-cols-1 sm:grid-cols-2` — verify
  - Receipt scanner: check upload button doesn't overflow on small screens
  - Conversation starters: check flex-wrap works without overflow
  - CommandBar: check it doesn't overlap with content above
- **VALIDATE**: `npm run dev` — test at 375px width

### Task 6: FINAL BUILD + VALIDATION

- **ACTION**: Full validation pass
- **VALIDATE**: `npx tsc --noEmit && npm run build`

---

## Validation Commands

### Level 1: STATIC_ANALYSIS

```bash
npx tsc --noEmit
```

### Level 3: FULL_BUILD

```bash
npm run build
```

---

## Acceptance Criteria

- [ ] Profile switcher visible in dashboard with 4 options
- [ ] Switching profiles updates all dashboard data: hero stats, donut chart, trend chart, category cards, conversation starters, system prompt
- [ ] Chat panel resets when profile changes
- [ ] Hero stats show NZ average comparison
- [ ] Smooth fade transition on profile switch
- [ ] Responsive at 375px, 768px, 1024px
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` passes

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
| ---- | ---------- | ------ | ---------- |
| Profile switch causes chart flash/jank | Medium | Low | CSS transition smooths the visual; Recharts re-renders cleanly |
| Chat doesn't reset on profile change | Medium | Medium | Explicit useEffect to close panel and clear context on profileKey change |
