# Feature: Integration + Polish

## Summary

Final polish pass to make the prototype stakeholder-presentation-ready. Add a "Prototype" badge, ensure the demo flow works end-to-end without dead ends, add loading states, improve the header nav to scroll to sections in the results view, add an `.env.example` file, and verify the complete 5-minute demo flow (landing → form/demo → TCE results → savings roadmap → bill tracker → AI conversation → edit and repeat).

## User Story

As a Genesis stakeholder viewing the prototype demo
I want a polished, cohesive experience with no dead ends or broken states
So that I can evaluate the Total Cost of Energy concept for the August brand launch

## Metadata

| Field | Value |
|-------|-------|
| Type | ENHANCEMENT |
| Complexity | LOW |
| Systems Affected | components/layout/, components/dashboard/, app/ |
| Dependencies | None |
| Estimated Tasks | 5 |

---

## Files to Change

| File | Action | Justification |
|------|--------|---------------|
| `components/layout/header.tsx` | UPDATE | Add "Prototype" badge, wire nav links to scroll anchors |
| `components/dashboard/tce-results.tsx` | UPDATE | Add section IDs for scroll anchoring |
| `app/layout.tsx` | UPDATE | Add Open Graph metadata for sharing |
| `.env.example` | CREATE | Document optional ANTHROPIC_API_KEY |
| `components/dashboard/index.tsx` | UPDATE | Auto-load Auckland Family demo on first visit for instant stakeholder impact |

---

## Step-by-Step Tasks

### Task 1: UPDATE header with Prototype badge + scroll nav

- **ACTION**: Add "Prototype" badge next to the title, make nav items scroll to sections
- **IMPLEMENT**:
  - Add a small `bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full` badge reading "Prototype" next to "Total Cost of Energy"
  - Change nav href anchors to: `#calculator` (form/top), `#savings-roadmap`, `#bill-tracker`
  - Add smooth scroll behaviour via `onClick` with `scrollIntoView`
- **VALIDATE**: `npx tsc --noEmit`

### Task 2: Add section IDs for scroll anchoring

- **ACTION**: Add `id` attributes to key sections in tce-results.tsx
- **IMPLEMENT**:
  - Bill tracker card: `id="bill-tracker"`
  - Savings roadmap already has `id="savings-roadmap"` (from Phase 4)
  - Verify all scroll targets exist
- **VALIDATE**: `npx tsc --noEmit`

### Task 3: CREATE `.env.example`

- **ACTION**: Document environment variables
- **IMPLEMENT**:
  ```
  # Optional: Set to enable Claude AI responses (demo mode works without this)
  # ANTHROPIC_API_KEY=sk-ant-...
  ```
- **VALIDATE**: File exists

### Task 4: UPDATE layout metadata

- **ACTION**: Add OG tags for sharing
- **IMPLEMENT**: Add `openGraph` to metadata in `app/layout.tsx`:
  - `title`, `description`, `type: 'website'`
- **VALIDATE**: `npx tsc --noEmit`

### Task 5: Final build + end-to-end verification

- **ACTION**: Production build + full demo flow test
- **IMPLEMENT**:
  - `npm run build` must succeed
  - Dev server: verify the complete 5-minute flow:
    1. Landing page loads with form
    2. Click "Auckland Family" demo → instant results
    3. Hero numbers visible (current/electrified/savings)
    4. Bar chart renders with 3 categories
    5. Bill tracker chart shows 12 months with seasonal pattern
    6. Savings roadmap shows prioritised switches
    7. Emissions comparison visible
    8. "See savings roadmap" button scrolls to roadmap section
    9. Command bar accepts input → chat panel opens
    10. AI responds in demo mode with streaming
    11. "Edit my profile" returns to form with last values preserved
    12. Can submit custom profile → new results
- **VALIDATE**: Build succeeds, all 12 flow steps work

---

## Validation Commands

```bash
npx tsc --noEmit
npm run build
```

---

## Acceptance Criteria

- [ ] "Prototype" badge visible in header
- [ ] Nav links scroll to corresponding sections
- [ ] `.env.example` documents ANTHROPIC_API_KEY
- [ ] Complete 5-minute demo flow works end-to-end without dead ends
- [ ] `npx tsc --noEmit` and `npm run build` pass
