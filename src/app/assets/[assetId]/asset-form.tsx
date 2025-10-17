"use client";

import { CheckIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { MouseEventHandler, useState } from "react";
import { toast } from "sonner";
import Selector from "~/components/selector";
import { Title } from "~/components/title";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { asTRPCError } from "~/lib/errors";
import { Asset, AssetState } from "~/server/api/routers/assets";
import { CategoryOption } from "~/server/api/routers/categories";
import { EmployeeOption } from "~/server/api/routers/employees";
import { api } from "~/trpc/react";

function DeleteAsset(props: { assetId: string }) {
  const { mutateAsync: deleteAsset, isLoading } =
    api.assets.delete.useMutation();

  const router = useRouter();

  const handleDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    deleteAsset({ id: props.assetId }).then(() => {
      toast.success("Activo eliminado correctamente");
      router.push("/assets");
    });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-[160px]">
          Eliminar activo
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Está seguro que desea eliminar al activo?
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

interface AssetFormProps {
  asset: Asset,
  categoryOptions: CategoryOption[],
  employeeOptions: EmployeeOption[],
  stateOptions: { value: string, label: AssetState }[],
  lockersAndBoxes: { locker: string, boxes: number[] }[]
}

export default function AssetForm({
  asset,
  categoryOptions,
  employeeOptions,
  stateOptions,
  lockersAndBoxes
}: AssetFormProps) {
  const { mutateAsync: editAsset, isLoading: loadingEdition } = api.assets.edit.useMutation();

  const [id, _] = useState<string>(asset.id);
  const [modelo, setModelo] = useState<string>(asset.modelo);
  const [idCategoria, setIdCategoria] = useState<string>(asset.idCategoria);
  const [idEmpleadoAsignado, setIdEmpleadoAsignado] = useState<string>(asset.idEmpleadoAsignado ?? "");
  const [idBoxAsignado, setIdBoxAsignado] = useState<string>(asset.idBoxAsignado ?? "");
  const [nroSerieLocker, setNroSerieLocker] = useState<string>(asset.nroSerieLocker ?? "");
  const [estado, setEstado] = useState<AssetState>(asset.estado);

  const [boxOptions, setBoxOptions] = useState<{ value: string, label: string }[]>([]);
  const [boxDisabled, setBoxDisabled] = useState<boolean>(asset.nroSerieLocker ? false : true);

  const router = useRouter();

  const lockerOptions = lockersAndBoxes.map(item => {
    return { value: item.locker, label: item.locker }
  })

  const boxesAsOptionsByLocker = (locker: string) => {
    const boxes = lockersAndBoxes.find(item => item.locker === locker)?.boxes
    const boxesAsOptions = boxes!.map(box => {
      return { value: box.toString(), label: box.toString() }
    })
    return boxesAsOptions
  }

  async function handleEdit() {
    try {
      await editAsset({
        id,
        modelo,
        idCategoria: parseInt(idCategoria!),
        idEmpleadoAsignado: idEmpleadoAsignado!,
        idBoxAsignado: parseInt(idBoxAsignado!),
        nroSerieLocker,
        estado
      });

      toast.success("Activo modificado correctamente");
      router.refresh();
    } catch (e) {
      const error = asTRPCError(e)!;
      toast.error(error.message);
    }
  }

  return (
    <section className="space-y-2">
      <div className="flex justify-between mr-4">
        <Title>Modificar activo</Title>
        <Button disabled={loadingEdition} onClick={handleEdit}>
          {loadingEdition ? (
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
            id="id"
            value={id}
            disabled
          />
          <Input
            id="modelo"
            placeholder="Modelo"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
          />
          <Selector
            options={categoryOptions}
            value={idCategoria}
            onChange={setIdCategoria}
            placeholder="Elegir categoría"
          />
          <Selector
            options={employeeOptions}
            value={idEmpleadoAsignado}
            onChange={setIdEmpleadoAsignado}
            placeholder="Elegir empleado"
          />
          <Selector
            options={lockerOptions}
            value={nroSerieLocker ?? ""}
            onChange={selectedLocker => {
              if (selectedLocker === " ") {
                setNroSerieLocker("")
                setIdBoxAsignado("")
                setBoxDisabled(true)
              } else {
                setNroSerieLocker(selectedLocker)
                setBoxDisabled(false)
                setBoxOptions(boxesAsOptionsByLocker(selectedLocker))
              }
            }}
            placeholder="Elegir locker"
          />
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
          <Selector
            options={stateOptions}
            value={estado}
            onChange={state => setEstado(state as AssetState)}
            placeholder="Elegir estado"
          />

        </div>
      </Card>
      <div className="flex justify-between ml-4 mr-4">
        <DeleteAsset assetId={asset.id!} />
      </div>
    </section>
  );
}
