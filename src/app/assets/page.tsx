import { Title } from "~/components/title";
import { AddAssetDialog } from "./add-asset-dialog";
import { AssetsDataTable } from "./asset-data-table";
import { assetsTableColumns } from "./columns";
import { api } from "~/trpc/server";

export default async function Assets() {

  const assets = await api.assets.getAllForTable.query()
  const employees = await api.employees.getAllAsOptions.query()
  const categories = await api.assets.categories.getAllAsOptions.query()
  const states = await api.assets.getStatesAsOptions.query()
  const lockersAndBoxes = await api.assets.getLockersAndBoxes.query()

  return (
    <>
      <div className="flex pl-4 justify-between">
        <Title>Activos</Title>
        <AddAssetDialog
          employeeOptions={employees}
          categoryOptions={categories}
          stateOptions={states}
          lockersAndBoxes={lockersAndBoxes}
        />
      </div>
      <div>
        <AssetsDataTable columns={assetsTableColumns} data={assets!} />
      </div>
    </>
  );
}
