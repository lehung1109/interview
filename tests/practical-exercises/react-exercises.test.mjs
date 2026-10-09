import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync } from "node:fs";
import net from "node:net";
import path from "node:path";
import { after, before, describe, test } from "node:test";
import { fileURLToPath } from "node:url";
import { chromium, request } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const variant = process.env.EXERCISE_VARIANT ?? "fixed";
const group = process.env.REACT_EXERCISE ?? "all";
const suffix = variant === "fixed" ? "-fixed" : "";
const folders = { draft: "test-react-draft-board", submit: "test-react-submit-retry" };
const servers = new Map();
const children = [];
let browser;
let api;

function freePort() {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const port = probe.address().port;
      probe.close(() => resolve(port));
    });
  });
}

async function startServer(kind) {
  const directory = path.join(root, "react-js", folders[kind] + suffix);
  const cli = path.join(directory, "node_modules/next/dist/bin/next");
  assert.ok(existsSync(cli), "Install dependencies first: " + directory);
  const port = await freePort();
  const child = spawn(process.execPath, [cli, "dev", "--hostname", "127.0.0.1", "--port", String(port)], {
    cwd: directory,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
    stdio: ["ignore", "pipe", "pipe"]
  });
  children.push(child);
  await new Promise((resolve, reject) => {
    let log = "";
    const timeout = setTimeout(() => reject(new Error("Next startup timeout: " + log.slice(-3000))), 90000);
    const collect = chunk => {
      log += chunk.toString();
      if (/Ready in/.test(log)) {
        clearTimeout(timeout);
        resolve();
      }
    };
    child.stdout.on("data", collect);
    child.stderr.on("data", collect);
    child.once("error", error => { clearTimeout(timeout); reject(error); });
    child.once("exit", code => { clearTimeout(timeout); reject(new Error(`Next exited ${code}: ${log.slice(-3000)}`)); });
  });
  servers.set(kind, `http://127.0.0.1:${port}`);
}

before(async () => {
  assert.ok(["fixed", "broken"].includes(variant));
  assert.ok(["draft", "submit", "all"].includes(group));
  const channel = process.env.PLAYWRIGHT_CHANNEL;
  browser = await chromium.launch(channel ? { channel } : {});
  for (const kind of Object.keys(folders)) {
    if (group === "all" || group === kind) await startServer(kind);
  }
  if (servers.has("submit")) api = await request.newContext({ baseURL: servers.get("submit") });
});

after(async () => {
  await api?.dispose();
  await browser?.close();
  for (const child of children) {
    if (child.exitCode !== null || !child.pid) continue;
    if (process.platform === "win32") {
      await new Promise(resolve => {
        const stop = spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
        stop.once("error", resolve);
        stop.once("close", resolve);
      });
    } else {
      child.kill("SIGTERM");
    }
  }
});

async function fillExpense(page, scenario = "success") {
  await page.locator("#request-title").fill("Team training");
  await page.locator("#request-amount").fill("100.25");
  await page.locator("#request-scenario").selectOption(scenario);
}

async function waitForPhase(page, phase) {
  await page.waitForFunction(expected => document.querySelector("#submit-status")?.getAttribute("data-state") === expected, phase);
}

function captureSubmissions(page) {
  const calls = [];
  page.on("request", submission => {
    if (submission.method() !== "POST" || new URL(submission.url()).pathname !== "/api/requests") return;
    calls.push({ key: submission.headers()["idempotency-key"], body: submission.postDataJSON() });
  });
  return calls;
}

const validExpense = { title: "Team training", amount: 100.25, scenario: "success" };

