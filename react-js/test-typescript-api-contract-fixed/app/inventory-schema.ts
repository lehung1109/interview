import { z } from "zod";

const inventoryItem = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  quantity: z.number().int().nonnegative(),
});

const inventoryEnvelope = z.object({ items: z.array(inventoryItem) });

export type InventoryItem = z.infer<typeof inventoryItem>;
export type InventoryEnvelope = z.infer<typeof inventoryEnvelope>;

export function parseInventory(payload: unknown): InventoryEnvelope {
  const result = inventoryEnvelope.safeParse(payload);
  if (!result.success) throw new Error("Invalid inventory response.");
  return result.data;
}
