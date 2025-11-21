import { Title } from "~/components/title";
import { api } from "~/trpc/server";
import CreateEmployeeForm from "./create-employee-form";
import Link from "next/link";

export default async function CreateEmployeePage() {

  const groups = await api.employees.groups.getAllAsOptions.query()

  return (
    <>
      <div className="flex justify-start">
        <Title><Link href={"/employees"}>Usuarios</Link></Title>
        <Title>{" > "}</Title>
        <Title>Crear nuevo usuario</Title>
      </div>
      <CreateEmployeeForm
        groupsAsOptions={groups}
      />
    </>
  );
}
