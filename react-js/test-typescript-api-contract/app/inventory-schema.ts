export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
}

export interface InventoryEnvelope {
  items: InventoryItem[];
}

export function parseInventory(payload: unknown): InventoryEnvelope {
  return payload as InventoryEnvelope;
}
