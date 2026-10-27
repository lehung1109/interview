import "server-only";
import { unstable_cache } from "next/cache";

export type Workspace = "studio" | "operations";

export interface InventoryItem {
  workspace: Workspace;
  name: string;
  quantity: number;
}

type FixtureGlobal = typeof globalThis & { interviewWorkspaceInventory?: Map<Workspace, InventoryItem> };
const fixture = globalThis as FixtureGlobal;
const items = fixture.interviewWorkspaceInventory ??= new Map<Workspace, InventoryItem>([
  ["studio", { workspace: "studio", name: "Desk lamp", quantity: 4 }],
  ["operations", { workspace: "operations", name: "Barcode scanner", quantity: 7 }],
]);

export function isWorkspace(value: unknown): value is Workspace {
  return value === "studio" || value === "operations";
}

export function serverMarker() {
  return "DEMO_SERVER_TOKEN_ONLY_2026";
}

export function readInventory(workspace: Workspace) {
  const snapshot = items.get(workspace);
  if (!snapshot) throw new Error("Unknown workspace");
  return { ...snapshot };
}

export function getInventory(workspace: Workspace) {
  return unstable_cache(
    () => Promise.resolve(readInventory(workspace)),
    ["workspace-inventory", workspace],
    { tags: [`inventory-${workspace}`], revalidate: false },
  )();
}

export async function receiveStock(workspace: Workspace) {
  if (!serverMarker()) throw new Error("Server marker unavailable");
  await new Promise(resolve => setTimeout(resolve, 300));
  const current = readInventory(workspace);
  items.set(workspace, { ...current, quantity: current.quantity + 1 });
}
