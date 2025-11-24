import { Title } from "~/components/title";
import { api } from "~/trpc/server";
import CreateGroupForm from "./create-group-form";
import Link from "next/link";

export default async function CreateGroupPage() {

  const employeeOptions = await api.employees.getAllAsOptions.query()

  return (
    <>
      <div className="flex justify-start">
        <Title><Link href={"/employees/groups"}>Grupos de usuarios</Link></Title>
        <Title>{" > "}</Title>
        <Title>Crear nuevo grupos de usuarios</Title>
      </div>
      <CreateGroupForm employeeOptions={employeeOptions} />
    </>
  );
}
