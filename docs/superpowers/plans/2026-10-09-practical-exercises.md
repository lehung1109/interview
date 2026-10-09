# Practical Exercises Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans
> to implement this plan task-by-task. Track steps with checkboxes.

**Goal:** Deliver three runnable candidate exercises and private solutions.

**Architecture:** Independent HTML pages with inline styles and scripts.
Broken/fixed pairs share UI and fixtures; only intentional defects differ.
Browser verification lives outside candidate folders.

**Tech Stack:** HTML, CSS, JavaScript, Node.js test runner, Playwright Chromium.

**Spec:** [Approved design](../specs/2026-10-09-practical-exercises-design.md).

## Global Constraints

- Use `test-*` / `test-*-fixed` naming; preserve existing exercises.
- Pages run by opening index.html; no build, CDN or remote API dependency.
- Search debounce is 300 ms trailing-edge; match trimmed substring ignoring case.
- Empty search clears results immediately and makes no API call.
- Candidate README contains only the brief, prerequisites and acceptance criteria.
- Fixed README contains explanation, test cases and scoring rubric 0-3.
- Tests/dependencies stay outside existing exercise projects.
- No commits or branches unless the user explicitly requests them.
- Implement directly in the current workspace, as selected by the user.

## Review Focus

- Nested element clicks must identify the owning action button.
- Blank task names must not create an empty list row.
- Stale failures must not replace a newer successful search result.
- Clearing a query must invalidate an in-flight response, not just its timer.
- Long unbroken agenda text must wrap without hiding accessible content.

## File Structure

Each of the following folders receives index.html and README.md:

- vanilla-js/test-script-event-delegation
- vanilla-js/test-script-event-delegation-fixed
- vanilla-js/test-script-search-race
- vanilla-js/test-script-search-race-fixed
- css/test-css-responsive-agenda
- css/test-css-responsive-agenda-fixed

Testing files: tests/practical-exercises/package.json, exercises.test.mjs,
README.md and .gitignore. npm generates a lockfile. package.json uses a
Playwright development dependency and `node --test exercises.test.mjs`.
Modify common.md and root README.md only for the runnable exercise index.

## Task 1: dynamic task list

Interfaces: form #task-form, input #task-name, list #task-list; delete buttons
use data-action="delete". Stats link targets #stats. Rows use data-task-id.

- [ ] Create the browser test runner with EXERCISE_VARIANT=broken/fixed selecting
  the same exercise paths and assertions. Default variant is fixed.
- [ ] Add tests: Enter adds without navigation; blank name adds no row; nested
  button content deletes new rows; stats link changes hash; HTML-like task
  names remain text; keyboard activation deletes a row.
- [ ] Install test dependencies with `npm --prefix tests/practical-exercises install`.
  Install Chromium through the runner's browser-install script if needed.
- [ ] Run `npm --prefix tests/practical-exercises test` and confirm the missing
  exercise fails before implementation, not because the test runner is broken.
- [ ] Create candidate page with listeners limited to initial buttons and
  overly broad default prevention; add a candidate-only README.
- [ ] Run tests against the broken variant; confirm failures describe the
  intended behavior defects.
- [ ] Create the fixed page using one delegated list listener, closest action
  lookup, and form-scoped preventDefault; add interviewer README.
- [ ] Rerun the same focused tests; fixed passes and broken stays discriminating.

## Task 2: independent debounced searches

Interfaces: input #people-query / #rooms-query, results #people-results /
#rooms-results, status #people-status / #rooms-status. Local fakeSearch(kind,
query) returns a Promise of matching records. Request log tracks calls for tests.

- [ ] Add tests before pages: 300 ms trailing debounce; independent input
  timers; `a` then `an` resolves in reverse order; clear invalidates in-flight
  data; old error cannot overwrite new success; empty/error/success states.
- [ ] Run the search tests and confirm missing-page failures.
- [ ] Create local deterministic fixtures, candidate UI and intentional shared
  timer / stale-response defects. Document exact queries and delay behavior.
- [ ] Run the same tests with EXERCISE_VARIANT=broken and observe behavior failures.
- [ ] Create the solution with per-input timer closures and request identity;
  invalidate on input changes, including empty query. Document the solution.
- [ ] Run the focused tests with EXERCISE_VARIANT=fixed and confirm all pass.

## Task 3: responsive accessible agenda

Interfaces: agenda rows .agenda-row; content .agenda-content; action buttons
use data-action="join" and aria-pressed. Fixtures contain long spaced and
unbroken names. Both pages retain the same visible content.

- [ ] Add tests before pages: scroll width fits 320/1280 px; long text stays
  visible; Tab reaches native button; Enter/Space toggle aria-pressed;
  keyboard focus is visible; resized text does not overflow horizontally.
- [ ] Run the agenda tests and confirm missing-page failures.
- [ ] Create the broken page with clickable div and minimum-size overflow;
  document the candidate task without revealing the CSS fix.
- [ ] Run the same tests against the broken variant and confirm regressions.
- [ ] Create the fixed page with native buttons, shrinking flex content,
  appropriate wrapping and mobile layout. Add interviewer README.
- [ ] Run fixed tests and capture screenshots at 320/1280 px. Inspect them
  for clipping, overlapping controls and layout changes after activation.

## Task 4: exercise index and final verification

- [ ] Add links and question mapping to common.md; mark the three new pairs
  as runnable and the remaining Q/E workflows as not yet implemented.
- [ ] Update root README with direct HTML usage and test runner commands.
- [ ] Run the full fixed browser suite and confirm no assertion failures.
- [ ] Run the full broken suite and confirm the three exercises have at least
  one failure each in the corresponding behavior, using the same assertions.
- [ ] Check Markdown diagnostics, local links and node syntax for the runner.
- [ ] Review changes for answer leakage into candidate folders and accidental
  modifications to old exercises. Do not commit or start a persistent server.

## Execution Notes

Ruling: Chromium download blocks browser setup; use installed Edge through
PLAYWRIGHT_CHANNEL=msedge for the initial behavior checks. The same test suite
and assertions run against both variants. Candidate broken pages are fixtures;
fixed implementation starts only after observing their behavior failures.

## Execution Results

Task 1: complete. Delegation fixed passes 7/7 browser tests; candidate fails
four behavior checks for nested targets, dynamic rows and default actions.

Task 2: complete. Search fixed passes 7/7; candidate fails four checks for
timer sharing and stale success/error/clear handling. Browser clock is paused
before input so 299/300 ms assertions do not drift with real time.

Task 3: complete. Agenda fixed passes 6/6; candidate fails five checks for
mobile overflow, unbroken text, native keyboard controls, resize and sizing.
Screenshots at 320/1280 px were inspected; fixed content is visible and controls
do not overlap.

Task 4: complete. Full fixed suite: 20 pass, 0 fail/cancelled. Full candidate
suite: 7 pass, 13 intentional failures, 0 cancelled. Checks ran using installed
Edge via PLAYWRIGHT_CHANNEL=msedge. The default Chromium command remains blocked
until its browser download is completed; browser setup is not claimed verified.

Local links across eleven documents pass. Edited reference pages, tests and
index documents have no reported diagnostics. Independent read-only review
found no material defects. Git status shows only the two index documents and
new exercise/test/design folders changed; old exercise code was not modified.
No commit, branch or persistent server was created.

The earlier unchecked steps describe the original plan. Initial missing-page
checks were blocked by browser setup; observed failures on candidate fixtures
provided the actual red gates before each fixed implementation.


