import { Title } from "~/components/title";
import { api } from "~/trpc/server";
import { PERMISO_ADMIN, tienePermiso } from "~/lib/permisos";
import { redirect } from "next/navigation";

export default async function GroupPage(props: { params: { groupId: string } }) {
  // const { perms } = await api.user.self.query();
  // if (!tienePermiso(perms, PERMISO_ADMIN)) {
  //   redirect("/accessdenied");
  // }

  const group = await api.employees.getById.query({ id: props.params.groupId });

  if (!group) {
    return <Title>Este empleado ya no existe</Title>;
  }

  return <GroupForm employee={group} />;
}
