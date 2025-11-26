"use client";

import { CheckIcon, Loader2 } from "lucide-react";
import { MouseEventHandler, useEffect, useState } from "react";
import { Title } from "~/components/title";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { Card } from "~/components/ui/card";
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
import { Group } from "~/server/api/routers/groups";
import MultiSelect from "~/components/ui/multiselect";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { EmployeeOption } from "~/server/api/routers/employees";
import CancelButton from "~/components/cancel-button";
import AcceptButton from "~/components/accept-button";

interface GroupFormDrops {
  group: Omit<Group, "empleadosAsignados"> & { empleados: string[] },
  employeeOptions: EmployeeOption[]
}

export default function GroupForm({
  group,
  employeeOptions
}: GroupFormDrops) {
  const { mutateAsync: editGroup, isLoading: loadingMutation } = api.employees.groups.edit.useMutation();

  const [name, setName] = useState(group?.nombre!);
  const [description, setDescription] = useState<string | null>(group?.descripcion);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>(group.empleados)
  const [isAdmin, setIsAdmin] = useState<boolean>(group.esAdministrador)
  const [isService, setIsService] = useState<boolean>(group.esMantenimiento)

  const router = useRouter();

  async function handleEdit() {
    const toAssign: string[] = []
    const toUnassign: string[] = []
    selectedEmployees.forEach(selectedEmp => {
      const employeeInGroup = group.empleados.some(groupEmp => groupEmp === selectedEmp)
      if (!employeeInGroup) {
        toAssign.push(selectedEmp)
      }
    })
    group.empleados.forEach(empInGroup => {
      const employeeNotInGroup = selectedEmployees!.some(selectedEmp => selectedEmp === empInGroup)
      if (!employeeNotInGroup) {
        toUnassign.push(empInGroup)
      }
    })

    try {
      await editGroup({
        id: parseInt(group.id),
        nombre: name,
        toAssign,
        toUnassign,
        admin: isAdmin,
        mantenimiento: isService
      });
      toast.success("Grupo modificado correctamente.");
      router.push("/employees/groups");
    } catch {
      toast.error("Ocurrió un error al intentar modificar el grupo.");
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

        <div className="flex items-center gap-2 flex-1">
          <Label htmlFor="description" className="font-bold">Descripción</Label>
          <Input
            id="description"
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
            value={selectedEmployees}
            onChange={setSelectedEmployees}
            isLoading={!!employeeOptions}
            disabled={loadingMutation}
          />
        </div>

        <div className="flex justify-between">
          <CancelButton
            onClick={() => { router.push("/employees/groups") }}>
            Cancelar
          </CancelButton>
          <AcceptButton isLoading={loadingMutation} onClick={handleEdit} >
            <span>Guardar</span>
          </AcceptButton>
        </div>
      </Card>
    </div>
  );
}

function DeleteGroup(props: { groupId: string }) {
  const { mutateAsync: deleteGroup, isLoading } =
    api.employees.groups.delete.useMutation();

  const router = useRouter();

  const handleDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    deleteGroup({ id: parseInt(props.groupId) }).then(() => {
      toast.success("Grupo eliminado correctamente");
      router.push("/employees/groups");
    });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-[160px]">
          Eliminar grupo
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Está seguro que desea eliminar el grupo?
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

