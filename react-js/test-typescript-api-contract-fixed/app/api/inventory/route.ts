import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const scenario = new URL(request.url).searchParams.get("scenario") ?? "valid";
  await new Promise(resolve => setTimeout(resolve, 200));
  if (scenario === "error") return NextResponse.json({ message: "Service unavailable" }, { status: 503 });
  if (scenario === "empty") return NextResponse.json({ items: [] });
  if (scenario === "invalid") return NextResponse.json({ items: [{ id: "lamp", name: "Desk lamp", quantity: "4" }] });
  if (scenario !== "valid") return NextResponse.json({ message: "Unknown scenario" }, { status: 400 });
  return NextResponse.json({ items: [{ id: "lamp", name: "Desk lamp", quantity: 4 }] });
}
