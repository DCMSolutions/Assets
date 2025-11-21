import { Title } from "~/components/title";
import { api } from "~/trpc/server";
import { PERMISO_ADMIN, tienePermiso } from "~/lib/permisos";
import { redirect } from "next/navigation";
import AssetForm from "./asset-form";
import { AssetWithEmployeesAndGroups } from "~/server/api/routers/assets";
import DeleteAsset from "./delete-asset-dialog";
import Link from "next/link";

export default async function AssetPage(props: { params: { assetId: string } }) {
  // const { perms } = await api.user.self.query();
  // if (!tienePermiso(perms, PERMISO_ADMIN)) {
  //   redirect("/accessdenied");
  // }

  const assetWEG: AssetWithEmployeesAndGroups = await api.assets.getByIdWithEmployeesAndGroups.query({ id: props.params.assetId });

  if (!assetWEG) {
    return <Title>Este activo ya no existe</Title>;
  }

  const employees = await api.employees.getAllAsOptions.query()
  const groups = await api.employees.groups.getAllAsOptions.query()
  const categories = await api.assets.categories.getAllAsOptions.query()
  const states = await api.assets.getStatesAsOptions.query()
  const lockersAndBoxes = await api.assets.getLockersAndBoxes.query()

  return (
    <>
      <div className="flex justify-start">
        <Title><Link href={"/assets"}>Activos</Link></Title>
        <Title>{" > "}</Title>
        <Title>Editar activo</Title>
      </div>
      <AssetForm
        assetWEG={assetWEG}
        employeeOptions={employees}
        groupOptions={groups}
        categoryOptions={categories}
        stateOptions={states}
        lockersAndBoxes={lockersAndBoxes}
      />
    </>
  )
}
