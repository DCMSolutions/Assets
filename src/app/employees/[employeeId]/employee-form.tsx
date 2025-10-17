"use client";

import { CheckIcon, Loader2 } from "lucide-react";
import { MouseEventHandler, useState } from "react";
import { Title } from "~/components/title";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
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

export default function EmployeeForm({ employee }: { employee: Employee }) {
  const [id, setId] = useState<string>(employee?.id!);
  const [firstName, setFirstName] = useState(employee.nombre.split(", ")[1]);
  const [lastName, setLastName] = useState(employee.nombre.split(", ")[0]);
  const [email, setEmail] = useState(employee?.email!);
  const [active, setActive] = useState<boolean>(employee?.active!);

  const { mutateAsync: editEmployee, isLoading } = api.employees.edit.useMutation();

  const router = useRouter();

  async function handleChange() {
    try {
      await editEmployee({
        id,
        nombre: `${lastName}, ${firstName}`,
        mail: email,
        habilitado: active
      });
      toast.success("Empleado modificado correctamente.");
      router.refresh();
    } catch {
      toast.error("Ocurrió un error al intentar modificar el empleado.");
    }
  }

  return (
    <>
      <section className="space-y-2">
        <div className="flex justify-between">
          <Title>Modificar empleado</Title>
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
              id="rfid"
              placeholder="RFID"
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
              <Checkbox id="active" checked={active} disabled={isLoading}
                onCheckedChange={() => setActive(prev => !prev)}
              />
              <Label htmlFor="active">Habilitado</Label>
            </div>
          </div>
        </Card>
        <div className="flex justify-end">
          <DeleteEmployee employeeId={employee?.id!} />
        </div>
      </section>
    </>
  );
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
