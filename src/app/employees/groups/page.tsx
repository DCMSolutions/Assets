import { Title } from "~/components/title";
import { groupsTableColumns } from "./columns";
import { api } from "~/trpc/server";
import { AddGroupDialog } from "./add-group-dialog";
import { DataTable } from "~/components/generic-table";

export default async function Groups() {

  const groups = await api.employees.groups.getAll.query()

  return (
    <section className="flex-grow">
      <div className="flex pl-4 justify-between">
        <Title>Groups</Title>
        <AddGroupDialog />
      </div>
      <div>
        <DataTable columns={groupsTableColumns} data={groups!} pathToRowPage="/employees/groups" />
      </div>
    </section>
  );
}
