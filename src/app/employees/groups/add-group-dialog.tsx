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
import MultiSelect from "~/components/ui/multiselect";
import { asTRPCError } from "~/lib/errors";
import { api } from "~/trpc/react";

export function AddGroupDialog() {
  const { mutateAsync: createGroup, isLoading: disabled } = api.employees.groups.create.useMutation();
  const { data: employeeList, isLoading } = api.employees.getAll.useQuery()
  const options = employeeList ? employeeList.map((employee) => {
    return {
      label: employee.nombre,
      value: employee.id
    }
  }) : undefined

  const [name, setName] = useState("");
  const [employeesToAssign, setEmployeesToAssign] = useState<string[]>([])
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [isService, setIsService] = useState<boolean>(false)

  const [open, setOpen] = useState(false);

  const router = useRouter();

  async function handleCreate() {
    try {
      await createGroup({
        nombre: name,
        employeesToAssign,
        esAdministrador: isAdmin,
        esMantenimiento: isService
      });

      toast.success("Grupo agregado correctamente");
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
        Agregar Grupo
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agregar Grupo</DialogTitle>
          </DialogHeader>

          <Input
            id="name"
            placeholder="Nombre del grupo"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <MultiSelect
            options={options}
            value={employeesToAssign}
            onChange={setEmployeesToAssign}
            placeholder={"Asignar empleados"}
            isLoading={isLoading}
            disabled={disabled}
          />
          <div>
            <Checkbox id="admin" checked={isAdmin} onCheckedChange={() => setIsAdmin(prev => !prev)} />
            <Label className="pl-2" htmlFor="admin">Grupo administrador</Label>
          </div>
          <div>
            <Checkbox id="service" checked={isService} onCheckedChange={() => setIsService(prev => !prev)} />
            <Label className="pl-2" htmlFor="service">Grupo de mantenimiento</Label>
          </div>
          <DialogFooter>
            <Button disabled={disabled || isLoading} onClick={handleCreate}>
              {disabled && (
                <Loader2Icon className="mr-2 animate-spin" size={20} />
              )}
              Agregar Grupo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
