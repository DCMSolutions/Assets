"use client";

import { Loader2Icon, PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Selector from "~/components/selector";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { asTRPCError } from "~/lib/errors";
import { AssetState } from "~/server/api/routers/assets";
import { CategoryOption } from "~/server/api/routers/categories";
import { EmployeeOption } from "~/server/api/routers/employees";
import { api } from "~/trpc/react";
import { AddCategoryDialog } from "./add-category-dialog";

interface AddAssetDialogProps {
  categoryOptions: CategoryOption[],
  employeeOptions: EmployeeOption[],
  stateOptions: { value: string, label: AssetState }[],
  lockersAndBoxes: { nroSerieLocker: string, boxes: number[] }[]
}

export function AddAssetDialog({
  categoryOptions,
  employeeOptions,
  stateOptions,
  lockersAndBoxes
}: AddAssetDialogProps) {
  const { mutateAsync: createAsset, isLoading } = api.assets.create.useMutation();
  const { data: generatedTAG, isLoading: loadingTAG, refetch: regenerateTAG } =
    api.assets.generateTAG.useQuery(undefined, { enabled: false })

  const [id, setId] = useState<string | undefined>("");
  const [modelo, setModelo] = useState<string>("");
  const [idCategoria, setIdCategoria] = useState<string>("");
  const [idEmpleadoAsignado, setIdEmpleadoAsignado] = useState<string>("");
  const [idBoxAsignado, setIdBoxAsignado] = useState<string>("");
  const [nroSerieLocker, setNroSerieLocker] = useState<string>("");
  const [estado, setEstado] = useState<AssetState>("Funcional");

  const [open, setOpen] = useState(false);

  const [boxOptions, setBoxOptions] = useState<{ value: string, label: string }[]>([]);
  const [categories, setCategories] = useState<{ value: string, label: string }[]>(categoryOptions);

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

  const router = useRouter();

  useEffect(() => {
    if (!open) return
    regenerateTAG()
  }, [open])

  useEffect(() => {
    if (!open) return
    if (!loadingTAG) setId(generatedTAG)
  }, [generatedTAG, loadingTAG])

  async function handleCreate() {
    const box = idBoxAsignado === "" || idBoxAsignado === " "
      ? null
      : parseInt(idBoxAsignado)
    const locker = nroSerieLocker === "" || nroSerieLocker === " "
      ? null
      : nroSerieLocker
    const employee = idEmpleadoAsignado === "" || idEmpleadoAsignado === " "
      ? null
      : idEmpleadoAsignado
    try {
      await createAsset({
        id: id!,
        modelo,
        idCategoria: parseInt(idCategoria),
        idEmpleadoAsignado: employee,
        idBoxAsignado: box,
        nroSerieLocker: locker,
        estado: parseInt(estado as string)
      });

      toast.success("Activo agregado correctamente");
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
        Agregar Activo
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agregar Activo</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              id="id"
              value={id}
              disabled
              placeholder={"Generando TAG..."}
            />
            <Input
              id="modelo"
              placeholder="Modelo"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              required
            />
            <div className="flex gap-2">
              <Selector
                options={categories}
                value={idCategoria}
                onChange={(category) => setIdCategoria(category)}
                placeholder="Elegir categoría"
                required
              />
              <AddCategoryDialog onCreate={(newCategory) => {
                setCategories(prev => [...prev, { value: newCategory, label: newCategory }])
              }} />
            </div>
            <Selector
              options={employeeOptions}
              value={idEmpleadoAsignado ?? ""}
              onChange={selected => {
                if (selected === " ") {
                  setIdEmpleadoAsignado("")
                }
                else {
                  setIdEmpleadoAsignado(selected)
                }
              }}
              placeholder="Elegir empleado"
            />
            <div className="flex gap-2">
              <Selector
                options={lockerOptions}
                value={nroSerieLocker}
                onChange={selectedLocker => {
                  if (selectedLocker === " ") {
                    setIdBoxAsignado("")
                    setNroSerieLocker("")
                  }
                  else {
                    setBoxOptions(boxesAsOptionsByLocker(selectedLocker))
                    setNroSerieLocker(selectedLocker)
                    setIdBoxAsignado("")
                  }
                }}
                placeholder="Elegir locker"
              />
              <Selector
                options={boxOptions}
                value={idBoxAsignado}
                onChange={selected => {
                  if (selected === " ") {
                    setIdBoxAsignado("")
                  }
                  else {
                    setIdBoxAsignado(selected)
                  }
                }}
                placeholder="Elegir box"
              />
            </div>
            <Selector
              options={stateOptions}
              value={estado}
              onChange={state => setEstado(state as AssetState)}
              required
            />

          </div>
          <DialogFooter>
            <Button disabled={isLoading} onClick={handleCreate}>
              {isLoading && (
                <Loader2Icon className="mr-2 animate-spin" size={20} />
              )}
              Agregar Activo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
