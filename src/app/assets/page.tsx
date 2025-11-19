import { Title } from "~/components/title";
import { AssetsDataTable } from "./asset-data-table";
import { assetsTableColumns } from "./columns";
import { api } from "~/trpc/server";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default async function Assets() {

  const assets = await api.assets.getAllForTable.query()

  return (
    <div className="flex-grow">
      <div className="flex pl-4 justify-between">
        <Title>Activos</Title>
        <Link href={"/assets/create"} >
          <Button>Dar de alta usuario</Button>
        </Link>
      </div>
      <div>
        <AssetsDataTable columns={assetsTableColumns} data={assets!} />
      </div>
    </div>
  );
}
