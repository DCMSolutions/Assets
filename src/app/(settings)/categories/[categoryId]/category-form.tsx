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
import { Label } from "~/components/ui/label";
import CancelButton from "~/components/cancel-button";
import AcceptButton from "~/components/accept-button";

export default function CategoryForm({ category }: { category: Category }) {
  const [name, setName] = useState<string>(category.nombre);

  const { mutateAsync: editCategory, isLoading } = api.assets.categories.edit.useMutation();

  const router = useRouter();

  async function handleChange() {
    const nombre = name.trim()
    if (nombre === "") {
      toast.error("El nombre de la categoría no puede estar vacío.")
      setName(category.nombre)
      return
    }
    try {
      await editCategory({
        id: parseInt(category.id),
        nombre
      });
      toast.success("Categoría modificada correctamente.");
      router.push("/categories");
    } catch {
      toast.error("Ocurrió un error al intentar modificar la categoría.");
    }
  }

  return (
    <div className="flex justify-center">
      <Card className="p-16 w-[45rem] flex flex-col gap-4">

        <div className="flex items-center gap-2 flex-1">
          <Label htmlFor="name" className="font-bold">Nombre*</Label>
          <Input
            id="name"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex justify-between">
          <CancelButton
            onClick={() => { router.push("/categories") }}>
            Cancelar
          </CancelButton>
          <AcceptButton isLoading={isLoading} onClick={handleChange} >
            <span>Guardar</span>
          </AcceptButton>
        </div>
      </Card>
    </div>
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
