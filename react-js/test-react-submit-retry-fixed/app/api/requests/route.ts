import { NextResponse } from "next/server";
import { parseExpense } from "@/app/validation";
import type { ExpenseInput, Receipt } from "@/app/validation";

export const runtime = "nodejs";

type AttemptResult =
  | { ok: true; receipt: Receipt }
  | { ok: false; error: string };

interface Entry {
  payload: string;
  attempts: number;
  pending: Promise<AttemptResult> | null;
  receipt: Receipt | null;
}

const entries = new Map<string, Entry>();
let nextId = 1;

async function performAttempt(entry: Entry, value: ExpenseInput): Promise<AttemptResult> {
  const attempt = ++entry.attempts;
  await new Promise(resolve => setTimeout(resolve, 600));
  if (value.scenario === "fail-once" && attempt === 1) {
    return { ok: false, error: "Service temporarily unavailable. Retry this request." };
  }
  const receipt = { id: `EXP-${nextId++}`, ...value };
  entry.receipt = receipt;
  return { ok: true, receipt };
}

export async function POST(request: Request) {
  const key = request.headers.get("Idempotency-Key")?.trim();
  if (!key || key.length > 128) {
    return NextResponse.json({ error: "A valid Idempotency-Key is required." }, { status: 400 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const parsed = parseExpense(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: "Invalid request.", fieldErrors: parsed.errors }, { status: 400 });
  }
  const payload = JSON.stringify(parsed.value);
  let entry = entries.get(key);
  if (entry && entry.payload !== payload) {
    return NextResponse.json({ error: "This key belongs to a different payload." }, { status: 409 });
  }
  if (entry?.receipt) return NextResponse.json({ request: entry.receipt });
  if (!entry) {
    entry = { payload, attempts: 0, pending: null, receipt: null };
    entries.set(key, entry);
  }
  if (!entry.pending) entry.pending = performAttempt(entry, parsed.value);
  const pending = entry.pending;
  const result = await pending;
  if (entry.pending === pending) entry.pending = null;
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 503 });
  return NextResponse.json({ request: result.receipt });
}
