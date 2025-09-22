import { Title } from "~/components/title";
import { employeesTableColumns } from "./columns";
import { api } from "~/trpc/server";
import { AddGroupDialog } from "./add-group-dialog";
import { GroupsDataTable } from "./groups-data-table";

export default async function Groups() {

  const groups = await api.employees.groups.getAll.query()

  return (
    <section>
      <div className="flex pl-4 justify-between">
        <Title>Groups</Title>
        <AddGroupDialog />
      </div>
      <div>
        <GroupsDataTable columns={employeesTableColumns} data={groups!} />
      </div>
    </section>
  );
}
