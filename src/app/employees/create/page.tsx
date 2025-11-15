import { Title } from "~/components/title";
import { api } from "~/trpc/server";
import CreateEmployeeForm from "./create-employee-form";

export default async function CreateEmployeePage() {

  const groups = await api.employees.groups.getAllAsOptions.query()

  return (
    <>
      <div>
        <Title>Crear nuevo usuario</Title>
      </div>
      <CreateEmployeeForm
        groupsAsOptions={groups}
      />
    </>
  );
}
