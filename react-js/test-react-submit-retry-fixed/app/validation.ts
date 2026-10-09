export interface ExpenseInput {
  title: string;
  amount: number;
  scenario: "success" | "fail-once";
}

export interface Receipt extends ExpenseInput {
  id: string;
}

export type FieldErrors = Partial<Record<"title" | "amount" | "scenario", string>>;

export type ParseResult =
  | { ok: true; value: ExpenseInput }
  | { ok: false; errors: FieldErrors };

export function parseExpense(input: unknown): ParseResult {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { ok: false, errors: { title: "Request must be an object." } };
  }
  const fields = input as Record<string, unknown>;
  const title = typeof fields.title === "string" ? fields.title.trim() : "";
  const amount = fields.amount;
  const scenario = fields.scenario;
  const validTitle = title.length >= 3 && title.length <= 80;
  const validAmount = typeof amount === "number" && Number.isFinite(amount) && amount > 0 && amount <= 10000;
  const validScenario = scenario === "success" || scenario === "fail-once";
  if (validTitle && validAmount && validScenario) {
    return { ok: true, value: { title, amount, scenario } };
  }
  const errors: FieldErrors = {};
  if (!validTitle) errors.title = "Use a title of 3-80 characters.";
  if (!validAmount) errors.amount = "Enter an amount above 0 and at most 10000.";
  if (!validScenario) errors.scenario = "Select a valid scenario.";
  return { ok: false, errors };
}
