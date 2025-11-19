"use client";

import { MouseEventHandler, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
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
import { Checkbox } from "~/components/ui/checkbox";
import { Employee } from "~/server/api/routers/employees";
import MultiSelect from "~/components/ui/multiselect";
import { GroupOption } from "~/server/api/routers/groups";
import AcceptButton from "~/components/accept-button";

interface EmployeeFormProps {
  employee: Employee,
  groupsAsOptions: GroupOption[]
}

export default function EmployeeForm({
  employee,
  groupsAsOptions
}: EmployeeFormProps) {
  const [id, _] = useState<string>(employee?.id!);
  const [firstName, setFirstName] = useState(employee.nombre);
  const [lastName, setLastName] = useState(employee.apellido);
  const [mail, setMail] = useState(employee?.mail ?? "");
  const [phone, setPhone] = useState<string>(employee?.telefono ?? "");
  const [active, setActive] = useState<boolean>(employee?.habilitado!);

  const [selectedGroups, setSelectedGroups] = useState<string[]>(employee?.grupos!)

  const [legajo, setLegajo] = useState<string>();
  const [titulo, setTitulo] = useState<string>();

  const { mutateAsync: EditEmployee, isLoading } = api.employees.edit.useMutation();

  async function handleChange() {
    const toAssign: number[] = []
    const toUnassign: number[] = []
    selectedGroups!.forEach(selectedG => {
      const alreadyAssigned = employee.grupos!.some(empGroup => empGroup === selectedG)
      if (!alreadyAssigned) {
        toAssign.push(parseInt(selectedG))
      }
    })
    employee.grupos!.forEach(groupOfEmp => {
      const notInGroup = selectedGroups!.some(selectedGroup => selectedGroup === groupOfEmp)
      if (!notInGroup) {
        toUnassign.push(parseInt(groupOfEmp))
      }
    })
    const cleanId = id.trim().split(" ").join("")
    if (cleanId.length < 3) {
      toast.error("Por favor asegúrese que el UID tenga al menos 3 caracteres no vacíos.")
      return
    }
    if (!firstName || !lastName) {
      toast.error("Por favor asegúrese de rellenar todos los campos obligatorios.")
      return
    }
    try {
      await EditEmployee({
        id,
        nombre: firstName!,
        apellido: lastName!,
        mail: mail,
        telefono: phone,
        habilitado: active,
        toAssign,
        toUnassign
      });
      toast.success("Empleado modificado correctamente.");
    } catch {
      toast.error("Ocurrió un error al intentar modificar el empleado.");
    }
  }

  return (
    <div className="flex justify-center">
      <Card className="p-16 w-[45rem] flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="rfid" className="font-bold">UID</Label>
          <Input
            id="rfid"
            placeholder="UID"
            value={id}
            onChange={() => { return }}
          />
        </div>

        <div className="flex items-center gap-2 flex-1">
          <Label htmlFor="firstName" className="font-bold">Nombre</Label>
          <Input
            id="firstName"
            placeholder="Nombre"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 flex-1">
          <Label htmlFor="lastName" className="font-bold">Apellido</Label>
          <Input
            id="lastName"
            placeholder="Apellido"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="mail" className="font-bold">Email</Label>
          <Input
            id="mail"
            placeholder="Email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="phone" className="font-bold">Teléfono</Label>
          <Input
            id="phone"
            placeholder="Teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Label className="font-bold">Grupos</Label>
          <MultiSelect
            options={groupsAsOptions}
            placeholder={"Asignar a grupos"}
            value={selectedGroups}
            onChange={setSelectedGroups}
            isLoading={!!groupsAsOptions}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="active" className="font-bold">Habilitado</Label>
          <Checkbox
            id="active"
            defaultChecked
            onCheckedChange={() => setActive(prev => !prev)}
          />
        </div>

        <div className="w-full bg-[#222D32] p-2">
          <span className="text-lg text-white">Información opcional</span>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="employee-number" className="font-bold">Número de empleado</Label>
          <Input
            id="employee-number"
            placeholder="Número de empleado"
            value={legajo}
            onChange={(e) => setLegajo(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="titulo" className="font-bold">Título</Label>
          <Input
            id="titulo"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="dept">Departamento</Label>
          <Input disabled={true} />
        </div>

        <div className="flex justify-end">
          <AcceptButton isLoading={isLoading} onClick={handleChange} >
            <span>Guardar</span>
          </AcceptButton>
        </div>
      </Card>
    </div>
  )
}

function DeleteEmployee(props: { employeeId: string }) {
  const { mutateAsync: deleteEmployee, isLoading } =
    api.employees.delete.useMutation();

  const router = useRouter();

  const handleDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    deleteEmployee({ id: props.employeeId }).then(() => {
      toast.success("Empleado eliminado correctamente");
      router.push("/employees");
    });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-[160px]">
          Eliminar empleado
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Está seguro que desea eliminar al empleado?
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
