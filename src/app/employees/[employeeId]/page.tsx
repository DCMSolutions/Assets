import { Title } from "~/components/title";
import { api } from "~/trpc/server";
import { PERMISO_ADMIN, tienePermiso } from "~/lib/permisos";
import { redirect } from "next/navigation";
import EmployeeForm from "./employee-form";
import { Employee } from "~/server/api/routers/employees";
import DeleteEmployee from "./delete-employee-dialog";

export default async function EmployeePage(props: { params: { employeeId: string } }) {
  // const { perms } = await api.user.self.query();
  // if (!tienePermiso(perms, PERMISO_ADMIN)) {
  //   redirect("/accessdenied");
  // }

  const employee: Employee = await api.employees.getByIdWithGroups.query({ id: props.params.employeeId });
  // console.log(employee)
  const groups = await api.employees.groups.getAllAsOptions.query()

  if (!employee) {
    return <Title>Este empleado ya no existe</Title>;
  }

  return (
    <>
      <div className="flex justify-between">
        <Title>Editar usuario</Title>
        <DeleteEmployee employeeId={employee.id} />
      </div>
      <EmployeeForm employee={employee} groupsAsOptions={groups} />;
    </>
  )
}
