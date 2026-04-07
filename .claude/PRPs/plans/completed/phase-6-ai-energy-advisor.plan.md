# Feature: AI Energy Advisor (EIQ)

## Summary

Add a conversational AI energy advisor powered by Anthropic Claude that helps users understand their TCE results. Implemented as a slide-out chat panel with SSE streaming, accessible from the command bar at the bottom of the dashboard. The system prompt is grounded in the user's actual TCE data (household input, costs, savings, roadmap, emissions). Includes a demo mode with keyword-matched responses for when no API key is configured.

## User Story

As a household member who has just seen their TCE results
I want to ask follow-up questions about my energy costs and electrification options
So that I can understand the results and feel confident about which switches to prioritise

## Metadata

| Field | Value |
|-------|-------|
| Type | NEW_CAPABILITY |
| Complexity | HIGH |
| Systems Affected | app/api/, components/ai/, components/chat/, lib/, components/dashboard/ |
| Dependencies | @ai-sdk/anthropic (to install), ai SDK (to install) |
| Estimated Tasks | 8 |

---

## Mandatory Reading

| Priority | File | Why |
|----------|------|-----|
| P0 | PoC `app/api/chat/route.ts` | SSE streaming pattern to mirror |
| P0 | PoC `components/ai/conversation-panel.tsx` | Client SSE parsing + Sheet chat panel |
| P0 | PoC `lib/customer-context.ts:116-191` | System prompt builder pattern |
| P1 | `components/dashboard/index.tsx` | Dashboard state — where to wire chat |
| P1 | `lib/energy-model/types.ts` | TCEResult + HouseholdInput for context |
| P2 | PoC `components/chat/message-list.tsx` | Message rendering + streaming cursor |
| P2 | PoC `components/ai/command-bar.tsx` | Bottom input bar pattern |

---

## Files to Change

| File | Action | Justification |
|------|--------|---------------|
| `lib/tce-context.ts` | CREATE | System prompt builder using TCE data |
| `app/api/chat/route.ts` | CREATE | SSE streaming API with demo mode + Claude |
| `components/chat/message-list.tsx` | CREATE | Chat message rendering with streaming cursor |
| `components/chat/chat-input.tsx` | CREATE | Text input for chat panel |
| `components/ai/conversation-panel.tsx` | CREATE | Slide-out Sheet chat panel with SSE client |
| `components/ai/command-bar.tsx` | CREATE | Bottom pill input that opens chat panel |
| `components/dashboard/index.tsx` | UPDATE | Wire chat panel + command bar |
| `package.json` | UPDATE | Add @ai-sdk/anthropic + ai deps |

---

## NOT Building

- No Salesforce Agentforce integration — Claude only (with demo mode fallback)
- No voice input — simplify for prototype (can add later from PoC pattern)
- No message persistence — conversation resets on page reload
- No multi-turn context management — send full message history each time
- No rate limiting or auth — prototype only

---

## Step-by-Step Tasks

### Task 1: Install AI dependencies

- **ACTION**: Add Anthropic SDK + Vercel AI SDK to package.json
- **IMPLEMENT**: `npm install @ai-sdk/anthropic ai`
- **GOTCHA**: The PoC has `@ai-sdk/anthropic@^3.0.31` and `ai@6.0.61`. Match these versions.
- **VALIDATE**: `npm install` succeeds, `npx tsc --noEmit`

### Task 2: CREATE `lib/tce-context.ts`

- **ACTION**: Build a system prompt from TCEResult + HouseholdInput
- **IMPLEMENT**:
  - `buildTCESystemPrompt(input: HouseholdInput, result: TCEResult): string`
  - Template includes:
    - Role: "You are Genesis Energy's AI Energy Advisor for New Zealand households"
    - Household profile (region, occupants, appliances, vehicles)
    - Current annual costs by vector (electricity, gas, transport, total)
    - Electrified annual costs
    - Annual savings and percentage
    - Savings roadmap with payback periods
    - Emissions comparison
    - NZ-specific context (electricity avg 39.3c/kWh, petrol $3.42/L)
    - Instructions: be helpful, NZ-focused, use dollar amounts, don't hallucinate data not in the context
  - Also export `buildDefaultSystemPrompt(): string` for when no TCE results exist
- **MIRROR**: PoC `lib/customer-context.ts:116-191` buildSystemPrompt pattern
- **VALIDATE**: `npx tsc --noEmit`

### Task 3: CREATE `app/api/chat/route.ts`

- **ACTION**: SSE streaming API route with demo mode + Claude backend
- **IMPLEMENT**:
  - `export const maxDuration = 60`
  - Accept POST with `{ messages, systemPrompt? }`
  - **Demo mode** (no `ANTHROPIC_API_KEY` env var): keyword-match last message against TCE-relevant topics (savings, solar, EV, heating, costs, emissions, roadmap), return canned NZ energy advice responses, stream word-by-word with 30-50ms delays
  - **Claude mode** (`ANTHROPIC_API_KEY` set): call Claude via `@ai-sdk/anthropic` streamText, pipe the AI SDK stream to SSE response
  - SSE wire format: `{ type: 'message-start' }`, `{ type: 'text-delta', delta }`, `{ type: 'message-end' }`, `[DONE]`
  - Fallback: if Claude call fails, fall back to demo mode with error logged
