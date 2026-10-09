import assert from "node:assert/strict";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { after, before, describe, test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const variant = process.env.EXERCISE_VARIANT ?? "fixed";
const suffix = variant === "fixed" ? "-fixed" : "";
let browser;

before(async () => {
  assert.ok(["fixed", "broken"].includes(variant), "Unknown EXERCISE_VARIANT");
  const channel = process.env.PLAYWRIGHT_CHANNEL;
  browser = await chromium.launch(channel ? { channel } : {});
});

after(async () => {
  await browser?.close();
});

async function openExercise(context, folder, viewport = { width: 1280, height: 800 }) {
  const filename = path.join(root, folder + suffix, "index.html");
  assert.ok(existsSync(filename), "Missing exercise: " + filename);
  const page = await browser.newPage({ viewport });
  page.setDefaultTimeout(2000);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  context.after(async () => {
    await page.close();
    assert.deepEqual(errors, [], "Unexpected browser errors");
  });
  await page.goto(pathToFileURL(filename).href);
  return page;
}

async function addTask(page, name) {
  await page.locator("#task-name").fill(name);
  await page.locator("#task-form button").click();
}

describe("delegation", () => {
  test("Enter adds a task without losing the list", async context => {
    const page = await openExercise(context, "vanilla-js/test-script-event-delegation");
    await page.locator("#task-name").fill("Review invoice");
    await page.locator("#task-name").press("Enter");
    assert.equal(await page.locator("[data-task-id]").count(), 3);
    assert.match(await page.locator("#task-list").innerText(), /Review invoice/);
  });

  test("blank task names do not create a row", async context => {
    const page = await openExercise(context, "vanilla-js/test-script-event-delegation");
    await addTask(page, "   ");
    assert.equal(await page.locator("[data-task-id]").count(), 2);
  });

  test("clicking nested button content deletes an initial row", async context => {
    const page = await openExercise(context, "vanilla-js/test-script-event-delegation");
    await page.locator('[data-action="delete"] span').first().click();
    assert.equal(await page.locator("[data-task-id]").count(), 1);
  });

  test("new rows support nested delete clicks", async context => {
    const page = await openExercise(context, "vanilla-js/test-script-event-delegation");
    await addTask(page, "Review invoice");
    await page.locator('[data-task-id]:last-child [data-action="delete"] span').click();
    assert.equal(await page.locator("[data-task-id]").count(), 2);
    assert.doesNotMatch(await page.locator("#task-list").innerText(), /Review invoice/);
  });

  test("the stats link retains its navigation behavior", async context => {
    const page = await openExercise(context, "vanilla-js/test-script-event-delegation");
    await page.locator('a[href="#stats"]').click();
    assert.equal(new URL(page.url()).hash, "#stats");
  });

  test("task input remains text rather than executable markup", async context => {
    const page = await openExercise(context, "vanilla-js/test-script-event-delegation");
    await addTask(page, '<img src="bad" onerror="alert(1)">');
    assert.equal(await page.locator("#task-list img").count(), 0);
    assert.match(await page.locator("#task-list").innerText(), /<img/);
  });

  test("keyboard activation deletes newly added tasks", async context => {
    const page = await openExercise(context, "vanilla-js/test-script-event-delegation");
    await addTask(page, "Keyboard task");
    const button = page.locator('[data-task-id]:last-child [data-action="delete"]');
    await button.focus();
    await button.press("Enter");
    assert.equal(await page.locator("[data-task-id]").count(), 2);
  });
});

async function openSearch(context) {
  const page = await openExercise(context, "vanilla-js/test-script-search-race");
  await page.clock.install({ time: new Date("2026-10-09T09:00:00Z") });
  await page.clock.pauseAt(new Date("2026-10-09T09:00:01Z"));
  return page;
}

describe("search", () => {
  test("trailing debounce waits 300 ms after the last input", async context => {
    const page = await openSearch(context);
    await page.locator("#people-query").fill("a");
    await page.clock.runFor(299);
    assert.equal(await page.locator("#request-log li").count(), 0);
    await page.locator("#people-query").fill("an");
    await page.clock.runFor(299);
    assert.equal(await page.locator("#request-log li").count(), 0);
    await page.clock.runFor(1);
    assert.equal(await page.locator("#request-log li").count(), 1);
    await page.clock.runFor(120);
    assert.equal(await page.locator("#people-results li").count(), 2);
    assert.match(await page.locator("#people-results").innerText(), /Anna Nguyen/);
  });

  test("two search fields keep independent debounce timers", async context => {
    const page = await openSearch(context);
    await page.locator("#people-query").fill("an");
    await page.clock.runFor(200);
    await page.locator("#rooms-query").fill("room");
    await page.clock.runFor(100);
    assert.equal(await page.locator("#request-log li").count(), 1);
    await page.clock.runFor(400);
    assert.equal(await page.locator("#request-log li").count(), 2);
    assert.equal(await page.locator("#people-results li").count(), 2);
    assert.equal(await page.locator("#rooms-results li").count(), 2);
  });

  test("a stale success cannot replace the newer query results", async context => {
    const page = await openSearch(context);
    await page.locator("#people-query").fill("a");
    await page.clock.runFor(300);
    await page.locator("#people-query").fill("an");
    await page.clock.runFor(1000);
    assert.equal(await page.locator("#people-results li").count(), 2);
    assert.doesNotMatch(await page.locator("#people-results").innerText(), /Mark Lee/);
  });

  test("clearing input invalidates an in-flight response", async context => {
    const page = await openSearch(context);
    await page.locator("#people-query").fill("a");
    await page.clock.runFor(300);
    await page.locator("#people-query").fill("");
    assert.equal(await page.locator("#people-status").getAttribute("data-state"), "idle");
    await page.clock.runFor(1200);
    assert.equal(await page.locator("#people-results li").count(), 0);
    assert.equal(await page.locator("#request-log li").count(), 1);
  });

  test("a stale error cannot replace a newer success", async context => {
    const page = await openSearch(context);
    await page.locator("#people-query").fill("error");
    await page.clock.runFor(300);
    await page.locator("#people-query").fill("an");
    await page.clock.runFor(1200);
    assert.equal(await page.locator("#people-status").getAttribute("data-state"), "success");
    assert.equal(await page.locator("#people-results li").count(), 2);
  });

  test("loading, empty and error states are observable", async context => {
    const page = await openSearch(context);
    await page.locator("#people-query").fill("zzz");
    await page.clock.runFor(300);
    assert.equal(await page.locator("#people-status").getAttribute("data-state"), "loading");
    await page.clock.runFor(120);
    assert.equal(await page.locator("#people-status").getAttribute("data-state"), "empty");
    await page.locator("#people-query").fill("error");
    await page.clock.runFor(1200);
    assert.equal(await page.locator("#people-status").getAttribute("data-state"), "error");
  });

  test("matching trims whitespace and ignores letter case", async context => {
    const page = await openSearch(context);
    await page.locator("#people-query").fill(" AN ");
    await page.clock.runFor(420);
    assert.equal(await page.locator("#people-results li").count(), 2);
    await page.locator("#people-query").fill("   ");
    await page.clock.runFor(500);
    assert.equal(await page.locator("#request-log li").count(), 1);
    assert.equal(await page.locator("#people-results li").count(), 0);
  });
});

describe("agenda", () => {
  for (const width of [320, 1280]) {
    test(`agenda fits the ${width}px viewport`, async context => {
      const page = await openExercise(context, "css/test-css-responsive-agenda", { width, height: 900 });
      const dimensions = await page.evaluate(() => ({
        content: document.documentElement.scrollWidth,
        viewport: document.documentElement.clientWidth
      }));
      assert.ok(dimensions.content <= dimensions.viewport + 1, JSON.stringify(dimensions));
      const output = path.join(root, "tests/practical-exercises/test-results");
      mkdirSync(output, { recursive: true });
      await page.screenshot({ path: path.join(output, `agenda-${width}-${variant}.png`), fullPage: true });
    });
  }

  test("long unbroken titles wrap without hidden content", async context => {
    const page = await openExercise(context, "css/test-css-responsive-agenda", { width: 320, height: 900 });
    const title = page.locator(".agenda-title").last();
    const geometry = await title.evaluate(element => {
      const range = document.createRange();
      range.selectNodeContents(element);
      return {
        lines: range.getClientRects().length,
        overflow: getComputedStyle(element).overflow,
        left: element.getBoundingClientRect().left,
        right: element.getBoundingClientRect().right,
        viewport: window.innerWidth
      };
    });
    assert.ok(geometry.lines > 1, "Unbroken title must wrap");
    assert.notEqual(geometry.overflow, "hidden");
    assert.ok(geometry.left >= 0 && geometry.right <= geometry.viewport + 1);
  });

  test("Tab, Enter and Space operate a native join button", async context => {
    const page = await openExercise(context, "css/test-css-responsive-agenda");
    const button = page.locator('[data-action="join"]').first();
    assert.equal(await button.evaluate(element => element.tagName), "BUTTON");
    await page.keyboard.press("Tab");
    assert.equal(await button.evaluate(element => element === document.activeElement), true);
    const outline = await button.evaluate(element => ({
      width: Number.parseFloat(getComputedStyle(element).outlineWidth),
      style: getComputedStyle(element).outlineStyle
    }));
    assert.ok(outline.width > 0 && outline.style !== "none");
    await page.keyboard.press("Enter");
    assert.equal(await button.getAttribute("aria-pressed"), "true");
    await page.keyboard.press("Space");
    assert.equal(await button.getAttribute("aria-pressed"), "false");
  });

  test("resized text still reflows at mobile width", async context => {
    const page = await openExercise(context, "css/test-css-responsive-agenda", { width: 320, height: 900 });
    await page.evaluate(() => { document.documentElement.style.fontSize = "32px"; });
    const dimensions = await page.evaluate(() => ({
      content: document.documentElement.scrollWidth,
      viewport: document.documentElement.clientWidth
    }));
    assert.ok(dimensions.content <= dimensions.viewport + 1, JSON.stringify(dimensions));
  });

  test("joining does not resize its control", async context => {
    const page = await openExercise(context, "css/test-css-responsive-agenda");
    const button = page.locator('[data-action="join"]').first();
    const initial = await button.boundingBox();
    await button.click();
    const updated = await button.boundingBox();
    assert.equal(await button.getAttribute("aria-pressed"), "true");
    assert.equal(updated.width, initial.width);
    assert.equal(updated.height, initial.height);
  });
});
