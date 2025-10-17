import { Title } from "~/components/title";
import { api } from "~/trpc/server";
import { PERMISO_ADMIN, tienePermiso } from "~/lib/permisos";
import { redirect } from "next/navigation";
import GroupForm from "./group-form";

export default async function GroupPage(props: { params: { groupId: string } }) {
  // const { perms } = await api.user.self.query();
  // if (!tienePermiso(perms, PERMISO_ADMIN)) {
  //   redirect("/accessdenied");
  // }

  const group = await api.employees.groups.getById.query({ id: parseInt(props.params.groupId) });

  if (!group) {
    return <Title>Este grupo ya no existe</Title>;
  }

  return <GroupForm group={group} />;
}
