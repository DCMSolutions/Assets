"use client"

import { useState } from "react";
import { toast } from "sonner";
import AcceptButton from "~/components/accept-button";
import MultiSelect from "~/components/ui/multiselect";
import { Card } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { GroupOption } from "~/server/api/routers/groups";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import CancelButton from "~/components/cancel-button";
import { EmployeeOption } from "~/server/api/routers/employees";
import { asTRPCError } from "~/lib/errors";

interface CreateGroupFormProps {
  employeeOptions: EmployeeOption[]
}

export default function CreateGroupForm({
  employeeOptions
}: CreateGroupFormProps) {
  const { mutateAsync: createGroup, isLoading: disabled } = api.employees.groups.create.useMutation();

  const [name, setName] = useState("");
  const [employeesToAssign, setEmployeesToAssign] = useState<string[]>([])
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [isService, setIsService] = useState<boolean>(false)

  const [open, setOpen] = useState(false);

  const router = useRouter();

  async function handleCreate() {
    function cleanForm() {
      setName("")
      setEmployeesToAssign([])
      setIsAdmin(false)
      setIsService(false)
    }
    try {
      await createGroup({
        nombre: name,
        employeesToAssign,
        esAdministrador: isAdmin,
        esMantenimiento: isService
      });

      toast.success("Grupo agregado correctamente");
      cleanForm()
    } catch (e) {
      const error = asTRPCError(e)!;
      toast.error(error.message);
    }
  }

  return (
    <div className="flex justify-center">
      <Card className="p-16 w-[45rem] flex flex-col gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Label htmlFor="name" className="font-bold">Nombre de grupo*</Label>
          <Input
            id="name"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <Checkbox id="admin" checked={isAdmin} onCheckedChange={() => setIsAdmin(prev => !prev)} />
          <Label className="pl-2" htmlFor="admin">es grupo administrador</Label>
        </div>

        <div>
          <Checkbox id="service" checked={isService} onCheckedChange={() => setIsService(prev => !prev)} />
          <Label className="pl-2" htmlFor="service">es grupo de mantenimiento</Label>
        </div>

        <div className="flex items-center gap-2">
          <Label className="font-bold">Usuarios del grupo</Label>
          <MultiSelect
            options={employeeOptions}
            placeholder={"Asignar a grupos"}
            value={employeesToAssign}
            onChange={setEmployeesToAssign}
            isLoading={!!employeeOptions}
            disabled={disabled}
          />
        </div>

        <div className="flex justify-between">
          <CancelButton
            onClick={() => { router.push("/employees/groups") }}>
            Cancelar
          </CancelButton>
          <AcceptButton isLoading={disabled} onClick={handleCreate} >
            <span>Crear nuevo grupo</span>
          </AcceptButton>
        </div>
      </Card>
    </div>
  );
}
