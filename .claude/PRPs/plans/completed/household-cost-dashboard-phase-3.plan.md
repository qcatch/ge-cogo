# Feature: Household Cost Dashboard — Phase 3: AI Savings Advisor

## Summary

Enhance the AI savings advisor to be deeply profile-aware and genuinely useful. Add NZ benchmark comparisons to the system prompt, create a conversation starters component that suggests contextual questions based on the household's spending profile, add communications and healthcare demo responses, and refine the existing demo responses with more specific NZ data. The system prompt builder and demo responses from Phase 1 are solid foundations — this phase deepens them.

## User Story

As a Genesis stakeholder watching the demo
I want the AI advisor to give specific, data-grounded savings advice that references the household's actual spending
So that I can see this is genuinely useful and not just a generic chatbot

## Problem Statement

The Phase 1 AI advisor works but has gaps: (1) the system prompt doesn't compare the household's spending to NZ averages, (2) demo responses are generic rather than profile-aware, (3) there are no conversation starters to guide the demo, and (4) communications and healthcare topics are missing from demo mode.

## Solution Statement

Enhance `lib/household-context.ts` to include NZ benchmark comparisons per category. Add a `generateConversationStarters()` function that produces 3-4 contextual questions based on the highest-impact savings opportunities. Add communications and healthcare demo responses to the API route. Add a conversation starters section above the CommandBar in the dashboard.

## Metadata

| Field            | Value                                             |
| ---------------- | ------------------------------------------------- |
| Type             | ENHANCEMENT                                       |
| Complexity       | LOW                                               |
| Systems Affected | lib/household-context, app/api/chat, components/dashboard |
| Dependencies     | None new — all within existing stack               |
| Estimated Tasks  | 5                                                 |

---

## Mandatory Reading

| Priority | File | Lines | Why Read This |
|----------|------|-------|---------------|
| P0 | `lib/household-context.ts` | all | System prompt — ENHANCE |
| P0 | `app/api/chat/route.ts` | 1-66 | Demo responses — ADD two topics |
| P1 | `lib/household-model/constants.ts` | 62-112 | Benchmarks + savings data to inject |
| P1 | `components/dashboard/index.tsx` | 148-154 | Where starters integrate above CommandBar |
| P2 | `components/ai/command-bar.tsx` | all | Understand current CommandBar pattern |

---

## Files to Change

| File | Action | Justification |
| ---- | ------ | ------------- |
| `lib/household-context.ts` | UPDATE | Add benchmark comparisons, generate conversation starters |
| `app/api/chat/route.ts` | UPDATE | Add communications + healthcare demo responses |
| `components/dashboard/conversation-starters.tsx` | CREATE | Clickable suggested questions above CommandBar |
| `components/dashboard/index.tsx` | UPDATE | Wire conversation starters into layout |

---

## NOT Building (Scope Limits)

- **Prompt tuning with real Claude API** — demo mode is sufficient for stakeholder sell-in
- **Multi-turn conversation memory** — each chat session starts fresh
- **Streaming markdown rendering** — responses render as plain text with basic markdown

---

## Step-by-Step Tasks

### Task 1: UPDATE `lib/household-context.ts` — Add benchmark comparisons + starters

- **ACTION**: Enhance `buildHouseholdSystemPrompt` and add `generateConversationStarters`
- **IMPLEMENT**:
  1. Import `CATEGORY_BENCHMARKS` from constants
  2. In the system prompt, after each category in the breakdown, add a comparison: "(NZ avg: $X/mo — Y% above/below)"
  3. Add a new exported function:
     ```typescript
     export function generateConversationStarters(spending: HouseholdSpending): string[]
     ```
     Returns 4 contextual questions based on the profile:
     - Always include: "Where's my biggest savings opportunity?"
     - If insurance trend is 'up': "Am I paying too much for insurance?"
     - Pick the top 2 categories by savings potential that apply to this household
     - Format as natural questions: "How can I reduce my $1,650/month grocery bill?"
- **VALIDATE**: `npx tsc --noEmit`

### Task 2: UPDATE `app/api/chat/route.ts` — Add missing demo responses

- **ACTION**: Add `communications` and `healthcare` demo response entries + keyword matching
- **IMPLEMENT**:
  Add to `demoResponses`:
  ```
  communications: NZ-specific tips about Broadband Compare, bundling, checking data usage
  healthcare: Tips about reviewing health insurance, community services, Pharmac
  ```
  Add to `getDemoResponse` keyword matching:
  ```
  if (lower.includes('broadband') || lower.includes('internet') || lower.includes('phone') || lower.includes('mobile') || lower.includes('commun')) return demoResponses.communications
  if (lower.includes('health') || lower.includes('doctor') || lower.includes('medical') || lower.includes('dentist') || lower.includes('pharmac')) return demoResponses.healthcare
  ```
  Place these BEFORE the existing `energy` match (since "heat" could match healthcare).
- **GOTCHA**: Order matters in getDemoResponse — more specific keywords must come before general ones. Place healthcare before energy to avoid "health" matching "heat" first. Actually "heat" won't match "health" since we check `lower.includes('heat')` not substring matching — but placing healthcare earlier is still safer.
- **VALIDATE**: `npx tsc --noEmit`

### Task 3: CREATE `components/dashboard/conversation-starters.tsx`

- **ACTION**: Create a row of clickable conversation starter chips
- **IMPLEMENT**: A simple component that renders 3-4 suggestion pills:
  ```tsx
  'use client'
  interface ConversationStartersProps {
    starters: string[]
    onSelect: (text: string) => void
  }
  export function ConversationStarters({ starters, onSelect }: ConversationStartersProps)
  ```
  Renders as a horizontal scrollable row of `Button variant="outline" size="sm"` chips. Each button calls `onSelect(starter)` on click. Uses the `MessageSquare` icon from lucide-react as a prefix.
- **STYLE**: `flex flex-wrap gap-2` container, each button is small outline with the question text truncated to ~50 chars on mobile
- **VALIDATE**: `npx tsc --noEmit`

### Task 4: UPDATE `components/dashboard/index.tsx` — Wire starters

- **ACTION**: Add ConversationStarters above the CommandBar
- **IMPLEMENT**:
  1. Import `generateConversationStarters` from `@/lib/household-context`
  2. Import `ConversationStarters` component
  3. Compute: `const starters = generateConversationStarters(spending)`
  4. Add above CommandBar:
     ```tsx
     <ConversationStarters starters={starters} onSelect={handleCommandSubmit} />
     ```
- **VALIDATE**: `npx tsc --noEmit && npm run build`

### Task 5: FINAL VALIDATION

- **ACTION**: Full build + manual verification checklist
- **VALIDATE**: `npx tsc --noEmit && npm run build`
- **MANUAL CHECK**:
  1. Conversation starters appear above CommandBar
  2. Clicking a starter opens the chat panel
  3. Demo mode responds to "communications" and "healthcare" queries
  4. System prompt includes benchmark comparisons (inspect via console or live Claude test)

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

- [ ] System prompt includes NZ benchmark comparison per category
- [ ] `generateConversationStarters()` returns 4 contextual questions
- [ ] Communications and healthcare demo responses exist
- [ ] Conversation starters render above CommandBar
- [ ] Clicking a starter opens chat with that question
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` passes

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
| ---- | ---------- | ------ | ---------- |
| Demo responses feel scripted | Low | Medium | Write in natural conversational tone with specific NZ dollar amounts |
| Starters feel generic | Low | Low | Generate dynamically from profile data with actual dollar amounts |
