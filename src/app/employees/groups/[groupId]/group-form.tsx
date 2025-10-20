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

export default function GroupForm({ group }: { group: Group }) {
  const { mutateAsync: editGroup, isLoading: loadingMutation } = api.employees.groups.edit.useMutation();

  const { data: employeeList, isLoading: loadingEmployees } = api.employees.getAll.useQuery()
  const { data: groupEmployeeList, isLoading: loadingGroupEmployees } =
    api.employees.groups.getEmployees.useQuery({ id: parseInt(group.id) })

  const employeeOptions = employeeList ? employeeList.map((employee) => {
    return {
      label: employee.nombre,
      value: employee.id
    }
  }) : undefined

  const [name, setName] = useState(group?.nombre!);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [isAdmin, setIsAdmin] = useState<boolean>(group.esAdministrador)
  const [isService, setIsService] = useState<boolean>(group.esMantenimiento)

  const router = useRouter();

  useEffect(() => {
    if (loadingGroupEmployees) return
    setSelectedEmployees(groupEmployeeList!.map(e => e.id))
  }, [loadingGroupEmployees, groupEmployeeList])

  async function handleChange() {
    const toAssign: string[] = []
    const toUnassign: string[] = []
    selectedEmployees!.forEach(selectedEmp => {
      const employeeInGroup = groupEmployeeList!.some(groupEmp => groupEmp.id === selectedEmp)
      if (!employeeInGroup) {
        toAssign.push(selectedEmp)
      }
    })
    groupEmployeeList!.forEach(empInGroup => {
      const employeeNotInGroup = selectedEmployees!.some(selectedEmp => selectedEmp === empInGroup.id)
      if (!employeeNotInGroup) {
        toUnassign.push(empInGroup.id)
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
      router.refresh();
    } catch {
      toast.error("Ocurrió un error al intentar modificar el grupo.");
    }
  }

  return (
    <>
      <section className="space-y-2">
        <div className="flex justify-between mr-4">
          <Title>Modificar grupo</Title>
          <Button disabled={loadingMutation || loadingGroupEmployees} onClick={handleChange}>
            {loadingMutation ? (
              <Loader2 className="mr-2 animate-spin" />
            ) : (
              <CheckIcon className="mr-2" />
            )}
            Aplicar cambios
          </Button>
        </div>

        <Card className="p-5">
          <div>
            <Input
              id="name"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-6 ">
            <MultiSelect
              options={employeeOptions}
              placeholder={
                loadingEmployees || loadingGroupEmployees
                  ? "Cargando empleados..."
                  : "Seleccione empleados"

              }
              value={selectedEmployees}
              onChange={setSelectedEmployees}
              isLoading={loadingGroupEmployees || loadingEmployees}
              disabled={loadingMutation}
            />
            <div>
              <Checkbox id="admin" checked={isAdmin} onCheckedChange={() => setIsAdmin(prev => !prev)} />
              <Label className="pl-2" htmlFor="admin">Grupo administrador</Label>
            </div>
            <div>
              <Checkbox id="service" checked={isService} onCheckedChange={() => setIsService(prev => !prev)} />
              <Label className="pl-2" htmlFor="service">Grupo de mantenimiento</Label>
            </div>
          </div>
        </Card>
        <div className="flex flex-row-reverse">
          <DeleteGroup groupId={group.id!} />
        </div>
      </section>
    </>
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
      router.push("/groups");
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

