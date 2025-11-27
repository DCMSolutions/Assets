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

interface CreateEmployeeProps {
  groupsAsOptions: GroupOption[]
}
export default function CreateEmployeeForm({
  groupsAsOptions
}: CreateEmployeeProps) {
  const [id, setId] = useState<string>("");
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [mail, setMail] = useState<string>();
  const [phone, setPhone] = useState<string>();
  const [active, setActive] = useState<boolean>(true);

  const [selectedGroups, setSelectedGroups] = useState<string[]>([])

  const [legajo, setLegajo] = useState<string>();
  const [titulo, setTitulo] = useState<string>();

  const { mutateAsync: createEmployee, isLoading } = api.employees.create.useMutation();
  const { refetch: idIsUnique } = api.employees.checkId.useQuery({ id: id }, { enabled: false })

  const router = useRouter()

  async function handleChange() {
    function cleanForm() {
      setId("")
      setFirstName("")
      setLastName("")
      setMail("")
      setPhone("")
      setSelectedGroups([])
      setLegajo("")
      setTitulo("")
    }
    const cleanId = id.trim().split(" ").join("")
    if (cleanId.length < 3) {
      toast.error("Por favor asegúrese que el UID tenga al menos 3 caracteres no vacíos.")
      return
    }
    if (!firstName || !lastName) {
      toast.error("Por favor asegúrese de rellenar todos los campos obligatorios.")
      return
    }
    const { data: isValid } = await idIsUnique()
    if (!isValid) {
      toast.error("Este UID ya existe, por favor use uno diferente y único.")
      return
    }
    try {
      const groupIds: number[] = []
      selectedGroups.forEach((groupId) => {
        groupIds.push(parseInt(groupId))
      })
      await createEmployee({
        id: cleanId,
        nombre: firstName!,
        apellido: lastName!,
        mail,
        telefono: phone,
        groupIds,
        habilitado: active,
      });
      toast.success("Empleado creado correctamente.");
      cleanForm()
    } catch {
      toast.error("Ocurrió un error al intentar modificar el empleado.");
    }
  }


  return (
    <div className="flex justify-center">
      <Card className="p-16 w-[45rem] flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="rfid" className="font-bold">UID*</Label>
          <Input
            id="rfid"
            placeholder="UID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 flex-1">
          <Label htmlFor="firstName" className="font-bold">Nombre*</Label>
          <Input
            id="firstName"
            placeholder="Nombre"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 flex-1">
          <Label htmlFor="lastName" className="font-bold">Apellido*</Label>
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
            type="email"
            placeholder="Email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="phone" className="font-bold">Teléfono</Label>
          <Input
            id="phone"
            type="number"
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

        <div className="flex justify-between">
          <CancelButton
            onClick={() => { router.push("/employees") }}>
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
