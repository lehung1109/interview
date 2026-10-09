"use client";

import { useRef, useState } from "react";
import type { FormEvent, MouseEvent } from "react";
import { parseExpense } from "./validation";
import type { FieldErrors, Receipt } from "./validation";

type Phase = "idle" | "pending" | "invalid" | "error" | "success";

export default function ExpenseForm() {
  const [fields, setFields] = useState({ title: "", amount: "", scenario: "success" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const key = useRef<string | null>(null);

  function changeField(field: keyof typeof fields, value: string) {
    setFields(current => ({ ...current, [field]: value }));
    setFieldErrors({});
    setReceipt(null);
    setPhase("idle");
    key.current = null;
  }

  function validateClick(event: MouseEvent<HTMLButtonElement>) {
    const parsed = parseExpense({ ...fields, amount: Number(fields.amount) });
    if (!parsed.ok) {
      event.preventDefault();
      setFieldErrors(parsed.errors);
      setPhase("invalid");
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    key.current ??= crypto.randomUUID();
    setPhase("pending");
    setReceipt(null);
    setError("");
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": key.current },
        body: JSON.stringify({ ...fields, title: fields.title.trim(), amount: Number(fields.amount) }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not submit request.");
      setReceipt(result.request);
      setPhase("success");
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : "Could not submit request.");
      setFields(current => ({ ...current, title: "", amount: "" }));
      setPhase("error");
    }
  }

  const statusByPhase: Record<Phase, string> = {
    idle: "No request submitted.",
    pending: "Submitting request...",
    error,
    invalid: "Please review the highlighted fields.",
    success: "Request submitted.",
  };
  const actionByPhase: Partial<Record<Phase, string>> = {
    pending: "Submitting...",
    error: "Retry request",
  };

  return (
    <main>
      <header>
        <p className="eyebrow">OPERATIONS / FINANCE</p>

        <h1>Expense request</h1>
      </header>

      <form id="expense-form" className="expense-form" noValidate onSubmit={submit}>
        <div className="field">
          <label htmlFor="request-title">Request title</label>

          <input id="request-title" name="title" value={fields.title} onChange={event => changeField("title", event.target.value)} aria-invalid={Boolean(fieldErrors.title)} aria-describedby="title-error" />

          <p id="title-error" className="field-error" hidden={!fieldErrors.title}>{fieldErrors.title}</p>
        </div>

        <div className="field">
          <label htmlFor="request-amount">Amount USD</label>

          <input id="request-amount" name="amount" type="number" step="0.01" value={fields.amount} onChange={event => changeField("amount", event.target.value)} aria-invalid={Boolean(fieldErrors.amount)} aria-describedby="amount-error" />

          <p id="amount-error" className="field-error" hidden={!fieldErrors.amount}>{fieldErrors.amount}</p>
        </div>

        <div className="field">
          <label htmlFor="request-scenario">Scenario</label>

          <select id="request-scenario" name="scenario" value={fields.scenario} onChange={event => changeField("scenario", event.target.value)}>
            <option value="success">Success</option>

            <option value="fail-once">Fail first attempt</option>
          </select>
        </div>

        <button id="submit-expense" type="submit" onClick={validateClick}>{actionByPhase[phase] ?? "Submit request"}</button>

        <output id="submit-status" data-state={phase}>{statusByPhase[phase]}</output>

        {receipt && (
          <section className="receipt" aria-labelledby="receipt-title">
            <h2 id="receipt-title">Request receipt</h2>

            <p id="request-id">{receipt.id}</p>

            <p>{receipt.title}</p>

            <p>{receipt.amount.toFixed(2)} USD</p>
          </section>
        )}
      </form>
    </main>
  );
}
