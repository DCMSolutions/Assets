import { Title } from "~/components/title";
import { api } from "~/trpc/server";
import { PERMISO_ADMIN, tienePermiso } from "~/lib/permisos";
import { redirect } from "next/navigation";
import CategoryForm from "./category-form";
import { Category } from "~/server/api/routers/categories";

export default async function categoryPage(props: { params: { categoryId: string } }) {
  // const { perms } = await api.user.self.query();
  // if (!tienePermiso(perms, PERMISO_ADMIN)) {
  //   redirect("/accessdenied");
  // }

  const category: Category | undefined = await api.assets.categories.getById.query({ id: parseInt(props.params.categoryId) });

  if (!category) {
    return <Title>Esta categoría ya no existe</Title>;
  }

  return <CategoryForm category={category} />;
}
