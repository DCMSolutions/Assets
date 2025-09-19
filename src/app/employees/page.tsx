import { Title } from "~/components/title";
import { AddEmployeeDialog } from "./add-employee-dialog";
import { EmployeesDataTable } from "./employee-data-table";
import { EmployeesTableRecord, employeesTableColumns } from "./columns";
import { api } from "~/trpc/server";

export default async function Employees() {

  const employees = await api.employees.getAll.query()

  return (
    <section>
      <div className="flex pl-4 justify-between">
        <Title>Empleados</Title>
        <AddEmployeeDialog />
      </div>
      <div>
        <EmployeesDataTable columns={employeesTableColumns} data={employees!} />
      </div>
    </section>
  );
}
