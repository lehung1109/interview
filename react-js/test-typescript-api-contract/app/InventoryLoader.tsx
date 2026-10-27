"use client";

import { useState } from "react";
import { parseInventory } from "./inventory-schema";
import type { InventoryEnvelope } from "./inventory-schema";

type Phase = "idle" | "loading" | "success" | "empty" | "error";

export default function InventoryLoader() {
  const [scenario, setScenario] = useState("valid");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<InventoryEnvelope | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/inventory?scenario=${scenario}`);
      if (!response.ok) throw new Error("Service unavailable");
      const payload: unknown = await response.json();
      setData(parseInventory(payload));
      setLoading(false);
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : "Could not load inventory.");
    }
  }

  let phase: Phase = "idle";
  if (data) phase = data.items.length ? "success" : "empty";
  if (loading) phase = "loading";
  if (error) phase = "error";
  const messages: Record<Phase, string> = {
    idle: "No inventory loaded.",
    loading: "Loading inventory...",
    success: "Inventory loaded.",
    empty: "No inventory available.",
    error: "Could not load inventory.",
  };

  return (
    <main>
      <header>
        <p className="eyebrow">OPERATIONS / DATA</p>

        <h1>Inventory API</h1>
      </header>

      <div className="controls">
        <div>
          <label htmlFor="inventory-scenario">Response scenario</label>

          <select id="inventory-scenario" value={scenario} disabled={loading} onChange={event => setScenario(event.target.value)}>
            <option value="valid">Valid response</option>

            <option value="empty">Empty response</option>

            <option value="invalid">Invalid quantity</option>

            <option value="error">HTTP error</option>
          </select>
        </div>

        <button id="load-inventory" type="button" disabled={loading} onClick={load}>Load inventory</button>
      </div>

      <section className="inventory" aria-label="Inventory results">
        <output id="inventory-status" data-state={phase}>{messages[phase]}</output>

        {loading && <p id="inventory-loading">Loading...</p>}

        {error && <p id="inventory-error">{error}</p>}

        <ul id="inventory-items">
          {data?.items.map(item => <li key={item.id}><span>{item.name}</span><span>{item.quantity} units</span></li>)}
        </ul>

        {Boolean(data?.items.length) && <p>Total units: <output id="inventory-total">{data?.items.reduce((total, item) => total + item.quantity, 0)}</output></p>}
      </section>
    </main>
  );
}
