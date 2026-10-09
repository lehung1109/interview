import { NextResponse } from "next/server";
import { parseExpense } from "@/app/validation";

export const runtime = "nodejs";

const attempts = new Map<string, number>();
let nextId = 1;

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
  const attempt = (attempts.get(key) ?? 0) + 1;
  attempts.set(key, attempt);
  await new Promise(resolve => setTimeout(resolve, 600));
  if (parsed.value.scenario === "fail-once" && attempt === 1) {
    return NextResponse.json({ error: "Service temporarily unavailable. Retry this request." }, { status: 503 });
  }
  return NextResponse.json({ request: { id: `EXP-${nextId++}`, ...parsed.value } });
}