describe("submit workflow", () => {
  if (group === "draft") return;

  for (const activation of ["click", "Enter"]) {
    test(`${activation} submits valid data without document navigation`, async context => {
      const page = await openPage(context, "submit");
      await fillExpense(page);
      let navigations = 0;
      page.on("framenavigated", frame => { if (frame === page.mainFrame()) navigations++; });
      if (activation === "click") await page.locator("#submit-expense").click();
      else await page.locator("#request-amount").press("Enter");
      await waitForPhase(page, "success");
      assert.ok(await page.locator("#request-id").innerText());
      assert.equal(navigations, 0);
    });
  }

  for (const activation of ["click", "requestSubmit"]) {
    test(`invalid ${activation} shows field errors without API request`, async context => {
      const page = await openPage(context, "submit");
      const calls = captureSubmissions(page);
      if (activation === "click") await page.locator("#submit-expense").click();
      else await page.locator("#expense-form").evaluate(form => form.requestSubmit());
      await page.locator("#title-error").waitFor({ state: "visible" });
      assert.equal(await page.locator("#request-title").getAttribute("aria-invalid"), "true");
      assert.equal(calls.length, 0);
    });
  }

  test("two synchronous submits start only one request", async context => {
    const page = await openPage(context, "submit");
    await fillExpense(page);
    const calls = captureSubmissions(page);
    await page.locator("#expense-form").evaluate(form => { form.requestSubmit(); form.requestSubmit(); });
    await waitForPhase(page, "success");
    assert.equal(calls.length, 1);
  });

  test("pending locks fields, scenario and submit control", async context => {
    const page = await openPage(context, "submit");
    await fillExpense(page);
    await page.locator("#submit-expense").click();
    await waitForPhase(page, "pending");
    for (const selector of ["#request-title", "#request-amount", "#request-scenario", "#submit-expense"]) {
      assert.equal(await page.locator(selector).isDisabled(), true, selector);
    }
    await waitForPhase(page, "success");
  });

  test("failure retains values and retry reuses key and payload", async context => {
    const page = await openPage(context, "submit");
    await fillExpense(page, "fail-once");
    const calls = captureSubmissions(page);
    await page.locator("#submit-expense").click();
    await waitForPhase(page, "error");
    assert.equal(await page.locator("#request-title").inputValue(), "Team training");
    assert.equal(await page.locator("#request-amount").inputValue(), "100.25");
    await page.locator("#submit-expense").click();
    await waitForPhase(page, "success");
    assert.equal(calls.length, 2);
    assert.ok(calls[0].key);
    assert.equal(calls[1].key, calls[0].key);
    assert.deepEqual(calls[1].body, calls[0].body);
  });

  test("API rejects invalid payloads even without client validation", async () => {
    for (const body of [{ ...validExpense, amount: 0 }, { ...validExpense, title: "ab" }, { ...validExpense, scenario: "invalid" }]) {
      const response = await api.post("/api/requests", { data: body, headers: { "Idempotency-Key": randomUUID() } });
      assert.equal(response.status(), 400);
    }
    const missingKey = await api.post("/api/requests", { data: validExpense });
    assert.equal(missingKey.status(), 400);
  });

  test("concurrent equal requests and replay share one receipt", async () => {
    const options = { data: validExpense, headers: { "Idempotency-Key": randomUUID() } };
    const responses = await Promise.all([api.post("/api/requests", options), api.post("/api/requests", options)]);
    assert.equal(responses[0].status(), 200);
    assert.equal(responses[1].status(), 200);
    const first = (await responses[0].json()).request;
    const second = (await responses[1].json()).request;
    assert.equal(first.id, second.id);
    const replay = await api.post("/api/requests", options);
    assert.equal((await replay.json()).request.id, first.id);
    assert.equal(first.title, "Team training");
  });

  test("same key with changed payload returns conflict without changing receipt", async () => {
    const headers = { "Idempotency-Key": randomUUID() };
    const first = await api.post("/api/requests", { data: validExpense, headers });
    const receipt = (await first.json()).request;
    const conflict = await api.post("/api/requests", { data: { ...validExpense, amount: 200 }, headers });
    assert.equal(conflict.status(), 409);
    const replay = await api.post("/api/requests", { data: validExpense, headers });
    assert.equal((await replay.json()).request.id, receipt.id);
  });

  test("failed first attempt can retry and replay without duplicate receipt", async () => {
    const options = { data: { ...validExpense, scenario: "fail-once" }, headers: { "Idempotency-Key": randomUUID() } };
    const first = await api.post("/api/requests", options);
    assert.equal(first.status(), 503);
    const retry = await api.post("/api/requests", options);
    assert.equal(retry.status(), 200);
    const receipt = (await retry.json()).request;
    const replay = await api.post("/api/requests", options);
    assert.equal(replay.status(), 200);
    assert.equal((await replay.json()).request.id, receipt.id);
  });

  for (const width of [320, 1280]) {
    test(`expense form fits ${width}px viewport`, async context => {
      const page = await openPage(context, "submit", width);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true);
      const output = path.join(root, "tests/practical-exercises/test-results");
      mkdirSync(output, { recursive: true });
      await page.screenshot({ path: path.join(output, `submit-${width}-${variant}.png`), fullPage: true });
    });
  }
});

