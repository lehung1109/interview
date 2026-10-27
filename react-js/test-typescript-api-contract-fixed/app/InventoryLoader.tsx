"use client";

import { useState } from "react";
import { parseInventory } from "./inventory-schema";
import type { InventoryEnvelope } from "./inventory-schema";

type InventoryState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "empty" }
  | { status: "error"; message: string }
  | { status: "success"; data: InventoryEnvelope };

type Phase = InventoryState["status"];

export default function InventoryLoader() {
  const [scenario, setScenario] = useState("valid");
  const [state, setState] = useState<InventoryState>({ status: "idle" });

  async function load() {
    setState({ status: "loading" });
    try {
      const response = await fetch(`/api/inventory?scenario=${scenario}`);
      if (!response.ok) throw new Error("Service unavailable");
      const payload: unknown = await response.json();
      const data = parseInventory(payload);
      setState(data.items.length ? { status: "success", data } : { status: "empty" });
    } catch (error_) {
      setState({ status: "error", message: error_ instanceof Error ? error_.message : "Could not load inventory." });
    }
  }

  const phase = state.status;
  const loading = state.status === "loading";
  const error = state.status === "error" ? state.message : "";
  const data = state.status === "success" ? state.data : null;
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
