"use client";

import { useState } from "react";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import CancelButton from "~/components/cancel-button";
import AcceptButton from "~/components/accept-button";

export default function CreateCategoryForm() {
  const [name, setName] = useState<string>("");

  const { mutateAsync: createCategory, isLoading } = api.assets.categories.create.useMutation();

  const router = useRouter();

  async function handleChange() {
    const nombre = name.trim()
    if (nombre === "") {
      toast.error("El nombre de la categoría no puede estar vacío.")
      return
    }
    try {
      await createCategory({
        nombre
      });
      toast.success("Categoría creada correctamente.");
      router.push("/categories");
    } catch {
      toast.error("Ocurrió un error al intentar crear una categoría.");
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
