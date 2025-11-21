import { Title } from "~/components/title";
import { api } from "~/trpc/server";
import CreateAssetForm from "./create-asset-form";
import Link from "next/link";

export default async function CreateAssetPage() {

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
        <Title>Crear nuevo activo</Title>
      </div>
      <CreateAssetForm
        employeeOptions={employees}
        groupOptions={groups}
        categoryOptions={categories}
        stateOptions={states}
        lockersAndBoxes={lockersAndBoxes}
      />
    </>
  );
}
