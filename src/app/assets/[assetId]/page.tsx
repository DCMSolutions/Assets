import { Title } from "~/components/title";
import { api } from "~/trpc/server";
import { PERMISO_ADMIN, tienePermiso } from "~/lib/permisos";
import { redirect } from "next/navigation";
import AssetForm from "./asset-form";
import { Asset } from "~/server/api/routers/assets";

export default async function AssetPage(props: { params: { assetId: string } }) {
  // const { perms } = await api.user.self.query();
  // if (!tienePermiso(perms, PERMISO_ADMIN)) {
  //   redirect("/accessdenied");
  // }

  const asset: Asset = await api.assets.getById.query({ id: props.params.assetId });

  if (!asset) {
    return <Title>Este activo ya no existe</Title>;
  }

  const employees = await api.employees.getAllAsOptions.query()
  const categories = await api.assets.categories.getAllAsOptions.query()
  const states = await api.assets.getStatesAsOptions.query()
  const lockersAndBoxes = await api.assets.getLockersAndBoxes.query()

  return <AssetForm
    asset={asset}
    employeeOptions={employees}
    categoryOptions={categories}
    stateOptions={states}
    lockersAndBoxes={lockersAndBoxes}
  />;
}
