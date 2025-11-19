import { Title } from "~/components/title";
import { AddCategoryDialog } from "./add-category-dialog";
import { categoriesTableColumns } from "./columns";
import { api } from "~/trpc/server";
import { DataTable } from "~/components/generic-table";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default async function Categories() {

  const categories = await api.assets.categories.getAll.query()

  return (
    <section className="flex-grow">
      <div className="flex pl-4 justify-between">
        <Title>Categorías de activos</Title>
        <Link href={"/categories/create"} >
          <Button>Dar de alta usuario</Button>
        </Link>
      </div>
      <div>
        <DataTable columns={categoriesTableColumns} data={categories!} pathToRowPage="/categories" />
      </div>
    </section>
  );
}
