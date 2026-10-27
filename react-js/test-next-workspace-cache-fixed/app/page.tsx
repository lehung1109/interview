import Link from "next/link";
import InventoryControls from "./InventoryControls";
import { getInventory, isWorkspace } from "./inventory";

export default async function Home({ searchParams }: Readonly<{ searchParams: Promise<Record<string, string | string[] | undefined>> }>) {
  const params = await searchParams;
  const workspace = isWorkspace(params.workspace) ? params.workspace : "studio";
  const item = await getInventory(workspace);

  return (
    <main>
      <header>
        <p className="eyebrow">OPERATIONS / INVENTORY</p>

        <h1>Inventory workspace</h1>
      </header>

      <nav className="workspaces" aria-label="Workspaces">
        <Link href="/?workspace=studio" prefetch={false} aria-current={workspace === "studio" ? "page" : undefined}>Studio</Link>

        <Link href="/?workspace=operations" prefetch={false} aria-current={workspace === "operations" ? "page" : undefined}>Operations</Link>
      </nav>

      <section className="inventory" aria-labelledby="item-name">
        <h2 id="item-name">{item.name}</h2>

        <dl>
          <dt>Available units</dt>

          <dd><output id="quantity">{item.quantity}</output> units</dd>
        </dl>

        <InventoryControls workspace={workspace} />
      </section>
    </main>
  );
}
