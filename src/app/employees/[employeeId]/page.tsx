import { Title } from "~/components/title";
import { api } from "~/trpc/server";
import { PERMISO_ADMIN, tienePermiso } from "~/lib/permisos";
import { redirect } from "next/navigation";
import EmployeeForm from "./employee-form";
import { Employee } from "~/server/api/routers/employees";

export default async function EmployeePage(props: { params: { employeeId: string } }) {
  // const { perms } = await api.user.self.query();
  // if (!tienePermiso(perms, PERMISO_ADMIN)) {
  //   redirect("/accessdenied");
  // }

  const employee: Employee = await api.employees.getById.query({ id: props.params.employeeId });

  if (!employee) {
    return <Title>Este empleado ya no existe</Title>;
  }

  return <EmployeeForm employee={employee} />;
}
