"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import Selector from "~/components/selector";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { asTRPCError } from "~/lib/errors";
import { CategoryOption } from "~/server/api/routers/categories";
import { EmployeeOption } from "~/server/api/routers/employees";
import { api } from "~/trpc/react";
import { AddCategoryDialog } from "~/app/(settings)/categories/add-category-dialog";
import { nanoid } from "nanoid";
import { GroupOption } from "~/server/api/routers/groups";
import MultiSelect from "~/components/ui/multiselect";
import { Card } from "~/components/ui/card";
import AcceptButton from "~/components/accept-button";
import { Button } from "~/components/ui/button";
import { RefreshCw } from "lucide-react";
import CancelButton from "~/components/cancel-button";
import { useRouter } from "next/navigation";

interface AddAssetDialogProps {
  categoryOptions: CategoryOption[],
  employeeOptions: EmployeeOption[],
  groupOptions: GroupOption[],
  stateOptions: { value: string, label: string }[],
  lockersAndBoxes: { nroSerieLocker: string, boxes: number[] }[]
}

export default function CreateAssetForm({
  categoryOptions,
  employeeOptions,
  groupOptions,
  stateOptions,
  lockersAndBoxes
}: AddAssetDialogProps) {
  const { mutateAsync: createAsset, isLoading } = api.assets.create.useMutation();

  const [id, setId] = useState<string>("");
  const [tagDisabled, setTagDisabled] = useState<boolean>(true);
  const [serial, setSerial] = useState<string>("");
  const [modelo, setModelo] = useState<string>("");
  const [idCategoria, setIdCategoria] = useState<string>("");
  const [categories, setCategories] = useState<CategoryOption[]>(categoryOptions);
  const [idEmpleadoAsignado, setIdEmpleadoAsignado] = useState<string>("");
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [idBoxAsignado, setIdBoxAsignado] = useState<string>("");
  const [nroSerieLocker, setNroSerieLocker] = useState<string>("");
  const [estado, setEstado] = useState<string>("0");
  const [active, setActive] = useState<boolean>(true);

  const [boxOptions, setBoxOptions] = useState<{ value: string, label: string }[]>([]);
  const [boxDisabled, setBoxDisabled] = useState<boolean>(true);

  const { refetch: idIsUnique } = api.assets.checkId.useQuery({ id: id }, { enabled: false })
  const router = useRouter()

  const lockerOptions = lockersAndBoxes
    ? lockersAndBoxes.map(item => {
      return { value: item.nroSerieLocker, label: item.nroSerieLocker }
    })
    : []

  const boxesAsOptionsByLocker = (locker: string) => {
    const boxes = lockersAndBoxes.find(item => item.nroSerieLocker === locker)?.boxes
    const boxesAsOptions = boxes!.map(box => {
      return { value: box.toString(), label: box.toString() }
    })
    return boxesAsOptions
  }

  useEffect(() => {
    const tag = nanoid(10)
    setId(tag)
  }, [])

  async function handleCreate() {
    const { data: isValid } = await idIsUnique()
    if (!isValid) {
      toast.error("Este TAG ya existe, por favor introduzca uno diferente y único o genere uno aleatorio.")
      return
    }
    const box = idBoxAsignado === "" || idBoxAsignado === " "
      ? null
      : parseInt(idBoxAsignado)
    const locker = nroSerieLocker === "" || nroSerieLocker === " "
      ? null
      : nroSerieLocker
    const employee = idEmpleadoAsignado === "" || idEmpleadoAsignado === " "
      ? null
      : idEmpleadoAsignado
    const groupsToAssign = selectedGroups.map(group => parseInt(group))
    function cleanForm() {
      setId("")
      setSerial("")
      setModelo("")
      setIdCategoria("")
      setIdEmpleadoAsignado("")
      setSelectedGroups([])
      setIdBoxAsignado("")
      setNroSerieLocker("")
      setEstado("0")
      setActive(true)
      setBoxOptions([])
      setBoxDisabled(true)
    }
    try {
      await createAsset({
        id: id!,
        numeroDeSerie: serial,
        modelo,
        idCategoria: parseInt(idCategoria),
        idEmpleadoAsignado: employee,
        idBoxAsignado: box,
        nroSerieLocker: locker,
        estado: parseInt(estado),
        habilitado: active,
        groupsToAssign
      });

      toast.success("Activo agregado correctamente");
      cleanForm()
    } catch (e) {
      const error = asTRPCError(e)!;
      toast.error(error.message);
    }
  }

  return (
    <div className="flex justify-center">
      <Card className="p-16 w-[45rem] flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="id" className="font-bold">TAG*</Label>
          <Input
            id="id"
            value={id}
            placeholder="Generando TAG"
            disabled={tagDisabled}
            onChange={(e) => setId(e.target.value)}
          />
          <Button title="Generar nuevo TAG" onClick={() => {
            const tag = nanoid(10)
            setId(tag)
          }}>
            <RefreshCw />
          </Button>
          <Checkbox
            id="tag-modify"
            onCheckedChange={() => setTagDisabled(prev => !prev)}
          />
          <Label htmlFor="tag-modify" className="font-bold">Elegir TAG manualmente</Label>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="serial" className="font-bold">Número de serie</Label>
          <Input
            id="serial"
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 flex-1">
          <Label htmlFor="modelo" className="font-bold">Modelo</Label>
          <Input
            id="modelo"
            placeholder="Modelo"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 flex-1">
          <Label className="font-bold">Categoría*</Label>
          <Selector
            options={categories}
            value={idCategoria}
            onChange={setIdCategoria}
            placeholder="Elegir categoría"
          />
        </div>

        <div className="flex items-center gap-2">
          <Label className="font-bold">Asignar a usuario</Label>
          <Selector
            options={employeeOptions}
            value={idEmpleadoAsignado}
            onChange={setIdEmpleadoAsignado}
            placeholder="Elegir usuario"
          />
        </div>

        <div className="flex items-center gap-2">
          <Label className="font-bold">Asignar a grupos de usuarios</Label>
          <MultiSelect
            options={groupOptions}
            placeholder={"Asignar a grupos"}
            value={selectedGroups}
            onChange={setSelectedGroups}
            isLoading={!!groupOptions}
          />
        </div>

        <div className="flex items-center gap-2">
          <Label className="font-bold">Locker</Label>
          <Selector
            options={lockerOptions}
            value={nroSerieLocker}
            onChange={selectedLocker => {
              if (selectedLocker === " ") {
                setNroSerieLocker("")
                setIdBoxAsignado("")
                setBoxDisabled(true)
              } else {
                setNroSerieLocker(selectedLocker)
                setIdBoxAsignado("")
                setBoxDisabled(false)
                setBoxOptions(boxesAsOptionsByLocker(selectedLocker))
              }
            }}
            placeholder="Elegir locker"
          />
          <Label className="font-bold">Box</Label>
          <Selector
            options={boxOptions}
            value={idBoxAsignado ?? ""}
            disabled={boxDisabled}
            onChange={setIdBoxAsignado}
            placeholder={boxDisabled
              ? "Elegir locker para ver los boxes disponibles"
              : "Elegir box"
            }
          />
        </div>

        <div className="flex items-center gap-2">
          <Label className="font-bold">Estado*</Label>
          <Selector
            options={stateOptions}
            value={estado}
            onChange={setEstado}
            placeholder="Elegir estado"
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="active" className="font-bold">Habilitado</Label>
          <Checkbox
            id="active"
            defaultChecked
            onCheckedChange={() => setActive(prev => !prev)}
            disabled
          />
        </div>

        <div className="flex justify-between">
          <CancelButton
            onClick={() => { router.push("/assets") }}>
            Cancelar
          </CancelButton>
          <AcceptButton isLoading={isLoading} onClick={handleCreate}>
            <span>Guardar</span>
          </AcceptButton>
        </div>
      </Card>
    </div>
  );
}
