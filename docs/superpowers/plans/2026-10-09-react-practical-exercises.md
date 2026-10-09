# React Practical Exercises Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans
> to implement this plan task-by-task. Track steps with checkboxes.

**Goal:** Deliver runnable draft-board and submit/retry exercise pairs.

**Architecture:** Four independent Next.js App Router projects, candidate and
fixed variants for each workflow. Reuse the isolated Playwright dependency;
tests own temporary dev server processes and the same behavior assertions.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v4, ESLint, Playwright.

**Spec:** [Approved design](../specs/2026-10-09-react-practical-exercises-design.md).

## Global Constraints

- Work directly in the current workspace; no branch or commit.
- Preserve old exercise code and the completed HTML pairs.
- Candidate and fixed variants share UI, fixtures and contracts.
- Node.js minimum 20.9; use Next ^16.0.10, React/React DOM ^19.2.1,
  eslint-config-next ^16.0.10 and repository-compatible TypeScript/ESLint.
- Keep Strict Mode on; no React.FC or blanket eslint-disable.
- No remote API, credentials, Google font download or production payment.
- Draft checks: 250 ms trailing delay, no repeated checks during idle.
- Submit API: 600 ms, required Idempotency-Key, validation and stable replay.
- Browser suite accepts PLAYWRIGHT_CHANNEL=msedge; HTML tests stay unchanged.
- Dev/test servers bind 127.0.0.1 and do not stop user-owned processes.

## Review Focus

- An old server revision must not overwrite a dirty draft after reorder.
- Discard after refresh must use the latest server title, not the initial one.
- Updating the check counter must not trigger another draft check.
- Programmatic form.requestSubmit must use the same validation as click.
- Concurrent POSTs must share pending work before an idempotent result exists.

## File Structure

Each new project has package.json, tsconfig.json, next.config.ts,
eslint.config.mjs, postcss.config.mjs, .gitignore and app/layout.tsx,
app/page.tsx, app/globals.css. Next/npm generate next-env and lockfiles.

Board projects:

- react-js/test-react-draft-board
- react-js/test-react-draft-board-fixed
- Each adds app/ProjectBoard.tsx, app/DraftRow.tsx and app/projects.ts.

Submit projects:

- react-js/test-react-submit-retry
- react-js/test-react-submit-retry-fixed
- Each adds app/ExpenseForm.tsx, app/validation.ts and app/api/requests/route.ts.

Tests: tests/practical-exercises/react-exercises.test.mjs.
Modify its package.json to add test:react without changing the HTML test command.
Update its README, common.md and root README with commands and runnable mappings.
Each candidate/fixed folder gets a separate README matching its audience.

## Task 1: board fixture and reference solution

Interfaces: Project has id, title and revision. ProjectBoard owns server data;
DraftRow accepts project: Project and owns draft/check state. Rows expose
data-project-id; input has class draft-input; check output class draft-checks.
Toolbar button IDs: reverse-order, refresh-server. Discard uses data-action.

- [ ] Write the browser suite lifecycle: allocate free ports, spawn Next CLI
  under each selected project, wait for ready, and terminate owned process trees.
- [ ] Add board tests with a paused browser clock: pristine refresh yields
  Atlas onboarding (v2); dirty Atlas retains local value through refresh/reverse;
  Discard uses latest title; checks wait 249/250 ms and remain stable through
  1000 ms idle; rapid input only checks the final text; mobile width fits.
- [ ] Create candidate fixture/config/docs with props-initial-state, index key
  and unstable effect dependency defects. Keep its timer loop asynchronous.
- [ ] Install candidate dependencies and run test:react for the board with
  EXERCISE_VARIANT=broken; verify meaningful failures before writing fixed logic.
- [ ] Create fixed project with ID keys, conditional state adjustment for a new
  server revision without clobbering dirty draft, and stable effect dependencies.
- [ ] Install fixed dependencies, rerun the same board tests and expect all pass.
- [ ] Run fixed lint and typecheck; save/view 320/1280 px screenshots.

## Task 2: submit fixture and reference solution

Interfaces: parseExpense(input: unknown) returns a typed success/error union.
Valid title is trimmed length 3-80; amount is finite, >0 and <=10000; scenario
is success or fail-once. ExpenseForm owns fields, errors, phase and retry key.
Controls: request-title, request-amount, request-scenario, expense-form;
status output has data-state; success output exposes request ID.

