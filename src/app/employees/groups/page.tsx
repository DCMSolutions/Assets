import { Title } from "~/components/title";
import { groupsTableColumns } from "./columns";
import { api } from "~/trpc/server";
import { DataTable } from "~/components/generic-table";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default async function Groups() {

  const groups = await api.employees.groups.getAll.query()

  return (
    <section className="flex-grow">
      <div className="flex pl-4 justify-between">
        <Title>Grupos de usuarios</Title>
        <Link href={"/employees/groups/create"} >
          <Button>Crear nuevo grupo</Button>
        </Link>
      </div>
      <div>
        <DataTable columns={groupsTableColumns} data={groups!} pathToRowPage="/employees/groups" />
      </div>
    </section>
  );
}
