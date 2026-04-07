# Feature: Household Cost Dashboard — Phase 4: Receipt Scanning

## Summary

Add a receipt photo upload feature that demonstrates the vision for frictionless expense input. Users upload a photo of a receipt (from camera or gallery), and the app extracts the merchant name, total amount, and spending category using Claude Vision. In demo mode (no API key), a simulated extraction is returned. The extracted data is shown in a confirmation card. This is a standalone feature — it doesn't modify the spending data, it demonstrates the concept for stakeholder sell-in.

## User Story

As a Genesis stakeholder viewing the demo
I want to see a receipt photo turned into structured expense data
So that I can envision how the production tool would handle real expense input

## Problem Statement

The prototype currently has no data input mechanism — it shows pre-loaded demo profiles. To sell the vision of a household cost tool, stakeholders need to see how real receipts could be captured and categorised. This is the "wow moment" for the demo.

## Solution Statement

Create a new API route `/api/scan-receipt` that accepts a base64 image and uses Claude Vision to extract merchant, amount, and category. Create a `ReceiptScanner` component with file upload UI, loading state, and extraction result display. Add it to the dashboard as a third tab or a standalone section. In demo mode, return a simulated extraction response.

## Metadata

| Field            | Value                                             |
| ---------------- | ------------------------------------------------- |
| Type             | NEW_CAPABILITY                                    |
| Complexity       | MEDIUM                                            |
| Systems Affected | app/api/scan-receipt, components/dashboard         |
| Dependencies     | @ai-sdk/anthropic ^3.0.67, ai ^6.0.149 (already installed) |
| Estimated Tasks  | 5                                                 |

---

## Mandatory Reading

| Priority | File | Lines | Why Read This |
|----------|------|-------|---------------|
| P0 | `app/api/chat/route.ts` | 120-144 | Existing Claude API pattern — mirror for vision route |
| P0 | `components/dashboard/index.tsx` | all | Where receipt scanner integrates |
| P1 | `components/ui/card.tsx` | all | Card pattern for result display |
| P1 | `components/ui/button.tsx` | all | Button variants for upload trigger |

---

## Files to Change

| File | Action | Justification |
| ---- | ------ | ------------- |
| `app/api/scan-receipt/route.ts` | CREATE | New API route for Claude Vision receipt extraction |
| `components/dashboard/receipt-scanner.tsx` | CREATE | Upload UI + result display component |
| `components/dashboard/index.tsx` | UPDATE | Add receipt scanner section to dashboard |

---

## NOT Building (Scope Limits)

- **Saving extracted expenses to the spending model** — demo only; no state mutation
- **Line-item parsing** — extract merchant + total only, not individual items
- **Multiple receipt upload** — single receipt at a time
- **Receipt history** — no persistence; each upload is standalone

---

## Step-by-Step Tasks

### Task 1: CREATE `app/api/scan-receipt/route.ts`

- **ACTION**: Create API route for receipt scanning via Claude Vision
- **IMPLEMENT**:
  - Accept POST with JSON body: `{ imageBase64: string, mimeType: string }`
  - **Demo mode** (no API key): Return a simulated JSON response after 1.5s delay:
    ```json
    { "merchant": "Countdown Riccarton", "amount": 127.43, "category": "groceries", "date": "2026-04-05", "confidence": 0.95 }
    ```
  - **Live mode** (with API key): Use `@ai-sdk/anthropic` `streamText` with multimodal message:
    - System prompt: "Extract the merchant name, total amount (NZD), date, and spending category from this receipt. Return ONLY valid JSON with keys: merchant, amount, category, date, confidence. Category must be one of: energy, groceries, mortgage, rates, insurance, transport, communications, healthcare."
    - Message content array: `[{ type: 'text', text: 'Extract receipt data.' }, { type: 'image', image: imageBase64, mediaType: mimeType }]`
    - Collect the full response text, parse as JSON, return as Response
  - Return shape: `{ merchant: string, amount: number, category: SpendingCategory, date: string, confidence: number }`
