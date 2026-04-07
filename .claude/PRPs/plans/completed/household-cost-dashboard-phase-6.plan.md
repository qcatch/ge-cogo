# Feature: Household Cost Dashboard — Phase 6: Stakeholder Demo Prep

## Summary

Final polish phase to make the prototype demo-ready for the England-Hall / Hyde sell-in meeting. Add preset AI conversation starters that auto-trigger compelling demo flows, ensure the demo works fully offline (demo mode without API key), add a Genesis-branded footer, and do a final visual QA pass. No new features — just hardening what exists.

## User Story

As BHL running a 5-minute stakeholder demo
I want the prototype to work flawlessly with compelling pre-set demo flows
So that England-Hall and Hyde immediately understand the value and approve production funding

## Metadata

| Field            | Value                                             |
| ---------------- | ------------------------------------------------- |
| Type             | ENHANCEMENT                                       |
| Complexity       | LOW                                               |
| Systems Affected | components/dashboard, components/layout, app/api   |
| Dependencies     | None new                                           |
| Estimated Tasks  | 5                                                 |

---

## Mandatory Reading

| Priority | File | Lines | Why Read This |
|----------|------|-------|---------------|
| P0 | `components/dashboard/index.tsx` | all | Dashboard — add footer, verify all sections |
| P0 | `app/api/chat/route.ts` | 1-80 | Demo responses — verify all categories covered |
| P1 | `components/layout/header.tsx` | all | Header — may need subtitle update |
| P1 | `app/api/scan-receipt/route.ts` | all | Receipt demo — verify fallback works |

---

## Files to Change

| File | Action | Justification |
| ---- | ------ | ------------- |
| `components/dashboard/index.tsx` | UPDATE | Add Genesis-branded footer section |
| `components/layout/header.tsx` | UPDATE | Final subtitle text for demo |
| `app/api/chat/route.ts` | UPDATE | Add a "biggest opportunity" demo response that references specific profile data |
| `app/page.tsx` | UPDATE | Add meta viewport for mobile demo |

---

## NOT Building (Scope Limits)

- **New features** — this is polish only
- **Slide deck or presentation materials** — code changes only
- **Deployment** — stays on localhost for demo

---

## Step-by-Step Tasks

### Task 1: ADD Genesis-branded footer to dashboard

- **ACTION**: Add a footer section at the bottom of the dashboard (below CommandBar, above the Chat Panel)
- **IMPLEMENT**: A simple `<footer>` with:
  - Genesis Energy logo mark (small, reuse the SVG from header)
  - "Household Cost Dashboard" label
  - "Prototype — April 2026" text
  - "Powered by AI" badge
  - Muted, understated design — `text-muted-foreground text-xs`
- **VALIDATE**: `npx tsc --noEmit`

### Task 2: UPDATE header subtitle

- **ACTION**: Change the header subtitle to be more demo-appropriate
- **IMPLEMENT**: In `components/layout/header.tsx`, change "Household Cost Dashboard" to "Cost of Living Advisor" — this is the product name for the sell-in, not the internal project name
- **VALIDATE**: `npx tsc --noEmit`

### Task 3: ADD "biggest opportunity" demo response

- **ACTION**: Enhance the `savings` demo response in the API route to be more specific and compelling
- **IMPLEMENT**: The current `savings` response is good but generic. Add a `biggest` keyword match that returns a more dramatic response:
  ```
  "Looking at this household's costs, insurance stands out — it's risen 14% in the last year alone. The average NZ household can save $2,000-3,000 a year just by comparing insurance quotes across providers. That's the single biggest quick-win available.
  
  After insurance, the grocery bill at $1,650/month is the next target. Switching from New World to Pak'nSave saves the average family ~$700/year, and consolidating to one weekly shop cuts impulse spending by another $500-700/year.
  
  Combined, these two changes alone could save this family over $3,500 a year — without changing their lifestyle at all."
  ```
  Add keyword matches: `biggest`, `most`, `where should`, `priority`, `first`
- **VALIDATE**: `npx tsc --noEmit`

### Task 4: VERIFY offline demo mode works end-to-end

- **ACTION**: Ensure every feature works without `ANTHROPIC_API_KEY`
- **IMPLEMENT**: Verify (by reading code, not running):
  1. Chat demo mode: keyword-matched responses for all 9 topics (groceries, insurance, rates, mortgage, transport, communications, healthcare, energy, savings) + default
  2. Receipt scanner demo mode: 3 rotating NZ receipts with 1.5s delay
  3. System prompt: still built (used for live mode, ignored in demo mode)
  4. All charts: render from static demo data, no API dependency
  5. Profile switching: works entirely client-side
- **No code changes needed** unless gaps found
- **VALIDATE**: Code review only

### Task 5: FINAL BUILD + VALIDATION

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

- [ ] Genesis-branded footer visible at bottom of dashboard
- [ ] Header shows "Cost of Living Advisor" subtitle
- [ ] "Biggest opportunity" demo response is specific and compelling
- [ ] All features work without API key (demo mode)
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` passes
- [ ] Can run a compelling 5-minute demo from `npm run dev`