async function openPage(context, kind, width = 1280) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  page.setDefaultTimeout(5000);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  context.after(async () => {
    await page.close();
    assert.deepEqual(errors, [], "Unexpected browser errors");
  });
  await page.goto(servers.get(kind), { timeout: 90000 });
  await page.locator("h1").waitFor();
  return page;
}

async function pauseClock(page) {
  await page.clock.install({ time: new Date("2026-10-09T09:00:00Z") });
  await page.clock.pauseAt(new Date("2026-10-09T09:00:01Z"));
}

function projectRow(page, id) {
  return page.locator(`[data-project-id="${id}"]`);
}

describe("draft board", () => {
  if (group === "submit") return;

  test("server refresh updates pristine draft", async context => {
    const page = await openPage(context, "draft");
    await page.locator("#refresh-server").click();
    assert.equal(await projectRow(page, "atlas").locator("input").inputValue(), "Atlas onboarding (v2)");
  });

  test("server refresh preserves dirty draft and discard uses newest title", async context => {
    const page = await openPage(context, "draft");
    const row = projectRow(page, "atlas");
    await row.locator("input").fill("Atlas local draft");
    await page.locator("#refresh-server").click();
    assert.equal(await row.locator("input").inputValue(), "Atlas local draft");
    await row.locator('[data-action="discard"]').click();
    assert.equal(await row.locator("input").inputValue(), "Atlas onboarding (v2)");
    assert.equal(await row.getAttribute("data-dirty"), "false");
  });

  test("reorder preserves each project draft by ID", async context => {
    const page = await openPage(context, "draft");
    await projectRow(page, "atlas").locator("input").fill("Atlas local draft");
    await page.locator("#reverse-order").click();
    assert.equal(await projectRow(page, "atlas").locator("input").inputValue(), "Atlas local draft");
    assert.equal(await projectRow(page, "cypress").locator("input").inputValue(), "Cypress migration");
  });

  test("check waits 250 ms and stays idle after completion", async context => {
    const page = await openPage(context, "draft");
    await pauseClock(page);
    const row = projectRow(page, "atlas");
    await row.locator("input").fill("Atlas edited");
    await page.clock.runFor(249);
    assert.equal(await row.locator(".draft-checks").innerText(), "0");
    await page.clock.runFor(1);
    assert.equal(await row.locator(".draft-checks").innerText(), "1");
    await page.clock.runFor(1000);
    assert.equal(await row.locator(".draft-checks").innerText(), "1");
  });

  test("rapid input checks only the final draft", async context => {
    const page = await openPage(context, "draft");
    await pauseClock(page);
    const row = projectRow(page, "atlas");
    await row.locator("input").fill("Atlas first edit");
    await page.clock.runFor(100);
    await row.locator("input").fill("Atlas final edit");
    await page.clock.runFor(250);
    assert.equal(await row.locator(".draft-checks").innerText(), "1");
    assert.equal(await row.locator(".last-checked").innerText(), "Atlas final edit");
  });

  test("unrelated refresh and reorder do not repeat checks", async context => {
    const page = await openPage(context, "draft");
    await pauseClock(page);
    await projectRow(page, "atlas").locator("input").fill("Atlas dirty");
    await page.clock.runFor(250);
    await page.locator("#refresh-server").click();
    await page.locator("#reverse-order").click();
    await page.clock.runFor(1000);
    assert.equal(await projectRow(page, "atlas").locator(".draft-checks").innerText(), "1");
  });

  for (const width of [320, 1280]) {
    test(`draft board fits ${width}px viewport`, async context => {
      const page = await openPage(context, "draft", width);
      const fits = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
      assert.equal(fits, true);
      const output = path.join(root, "tests/practical-exercises/test-results");
      mkdirSync(output, { recursive: true });
      await page.screenshot({ path: path.join(output, `draft-${width}-${variant}.png`), fullPage: true });
    });
  }
});
