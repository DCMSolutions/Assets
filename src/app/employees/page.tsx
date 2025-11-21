import { Title } from "~/components/title";
import { employeesTableColumns } from "./columns";
import { api } from "~/trpc/server";
import { DataTable } from "~/components/generic-table";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export default async function Employees() {

  const employees = await api.employees.getAllForTable.query()

  return (
    <section className="flex-grow">
      <div className="flex pl-4 justify-between">
        <Title>Usuarios</Title>
        <Link href={"/employees/create"} >
          <Button>Crear nuevo usuario</Button>
        </Link>
      </div>
      <div>
        <DataTable columns={employeesTableColumns} data={employees!} pathToRowPage="/employees" />
      </div>
    </section>
  );
}