Route POST /api/requests receives JSON plus Idempotency-Key. An in-memory entry
tracks normalized payload, attempts, pending Promise and completed receipt.
Receipt has id/title/amount/scenario. Validation returns 400; payload conflict
409; first fail-once attempt 503 without creating a record; success 200.

- [ ] Add UI tests before fixed logic: click/Enter success without reload;
  invalid click and requestSubmit produce field errors and zero API calls;
  double synchronous submit starts one request; pending locks fields;
  fail-once retains fields, retry uses the same key/payload and shows receipt.
- [ ] Add real API tests: invalid payload 400, concurrent equal key/payload
  responses share receipt ID, replay returns the same receipt, changed payload
  under the same key returns 409 and preserves the original result.
- [ ] Create candidate fixture/config/docs: click-only validation, no pending
  guard, fields cleared after failure and no server idempotency enforcement.
- [ ] Install candidate dependencies and run the submit tests on broken; verify
  UI and backend failures are behavior failures, not environment errors.
- [ ] Create fixed form with form-level validation and immediate in-flight ref
  guard. Keep fields/key on error; reset key only for changed input/scenario.
- [ ] Create fixed route: validate first, reject conflicting payloads, register
  pending work before awaiting it, retain successful receipt for replay.
- [ ] Install fixed dependencies and rerun the same UI/API tests; expect all pass.
- [ ] Run fixed lint/typecheck and save/view mobile/desktop screenshots.

## Task 3: documentation, regression and review

- [ ] Give candidate README only setup, reproduction and acceptance criteria;
  fixed README includes root cause, solution, cases and rubric 0-3.
- [ ] Add the two runnable pairs to common.md and README. Remove only their
  corresponding pending rows; keep all other future workflows unimplemented.
- [ ] Run full React fixed suite and original 20 HTML tests using installed Edge.
- [ ] Run full broken React suite: both groups must fail at intended behaviors.
- [ ] Check local links and editor diagnostics, inspect screenshots and obtain
  a fresh read-only review of the new code/tests/briefs.
- [ ] Resolve material review findings with narrow regression checks.
- [ ] Stop test-owned servers; start fixed dev servers on available ports and
  return their local URLs. Do not terminate unrelated existing terminals.

## Execution Results

Task 1: complete. Fixed draft board passes 8/8 browser cases. Candidate fails
four intended checks: pristine refresh, ID identity and repeated idle checks.
Fixed lint/typecheck pass. Mobile/desktop screenshots were inspected.

Task 2: complete. Fixed submit passes 13/13 UI/API cases. Candidate fails seven
intended checks covering direct submit, pending, retry data and idempotency.
Fixed lint/typecheck pass. API uses local process memory, not production storage.

Task 3: verification complete. Full fixed React suite passes 21/21, zero
cancelled. Broken suite has 10 pass and 11 intended failures, zero cancelled.
Original HTML suite still passes 20/20. Checks use installed Edge. Local links
and five runnable mappings pass. Independent read-only review found no material
issues. Old exercise code and the HTML test module were not changed.

Ruling: Next's version-16 generator currently resolves Next 16.4.0 / React 19.3.0.
These pinned versions keep the approved major versions. Cache/prefetch defaults
from the generator were removed for simple state exercises; Strict Mode stays on.

Ruling: Sonar IDE retains stale diagnostics on the fixed ExpenseForm after
reanalysis, including the previous catch variable and nonsensical attribute
fragments. Current ESLint, TypeScript and 21 browser/API tests pass. Do not edit
valid source to satisfy outdated positions; remaining IDE diagnostics are noted.

Runtime npm audit reports zero advisories. Development tooling has five high
advisories through eslint-config-next / glob packages and ESLint 9 is deprecated.
No force upgrade or major-version change was applied. This limitation is recorded
in private reference READMEs, not presented as a clean full dependency audit.

The original unchecked steps are the plan; the results above are the execution
record. Test-owned servers were cleaned up. Fixed preview ports 3042/3044 were
confirmed free before starting long-running dev servers.

Preview handoff complete: draft fixed runs at http://127.0.0.1:3042 and submit
fixed at http://127.0.0.1:3044. Both URLs return HTTP 200 with the expected page.
Servers remain running intentionally for local evaluation; they are separate
from the test-owned temporary processes and from pre-existing user servers.


