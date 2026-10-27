# Next Cache and API Contract Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans
> to execute task-by-task with observed broken/fixed behavior checks.

**Goal:** Deliver two runnable Next.js/TypeScript exercise pairs for Q10-Q12.

**Architecture:** Four independent Next App Router projects using verified
configuration from prior exercises. Separate suite owns isolated dev servers,
Data Cache directories and browser/parser assertions for both variants.

**Tech Stack:** Next 16.4 / React 19.3 / TypeScript / Tailwind / Zod / Playwright.

**Spec:** [Approved design](../specs/2026-10-09-next-contract-exercises-design.md).

## Global Constraints

- Direct work in current workspace; no commit, branch, old source changes.
- Same data/UI/contract between candidate and fixed.
- Node >=20.9; use pinned framework versions from existing new exercises.
- Cache Components stay off; use supported unstable_cache and Server Actions.
- Marker is fake DEMO_SERVER_TOKEN_ONLY_2026, never a real credential.
- Loader uses Zod runtime validation; TypeScript assertions are not validation.
- APIs/storage local; no remote service/auth/production-storage claims.
- Tests use free ports and .next/test-PORT through NEXT_EXERCISE_DISTDIR.
- Cleanup touches only owned processes and owned test output, not user servers.
- Add test:next script; preserve existing HTML/React test commands/assertions.

## Review Focus

- Warm cache from Studio must not leak Studio data into Operations.
- Repeated mutations must read their own new quantity, including after reload.
- Server marker must not appear in HTML/RSC props or browser DOM.
- A 200 response with quantity string must be rejected, not silently coerced.
- Loading/error/data must not survive concurrently after a failed refresh.

## File Structure

Each project has copied framework/config/base styles, a private reference README
or candidate-only README, and independent package/lock/dependency installation:

- react-js/test-next-workspace-cache and -fixed
- react-js/test-typescript-api-contract and -fixed

Dashboard adds app/page.tsx, app/InventoryControls.tsx, app/actions.ts,
app/inventory.ts. The inventory module is marked server-only. Controls accept
only public workspace and action props in fixed. Workspace is studio/operations.

Loader adds app/page.tsx, app/InventoryLoader.tsx, app/inventory-schema.ts,
app/api/inventory/route.ts. Export parseInventory(payload: unknown) returning
typed envelope or throwing on contract error, plus InventoryItem type.

Tests: tests/practical-exercises/next-exercises.test.mjs. Add tsx dev dependency
and test:next = node --import tsx --test next-exercises.test.mjs. New projects
use type=module for direct parser imports. Do not refactor older runner files.

## Task 1: cache dashboard pair

- [ ] Add new suite lifecycle with free ports, private distDir, Edge option,
  readiness deadline and owned-process/output cleanup. NEXT_EXERCISE selects
  cache/contract/all; EXERCISE_VARIANT selects broken/fixed.
- [ ] Add cache tests: Studio item/4 then Operations item/7 after cache warm;
  Receive one changes current quantity immediately; switching scope/reload
  retains mutation without changing other workspace; no private marker in
  HTML/RSC/DOM; pending button and viewport 320/1280 checks/screenshots.
- [ ] Create candidate with closure omitted from cache key, mutation refresh
  without proper tag expiration, and marker client prop. Install dependencies.
- [ ] Run cache suite on broken and observe behavior failures, not startup errors.
- [ ] Create fixed clone with workspace-aware cache key, scoped tags/updateTag
  from Server Action, server-only marker handling and small Client controls.
- [ ] Install fixed dependencies; run identical cache suite and expect pass.
- [ ] Run fixed lint/typecheck; add separate candidate/fixed briefs/rubric.

## Task 2: API contract loader pair

- [ ] Add browser cases: valid -> success rows/total4, empty -> empty, invalid
  -> error/no data, valid -> HTTP error clears previous data, error -> valid
  recovers, loading exclusive and locks controls, mobile/desktop screenshots.
- [ ] Add parser tests with literal envelopes: valid/empty accepted; null,
  wrong envelope, quantity string/negative/fractional and bad id/name rejected.
- [ ] Create candidate API 200ms fixtures, assertion-only parser and independent
  flags/data with missing error cleanup. Install Zod/framework dependencies.
- [ ] Run browser/parser tests on broken; confirm intended failures.
- [ ] Create fixed clone with Zod schema and discriminated UI state union.
  Start new loading/error without retaining previous data; support retry.
- [ ] Install fixed dependencies; run same browser/parser tests and expect pass.
- [ ] Run fixed lint/typecheck; add candidate-only brief and private rubric.

## Task 3: regression, review and preview

- [ ] Update common.md/README with P06/P07 and remove only corresponding pending
  rows. Update test README for new dependencies and next suite/environment flags.
- [ ] Run full fixed next suite, full broken next suite and existing HTML/React
  suites. Fixed passes; both starter groups fail intended checks.
- [ ] Check docs links, diagnostics and screenshots. Inspect runtime vs dev
  dependency audit separately; do not force major upgrades.
- [ ] Get independent read-only review; repair material findings narrowly.
- [ ] Start fixed previews on free ports and verify HTTP200 before handing URLs.
  Record test results and environmental limitations in this plan.
