"use server";

import { redirect } from "next/navigation";
import { isWorkspace, receiveStock } from "./inventory";

export async function receiveOne(form: FormData) {
  const workspace = form.get("workspace");
  if (!isWorkspace(workspace)) throw new Error("Invalid workspace");
  await receiveStock(workspace);
  redirect(`/?workspace=${workspace}`);
}
