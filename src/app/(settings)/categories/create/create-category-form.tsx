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

export default function CreateCategorysForm() {
  const [id, setId] = useState<string>();
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [mail, setMail] = useState<string>();
  const [phone, setPhone] = useState<string>();
  const [active, setActive] = useState<boolean>(true);

  const [selectedGroups, setSelectedGroups] = useState<string[]>([])

  const [legajo, setLegajo] = useState<string>();
  const [titulo, setTitulo] = useState<string>();

  const { mutateAsync: createEmployee, isLoading } = api.employees.create.useMutation();

  async function handleChange() {
    function cleanForm() {
      setId("")
      setFirstName("")
      setLastName("")
      setMail("")
      setPhone("")
      setSelectedGroups([])
    }
    try {
      const groupIds: number[] = []
      selectedGroups.forEach((groupId) => {
        groupIds.push(parseInt(groupId))
      })
      await createEmployee({
        id: id!,
        nombre: firstName!,
        apellido: lastName!,
        mail,
        telefono: phone,
        groupIds,
        habilitado: active,
      });
      toast.success("Empleado modificado correctamente.");
      cleanForm()
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
            onChange={(e) => setId(e.target.value)}
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
          <Label htmlFor="email" className="font-bold">Email</Label>
          <Input
            id="email"
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
            <span>Crear usuario</span>
          </AcceptButton>
        </div>
      </Card>
    </div>
  );
}
