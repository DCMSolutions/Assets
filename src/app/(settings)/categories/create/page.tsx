import { Title } from "~/components/title";
import Link from "next/link";
import CreateCategoryForm from "./create-category-form";

export default async function CreateCategoryPage() {

  return (
    <>
      <div className="flex justify-start">
        <Title><Link href={"/categories"}>Categorías de activos</Link></Title>
        <Title>{" > "}</Title>
        <Title>Crear nueva categoría</Title>
      </div>
      <CreateCategoryForm />
    </>
  );
}
