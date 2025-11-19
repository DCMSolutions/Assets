import { Title } from "~/components/title";

export default async function CreateCategoryPage() {

  return (
    <>
      <div>
        <Title>Crear nuevo usuario</Title>
      </div>
      <CreateCategoryForm />
    </>
  );
}
