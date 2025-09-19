"use client";

import { Loader2Icon, PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
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
import { api } from "~/trpc/react";
import { UploadButton } from "~/utils/uploadthing";

export function AddEmployeeDialog() {
  const { mutateAsync: createCity, isLoading } = api.city.create.useMutation();

  const [rfid, setRfid] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [active, setActive] = useState<boolean>(true);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleCreate() {
    try {
      await createCity({
        name,
        image,
        description,
      });

      toast.success("Ciudad creada correctamente");
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
        Agregar Empleado
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agregar Empleado</DialogTitle>
          </DialogHeader>

          <div>
            <Input
              id="rfid"
              placeholder="RFID"
              value={rfid}
              onChange={(e) => setRfid(e.target.value)}
            />
          </div>
          <div>
            <Input
              id="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Input
              id="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Input
              id="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button disabled={loading} onClick={handleCreate}>
              {isLoading && (
                <Loader2Icon className="mr-2 animate-spin" size={20} />
              )}
              Crear ciudad
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
