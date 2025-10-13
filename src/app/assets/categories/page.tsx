import { Title } from "~/components/title";
import { AddCategoryDialog } from "./add-category-dialog";
import { CategoriesDataTable } from "./category-data-table";
import { categoriesTableColumns } from "./columns";
import { api } from "~/trpc/server";

export default async function Categories() {

  const categories = await api.assets.categories.getAll.query()

  return (
    <section>
      <div className="flex pl-4 justify-between">
        <Title>Categorías</Title>
        <AddCategoryDialog />
      </div>
      <div>
        <CategoriesDataTable columns={categoriesTableColumns} data={categories!} />
      </div>
    </section>
  );
}
