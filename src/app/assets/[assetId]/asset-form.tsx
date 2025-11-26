"use client";

import { useRouter } from "next/navigation";
import { MouseEventHandler, useEffect, useState } from "react";
import { toast } from "sonner";
import AcceptButton from "~/components/accept-button";
import MultiSelect from "~/components/ui/multiselect";
import { PrintQRDialog } from "~/components/print-qr-dialog";
import Selector from "~/components/selector";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { asTRPCError } from "~/lib/errors";
import { AssetWithEmployeesAndGroups } from "~/server/api/routers/assets";
import { CategoryOption } from "~/server/api/routers/categories";
import { AddCategoryDialog } from "~/app/(settings)/categories/add-category-dialog";
import { EmployeeOption } from "~/server/api/routers/employees";
import { GroupOption } from "~/server/api/routers/groups";
import { api } from "~/trpc/react";
import { Checkbox } from "~/components/ui/checkbox";

interface AssetFormProps {
  assetWEG: AssetWithEmployeesAndGroups,
  categoryOptions: CategoryOption[],
  employeeOptions: EmployeeOption[],
  groupOptions: GroupOption[],
  stateOptions: { value: string, label: string }[],
  lockersAndBoxes: { nroSerieLocker: string, boxes: number[] }[]
}

export default function AssetForm({
  assetWEG,
  categoryOptions,
  employeeOptions,
  groupOptions,
  stateOptions,
  lockersAndBoxes
}: AssetFormProps) {
  const { mutateAsync: editAsset, isLoading: loadingEdition } = api.assets.edit.useMutation();
  const { mutateAsync: assignToEmployee, isLoading: loadingAssignment } = api.assets.assignToEmployee.useMutation();
  const { mutateAsync: unassignToEmployee, isLoading: loadingUnassignment } = api.assets.unassignToEmployee.useMutation();

  const [id, _] = useState<string>(assetWEG.asset.id);
  const [serial, setSerial] = useState<string>(assetWEG.asset.numeroDeSerie ?? "");
  const [modelo, setModelo] = useState<string>(assetWEG.asset.modelo);
  const [idCategoria, setIdCategoria] = useState<string>(assetWEG.asset.idCategoria);
  const [categories, setCategories] = useState<CategoryOption[]>(categoryOptions);
  const [idEmpleadoAsignado, setIdEmpleadoAsignado] = useState<string>(assetWEG.asset.idEmpleadoAsignado ?? "");
  const [idBoxAsignado, setIdBoxAsignado] = useState<string>(assetWEG.asset.idBoxAsignado ?? "");
  const [nroSerieLocker, setNroSerieLocker] = useState<string>(assetWEG.asset.nroSerieLocker ?? "");
  const [estado, setEstado] = useState<string>(assetWEG.asset.estado);
  const [active, setActive] = useState<boolean>(true);

  const [boxOptions, setBoxOptions] = useState<{ value: string, label: string }[]>([]);
  const [boxDisabled, setBoxDisabled] = useState<boolean>(assetWEG.asset.nroSerieLocker ? false : true);

  const [selectedGroups, setSelectedGroups] = useState<string[]>(assetWEG.groups ?? [])

  const router = useRouter();

  const lockerOptions = lockersAndBoxes.map(item => {
    return { value: item.nroSerieLocker, label: item.nroSerieLocker }
  })

  const boxesAsOptionsByLocker = (locker: string) => {
    const boxes = lockersAndBoxes.find(item => item.nroSerieLocker === locker)?.boxes
    if (!boxes) {
      return []
    }
    const boxesAsOptions = boxes!.map(box => {
      return { value: box.toString(), label: box.toString() }
    })
    if (locker === assetWEG.asset.nroSerieLocker) {
      boxesAsOptions.push({ value: assetWEG.asset.idBoxAsignado!, label: assetWEG.asset.idBoxAsignado! })
    }
    return boxesAsOptions
  }

  useEffect(() => {
    setBoxOptions(boxesAsOptionsByLocker(assetWEG.asset.nroSerieLocker!))
    setIdBoxAsignado(assetWEG.asset.idBoxAsignado!)
  }, [])

  async function handleEdit() {
    const toAssign: string[] = []
    const toUnassign: string[] = []
    selectedGroups!.forEach(selectedG => {
      const groupWasNotAssigned = assetWEG.groups.some(group => group === selectedG)
      if (!groupWasNotAssigned) {
        toAssign.push(selectedG)
      }
    })
    assetWEG.groups.forEach(group => {
      const groupIsNoLongerAssigned = selectedGroups!.some(selectedG => selectedG === group)
      if (!groupIsNoLongerAssigned) {
        toUnassign.push(group)
      }
    })

    const box = idBoxAsignado
      ? parseInt(idBoxAsignado)
      : null
    try {
      await editAsset({
        id,
        numeroDeSerie: serial,
        modelo,
        idCategoria: parseInt(idCategoria!),
        idEmpleadoAsignado,
        idBoxAsignado: box,
        nroSerieLocker,
        estado: parseInt(estado!),
        habilitado: active,
        groupsToAssign: toAssign.map(g => parseInt(g)),
        groupsToUnassign: toUnassign.map(g => parseInt(g)),
      });

      if (assetWEG.asset.idEmpleadoAsignado) {
        if (!idEmpleadoAsignado || (idEmpleadoAsignado && (idEmpleadoAsignado !== assetWEG.asset.idEmpleadoAsignado))) {
          await unassignToEmployee({ asset: assetWEG.asset.id, employee: assetWEG.asset.idEmpleadoAsignado })
        }
      }
      if (idEmpleadoAsignado) {
        if (!assetWEG.asset.idEmpleadoAsignado || (assetWEG.asset.idEmpleadoAsignado && (assetWEG.asset.idEmpleadoAsignado !== idEmpleadoAsignado))) {
          await assignToEmployee({ asset: assetWEG.asset.id, employee: idEmpleadoAsignado })
        }
      }

      toast.success("Activo modificado correctamente");
      router.push("/assets");
    } catch (e) {
      const error = asTRPCError(e)!;
      toast.error(error.message);
    }
  }

  return (
    <div className="flex justify-center">
      <Card className="p-16 w-[45rem] flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="id" className="font-bold">TAG</Label>
          <Input
            id="id"
            value={id}
            disabled
          />
          <PrintQRDialog value={id} label={`N.º de serie: ${serial}`} />
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
          <Label className="font-bold">Categoría</Label>
          <Selector
            options={categories}
            value={idCategoria}
            onChange={setIdCategoria}
            placeholder="Elegir categoría"
          />
        </div>

        <div className="flex items-center gap-2">
          <Label className="font-bold">Asignar a empleado</Label>
          <Selector
            options={employeeOptions}
            value={idEmpleadoAsignado}
            onChange={setIdEmpleadoAsignado}
            placeholder="Elegir empleado"
          />
        </div>

        <div className="flex items-center gap-2">
          <Label className="font-bold">Asignar a grupos de empleados</Label>
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
          <Label className="font-bold">Estado</Label>
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

        <div className="flex justify-end">
          <AcceptButton isLoading={loadingEdition || loadingAssignment || loadingUnassignment} onClick={handleEdit}>
            <span>Guardar</span>
          </AcceptButton>
        </div>
      </Card>
    </div>
  )
}