- **MIRROR**: `app/api/chat/route.ts:120-142` for the Anthropic SDK setup pattern (dynamic import, createAnthropic, error handling)
- **GOTCHA**: Do NOT stream SSE for this route — receipt scanning returns a single JSON response, not a stream. Use `generateText` instead of `streamText` for simpler handling.
- **VALIDATE**: `npx tsc --noEmit`

### Task 2: CREATE `components/dashboard/receipt-scanner.tsx`

- **ACTION**: Create receipt upload component with camera/gallery support and result display
- **IMPLEMENT**:
  - `'use client'` directive
  - State: `scanning: boolean`, `result: ReceiptResult | null`, `preview: string | null` (data URL for image preview)
  - File input: `<input type="file" accept="image/*">` (no `capture` attr — let user choose camera or gallery)
  - Hidden file input triggered by a styled Button with Camera icon
  - On file select:
    1. Create preview URL via `URL.createObjectURL(file)`
    2. Read file as base64 via `FileReader.readAsDataURL`
    3. POST to `/api/scan-receipt` with `{ imageBase64, mimeType: file.type }`
    4. Parse JSON response
    5. Display result card
  - Result display: Card with:
    - Thumbnail of the uploaded receipt (rounded, small)
    - Merchant name (large text)
    - Amount (formatted with `formatCurrency`)
    - Category badge (with icon from CATEGORY_ICON_MAP)
    - Date
    - "Add to expenses" button (disabled, shows tooltip "Coming in production")
  - Loading state: Skeleton/spinner while scanning
  - Error state: "Could not read receipt. Try a clearer photo."
- **PROPS**: None — self-contained component
- **IMPORTS**: `Card`, `CardContent`, `Button`, `Badge` from ui; `formatCurrency` from format; Lucide icons
- **VALIDATE**: `npx tsc --noEmit`

### Task 3: UPDATE `components/dashboard/index.tsx`

- **ACTION**: Add receipt scanner to the dashboard
- **IMPLEMENT**: Add a new section between the category cards and conversation starters:
  ```tsx
  {/* Receipt Scanner */}
  <div>
    <h2 className="text-lg font-semibold text-foreground mb-3">Scan a Receipt</h2>
    <ReceiptScanner />
  </div>
  ```
- **IMPORT**: `import { ReceiptScanner } from './receipt-scanner'`
- **VALIDATE**: `npx tsc --noEmit && npm run build`

### Task 4: DEMO MODE POLISH

- **ACTION**: Ensure demo mode returns realistic NZ receipt data
- **IMPLEMENT**: In `app/api/scan-receipt/route.ts`, create 3 demo responses that rotate based on a simple counter or random selection:
  - Countdown Riccarton: $127.43, groceries
  - Z Energy Moorhouse Ave: $94.60, transport
  - Spark NZ: $89.00, communications
- **VALIDATE**: `npx tsc --noEmit`

### Task 5: FINAL VALIDATION

- **ACTION**: Full build + manual check
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

- [ ] Receipt upload button visible in dashboard
- [ ] Clicking opens file picker (camera on mobile, gallery on desktop)
- [ ] Demo mode: scanning shows loading then returns simulated NZ receipt data
- [ ] Live mode (with API key): Claude Vision extracts merchant, amount, category from real receipt
- [ ] Result card shows merchant, amount, category badge, date
- [ ] Error state handles failed extraction gracefully
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` passes

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
| ---- | ---------- | ------ | ---------- |
| Claude Vision not available without API key | Expected | Low | Demo mode simulates extraction convincingly |
| Large image files slow upload | Medium | Low | Could compress client-side; for prototype, accept as-is |
| Receipt text extraction inaccurate | Low | Low | The prompt is specific about expected JSON format; Claude Vision handles NZ receipts well |
