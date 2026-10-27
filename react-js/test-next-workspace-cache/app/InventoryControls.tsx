"use client";

import { useFormStatus } from "react-dom";
import { receiveOne } from "./actions";
import type { Workspace } from "./inventory";

function ReceiveButton() {
  const { pending } = useFormStatus();
  return <button id="receive-one" type="submit" disabled={pending}>{pending ? "Receiving..." : "Receive one"}</button>;
}

export default function InventoryControls({ workspace, marker }: Readonly<{ workspace: Workspace; marker: string }>) {
  return (
    <form action={receiveOne} data-server-marker={marker}>
      <input type="hidden" name="workspace" value={workspace} />

      <ReceiveButton />
    </form>
  );
}
