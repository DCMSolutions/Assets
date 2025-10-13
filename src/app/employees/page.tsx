import { Title } from "~/components/title";
import { AddEmployeeDialog } from "./add-employee-dialog";
import { EmployeesDataTable } from "./employee-data-table";
import { employeesTableColumns } from "./columns";
import { api } from "~/trpc/server";
import { DataTable } from "~/components/generic-table";

export default async function Employees() {

  const employees = await api.employees.getAll.query()

  return (
    <section>
      <div className="flex pl-4 justify-between">
        <Title>Empleados</Title>
        <AddEmployeeDialog />
      </div>
      <div>
        <DataTable columns={employeesTableColumns} data={employees!} pathToRowPage="/employees" />
      </div>
    </section>
  );
}