- **MIRROR**: PoC `app/api/chat/route.ts` — same SSE format, same fallback pattern
- **GOTCHA**: Use the Vercel AI SDK `streamText` for Claude integration rather than raw fetch. The `ai` package handles SSE encoding. But also support the hand-rolled SSE for demo mode.
- **VALIDATE**: `npx tsc --noEmit`

### Task 4: CREATE `components/chat/message-list.tsx`

- **ACTION**: Chat message rendering with streaming cursor
- **IMPLEMENT**:
  - Props: `messages: Message[]`, `streamingContent: string`, `isLoading: boolean`
  - `Message` type: `{ id: string; role: 'user' | 'assistant'; content: string }`
  - User messages: right-aligned, `bg-primary text-primary-foreground` bubble
  - Assistant messages: left-aligned, `bg-muted` bubble with Genesis icon
  - Streaming content: rendered as a partial assistant message with pulsing cursor
  - Loading indicator: three-dot animation when waiting for response
  - Auto-scroll to bottom on new messages via `useEffect` + `scrollIntoView`
- **MIRROR**: PoC `components/chat/message-list.tsx`
- **VALIDATE**: `npx tsc --noEmit`

### Task 5: CREATE `components/chat/chat-input.tsx`

- **ACTION**: Text input for the chat panel
- **IMPLEMENT**:
  - Props: `onSend: (text: string) => void`, `isLoading: boolean`
  - Textarea with auto-resize
  - Submit on Enter (Shift+Enter for newline)
  - Send button with `SendHorizontal` icon
  - Disabled state while loading
- **MIRROR**: PoC `components/chat/chat-input.tsx` (without voice input)
- **VALIDATE**: `npx tsc --noEmit`

### Task 6: CREATE `components/ai/conversation-panel.tsx`

- **ACTION**: Slide-out Sheet chat panel with SSE client
- **IMPLEMENT**:
  - Props: `open: boolean`, `onOpenChange: (open: boolean) => void`, `systemPrompt: string`, `initialContext?: string`
  - Internal state: `messages: Message[]`, `isLoading: boolean`, `streamingContent: string`
  - `handleSend(text)`:
    1. Add user message to state
    2. POST to `/api/chat` with `{ messages, systemPrompt }`
    3. Read SSE stream from response body (ReadableStream reader pattern)
    4. Accumulate `text-delta` events into `streamingContent`
    5. On stream end, commit full content as assistant message
  - Auto-send `initialContext` on first open (useEffect with ref guard)
  - Clear state on close
  - Sheet side: "right", width override: `sm:max-w-lg`
- **MIRROR**: PoC `components/ai/conversation-panel.tsx` (exact SSE parsing logic)
- **VALIDATE**: `npx tsc --noEmit`

### Task 7: CREATE `components/ai/command-bar.tsx`

- **ACTION**: Bottom input bar that opens the chat panel
- **IMPLEMENT**:
  - Props: `onSubmit: (text: string) => void`, `isLoading: boolean`
  - Pill-shaped input with Zap icon
  - On submit: calls `onSubmit` with the typed text
  - Styled consistently with existing command bar placeholder
- **MIRROR**: PoC `components/ai/command-bar.tsx` (without voice)
- **VALIDATE**: `npx tsc --noEmit`

### Task 8: UPDATE `components/dashboard/index.tsx`

- **ACTION**: Wire chat panel + command bar into the dashboard
- **IMPLEMENT**:
  - Import `ConversationPanel`, `CommandBar`, `buildTCESystemPrompt`, `buildDefaultSystemPrompt`
  - Add state: `chatOpen: boolean`, `chatContext: string`
  - Build system prompt: if `result` and `lastInput` exist, use `buildTCESystemPrompt(lastInput, result)`, else `buildDefaultSystemPrompt()`
  - Replace the static command bar placeholder with `<CommandBar>`
  - Add `<ConversationPanel>` rendered alongside the main content
  - `handleCommandSubmit`: set chatContext, open panel
  - On panel close: clear chatContext
- **MIRROR**: PoC `components/dashboard/index.tsx` state management pattern
- **VALIDATE**: `npx tsc --noEmit && npm run build`

---

## Validation Commands

```bash
npx tsc --noEmit
npm run build
```

---

## Acceptance Criteria

- [ ] Command bar at bottom accepts text input
- [ ] Chat panel slides out from right on submit
- [ ] Demo mode works without API key (keyword-matched responses)
- [ ] Messages stream word-by-word with pulsing cursor
- [ ] System prompt includes user's TCE data when available
- [ ] Panel auto-sends context message on first open
- [ ] `npx tsc --noEmit` and `npm run build` pass

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Anthropic SDK import issues with Next.js 16 | Medium | Medium | Demo mode works without SDK; SDK is optional |
| SSE parsing edge cases | Low | Low | Proven pattern from PoC; JSON parse in try/catch |
| System prompt too large for model context | Low | Low | TCE data is compact (~500 tokens); well within limits |

---

## Notes

- The PoC uses `@ai-sdk/anthropic@^3.0.31` and `ai@6.0.61`. We'll match these versions.
- Demo mode is critical — it means the prototype works in stakeholder demos without needing an API key configured.
- The demo responses should be NZ energy-specific and reference TCE concepts (total cost, electrification, savings roadmap).
- The system prompt builder is the key differentiator from generic chatbots — it grounds Claude in the user's actual household data.
