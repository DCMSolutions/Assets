"use client";

import { Loader2Icon, PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
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

  const [open, setOpen] = useState(false);

  const router = useRouter();

  async function handleCreate() {
    try {
      await createGroup({
        name,
        employeesToAssign
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
