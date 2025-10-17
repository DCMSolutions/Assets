"use client";

import { CheckIcon, Loader2 } from "lucide-react";
import { MouseEventHandler, useState } from "react";
import { Title } from "~/components/title";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Category } from "~/server/api/routers/categories";
import { Card } from "~/components/ui/card";

export default function CategoryForm({ category }: { category: Category }) {
  const [nombre, setNombre] = useState<string>(category.nombre);

  const { mutateAsync: editCategory, isLoading } = api.assets.categories.edit.useMutation();

  const router = useRouter();

  async function handleChange() {
    try {
      await editCategory({
        id: parseInt(category.id),
        nombre
      });
      toast.success("Categoría modificada correctamente.");
      router.refresh();
    } catch {
      toast.error("Ocurrió un error al intentar modificar la categoría.");
    }
  }

  return (
    <>
      <section className="space-y-2">
        <div className="flex justify-between">
          <Title>Modificar categoría</Title>
          <Button disabled={isLoading} onClick={handleChange}>
            {isLoading ? (
              <Loader2 className="mr-2 animate-spin" />
            ) : (
              <CheckIcon className="mr-2" />
            )}
            Aplicar cambios
          </Button>
        </div>

        <Card className="p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              id="nombre"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
        </Card>
        <div className="flex justify-end">
          <DeleteCategory categoryId={category?.id!} />
        </div>
      </section>
    </>
  );
}

function DeleteCategory(props: { categoryId: string }) {
  const { mutateAsync: deleteCategory, isLoading } = api.assets.categories.delete.useMutation();


  const router = useRouter();

  const handleDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    deleteCategory({ id: parseInt(props.categoryId) }).then(() => {
      toast.success("Categoría eliminada correctamente");
      router.push("/assets/categories");
    });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-[160px]">
          Eliminar categoría
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Está seguro que desea eliminar la categoría?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600 active:bg-red-700"
            onClick={handleDelete}
            disabled={isLoading}
          >
            Eliminar definitivamente
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
