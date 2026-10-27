import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync } from "node:fs";
import { rm } from "node:fs/promises";
import net from "node:net";
import path from "node:path";
import { after, before, describe, test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const variant = process.env.EXERCISE_VARIANT ?? "fixed";
const group = process.env.NEXT_EXERCISE ?? "all";
const suffix = variant === "fixed" ? "-fixed" : "";
const folders = { cache: "test-next-workspace-cache", contract: "test-typescript-api-contract" };
const servers = new Map();
const owned = [];
let browser;

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
  const distDir = `.next/test-${port}-${randomUUID()}`;
  const child = spawn(process.execPath, [cli, "dev", "--hostname", "127.0.0.1", "--port", String(port)], {
    cwd: directory,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1", NEXT_EXERCISE_DISTDIR: distDir },
    stdio: ["ignore", "pipe", "pipe"]
  });
  owned.push({ child, output: path.join(directory, distDir) });
  await new Promise((resolve, reject) => {
    let log = "";
    const timeout = setTimeout(() => reject(new Error("Next startup timeout: " + log.slice(-3000))), 90000);
    const collect = chunk => {
      log += chunk.toString();
      if (/Ready in/.test(log)) { clearTimeout(timeout); resolve(); }
    };
    child.stdout.on("data", collect);
    child.stderr.on("data", collect);
    child.once("error", error => { clearTimeout(timeout); reject(error); });
    child.once("exit", code => { clearTimeout(timeout); reject(new Error(`Next exited ${code}: ${log.slice(-3000)}`)); });
  });
  servers.set(kind, `http://127.0.0.1:${port}`);
}

before(async () => {
  assert.ok(["broken", "fixed"].includes(variant));
  assert.ok(["cache", "contract", "all"].includes(group));
  const channel = process.env.PLAYWRIGHT_CHANNEL;
  browser = await chromium.launch(channel ? { channel } : {});
  for (const kind of Object.keys(folders)) {
    if (group === "all" || group === kind) await startServer(kind);
  }
});

async function loadInventory(page, scenario, phase) {
  await page.locator("#inventory-scenario").selectOption(scenario);
  await page.locator("#load-inventory").click();
  await page.waitForFunction(expected => document.querySelector("#inventory-status")?.getAttribute("data-state") === expected, phase);
}

describe("API contract loader", () => {
  if (group === "cache") return;

  test("valid payload renders typed inventory and total", async context => {
    const page = await openPage(context, "contract");
    await loadInventory(page, "valid", "success");
    assert.equal(await page.locator("#inventory-items li").count(), 1);
    assert.match(await page.locator("#inventory-items").innerText(), /Desk lamp/);
    assert.equal(await page.locator("#inventory-total").innerText(), "4");
  });

  test("empty payload has an empty state without error", async context => {
    const page = await openPage(context, "contract");
    await loadInventory(page, "empty", "empty");
    assert.equal(await page.locator("#inventory-items li").count(), 0);
    assert.equal(await page.locator("#inventory-error").count(), 0);
  });

  test("wrong runtime quantity produces contract error without data", async context => {
    const page = await openPage(context, "contract");
    await loadInventory(page, "invalid", "error");
    assert.equal(await page.locator("#inventory-items li").count(), 0);
    assert.equal(await page.locator("#inventory-total").count(), 0);
    assert.ok(await page.locator("#inventory-error").innerText());
    assert.equal(await page.locator("#inventory-loading").count(), 0);
  });

  test("HTTP error clears old data and ends loading", async context => {
    const page = await openPage(context, "contract");
    await loadInventory(page, "valid", "success");
    await loadInventory(page, "error", "error");
    assert.equal(await page.locator("#inventory-items li").count(), 0);
    assert.equal(await page.locator("#inventory-loading").count(), 0);
    assert.equal(await page.locator("#load-inventory").isDisabled(), false);
  });

  test("retry after error can return to a valid success state", async context => {
    const page = await openPage(context, "contract");
    await loadInventory(page, "error", "error");
    await loadInventory(page, "valid", "success");
    assert.equal(await page.locator("#inventory-total").innerText(), "4");
    assert.equal(await page.locator("#inventory-error").count(), 0);
  });

  test("loading is exclusive and locks controls", async context => {
    const page = await openPage(context, "contract");
    await loadInventory(page, "valid", "success");
    let release;
    const barrier = new Promise(resolve => { release = resolve; });
    await page.route("**/api/inventory?**", async route => { await barrier; await route.continue(); });
    await page.locator("#load-inventory").click();
    try {
      assert.equal(await page.locator("#inventory-status").getAttribute("data-state"), "loading");
      assert.equal(await page.locator("#inventory-items li").count(), 0);
      assert.equal(await page.locator("#inventory-error").count(), 0);
      assert.equal(await page.locator("#inventory-scenario").isDisabled(), true);
      assert.equal(await page.locator("#load-inventory").isDisabled(), true);
    } finally {
      release();
      await page.waitForFunction(() => document.querySelector("#inventory-status")?.getAttribute("data-state") !== "loading");
    }
  });

  for (const width of [320, 1280]) {
    test(`inventory loader fits ${width}px`, async context => {
      const page = await openPage(context, "contract", width);
      await loadInventory(page, "valid", "success");
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true);
      const output = path.join(root, "tests/practical-exercises/test-results");
      mkdirSync(output, { recursive: true });
      await page.screenshot({ path: path.join(output, `contract-${width}-${variant}.png`), fullPage: true });
    });
  }
});

