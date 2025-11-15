"use client";

import { Loader2Icon, PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { asTRPCError } from "~/lib/errors";
import { CategoryOption } from "~/server/api/routers/categories";
import { api } from "~/trpc/react";

export function AddEmployeeDialog() {
  const { mutateAsync: createEmployee, isLoading } = api.employees.create.useMutation();

  const [id, setId] = useState<string>("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [active, setActive] = useState<boolean>(true);


  const [open, setOpen] = useState(false);

  const router = useRouter();

  async function handleCreate() {
    try {
      await createEmployee({
        id,
        nombre: lastName + ", " + firstName,
        mail: email,
        habilitado: active
      });

      toast.success("Empleado agregado correctamente");
      router.refresh();
      setOpen(false);
    } catch (e) {
      const error = asTRPCError(e)!;
      toast.error(error.message);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusCircleIcon className="mr-2" size={20} />
        Agregar Empleado
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agregar Usuario</DialogTitle>
          </DialogHeader>

          <Input
            id="id"
            placeholder="UID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <Input
            id="firstName"
            placeholder="Nombre"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            id="lastName"
            placeholder="Apellido"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <Input
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex space-x-2">
            <Checkbox id="active" defaultChecked disabled={isLoading}
              onCheckedChange={() => setActive(prev => !prev)}
            />
            <Label htmlFor="active">Habilitado</Label>
          </div>
          <DialogFooter>
            <Button disabled={isLoading} onClick={handleCreate}>
              {isLoading && (
                <Loader2Icon className="mr-2 animate-spin" size={20} />
              )}
              Agregar Empleado
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
