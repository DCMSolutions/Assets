import { Title } from "~/components/title";
import { AddCategoryDialog } from "./add-category-dialog";
import { categoriesTableColumns } from "./columns";
import { api } from "~/trpc/server";
import { DataTable } from "~/components/generic-table";

export default async function Categories() {

  const categories = await api.assets.categories.getAll.query()

  return (
    <section>
      <div className="flex pl-4 justify-between">
        <Title>Categorías</Title>
        <AddCategoryDialog />
      </div>
      <div>
        <DataTable columns={categoriesTableColumns} data={categories!} pathToRowPage="/assets/categories" />
      </div>
    </section>
  );
}