describe("runtime inventory parser", () => {
  if (group === "cache") return;
  let parse;
  before(async () => {
    const module = await import(pathToFileURL(path.join(root, "react-js", folders.contract + suffix, "app/inventory-schema.ts")).href);
    parse = module.parseInventory;
  });

  test("accepts valid and empty envelopes", () => {
    assert.deepEqual(parse({ items: [{ id: "lamp", name: "Desk lamp", quantity: 4 }] }), { items: [{ id: "lamp", name: "Desk lamp", quantity: 4 }] });
    assert.deepEqual(parse({ items: [] }), { items: [] });
  });

  const invalid = [
    ["null envelope", null],
    ["missing items", {}],
    ["non-array items", { items: null }],
    ["string quantity", { items: [{ id: "lamp", name: "Desk lamp", quantity: "4" }] }],
    ["negative quantity", { items: [{ id: "lamp", name: "Desk lamp", quantity: -1 }] }],
    ["fractional quantity", { items: [{ id: "lamp", name: "Desk lamp", quantity: 1.5 }] }],
    ["numeric ID", { items: [{ id: 4, name: "Desk lamp", quantity: 4 }] }],
    ["empty ID", { items: [{ id: "", name: "Desk lamp", quantity: 4 }] }],
    ["numeric name", { items: [{ id: "lamp", name: 4, quantity: 4 }] }],
    ["empty name", { items: [{ id: "lamp", name: "", quantity: 4 }] }],
  ];
  for (const [name, payload] of invalid) {
    test(`rejects ${name}`, () => assert.throws(() => parse(payload)));
  }
});

after(async () => {
  await browser?.close();
  for (const { child, output } of owned) {
    if (child.exitCode === null && child.pid) {
      if (process.platform === "win32") {
        await new Promise(resolve => {
          const stop = spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
          stop.once("error", resolve);
          stop.once("close", resolve);
        });
      } else {
        child.kill("SIGTERM");
        await new Promise(resolve => child.once("exit", resolve));
      }
    }
    await rm(output, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  }
});

async function openPage(context, kind, width = 1280, query = "") {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  page.setDefaultTimeout(6000);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  context.after(async () => { await page.close(); assert.deepEqual(errors, [], "Unexpected browser errors"); });
  await page.goto(servers.get(kind) + query, { timeout: 90000 });
  await page.locator("h1").waitFor();
  return page;
}

async function quantity(page) {
  return Number(await page.locator("#quantity").innerText());
}

async function receiveOne(page) {
  const expected = await quantity(page) + 1;
  const response = page.waitForResponse(reply => reply.request().method() === "POST" && new URL(reply.url()).pathname === "/");
  await page.locator("#receive-one").click();
  await response;
  await page.waitForFunction(value => Number(document.querySelector("#quantity")?.textContent) === value, expected);
  return expected;
}

describe("workspace cache", () => {
  if (group === "contract") return;

  test("warm workspace cache stays isolated", async context => {
    const page = await openPage(context, "cache", 1280, "?workspace=studio");
    assert.equal(await page.locator("#item-name").innerText(), "Desk lamp");
    assert.equal(await quantity(page), 4);
    await page.locator('a[href="/?workspace=operations"]').click();
    await page.waitForURL("**/?workspace=operations");
    assert.equal(await page.locator("#item-name").innerText(), "Barcode scanner");
    assert.equal(await quantity(page), 7);
  });

  test("mutation reads its own fresh quantity and survives reload", async context => {
    const page = await openPage(context, "cache", 1280, "?workspace=studio");
    const expected = await receiveOne(page);
    await page.reload();
    assert.equal(await quantity(page), expected);
  });

  test("mutation changes only its workspace", async context => {
    const page = await openPage(context, "cache", 1280, "?workspace=operations");
    const operations = await quantity(page);
    await page.goto(servers.get("cache") + "?workspace=studio");
    await receiveOne(page);
    await page.goto(servers.get("cache") + "?workspace=operations");
    assert.equal(await quantity(page), operations);
    assert.equal(await page.locator("#item-name").innerText(), "Barcode scanner");
  });

  test("server-only marker is absent from HTML and DOM", async context => {
    const page = await openPage(context, "cache");
    const response = await page.request.get(servers.get("cache"));
    assert.ok(!(await response.text()).includes("DEMO_SERVER_TOKEN_ONLY_2026"));
    assert.ok(!(await page.content()).includes("DEMO_SERVER_TOKEN_ONLY_2026"));
  });

  test("receive action exposes a pending native control", async context => {
    const page = await openPage(context, "cache");
    const button = page.locator("#receive-one");
    assert.equal(await button.evaluate(element => element.tagName), "BUTTON");
    const response = page.waitForResponse(reply => reply.request().method() === "POST" && new URL(reply.url()).pathname === "/");
    await button.focus();
    await button.press("Enter");
    assert.equal(await button.isDisabled(), true);
    await response;
    await page.waitForFunction(() => !document.querySelector("#receive-one")?.disabled);
  });

  for (const width of [320, 1280]) {
    test(`workspace dashboard fits ${width}px`, async context => {
      const page = await openPage(context, "cache", width);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true);
      const output = path.join(root, "tests/practical-exercises/test-results");
      mkdirSync(output, { recursive: true });
      await page.screenshot({ path: path.join(output, `cache-${width}-${variant}.png`), fullPage: true });
    });
  }
});
