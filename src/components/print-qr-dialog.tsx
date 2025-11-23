"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Printer } from "lucide-react";

interface PrintQRDialogProps {
  value: string;
  label?: string;
  size?: number;
  buttonText?: string;
}

export function PrintQRDialog({
  value,
  label,
  size = 180,
  buttonText = "Imprimir QR",
}: PrintQRDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        window.print();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Printer className="mr-2" /> {buttonText}
        </Button>
      </DialogTrigger>

      <DialogContent
        className="flex flex-col items-center justify-center gap-3 p-6 print-visible bg-white border-none shadow-none"
      >
        <DialogHeader >
          <DialogTitle className="text-center">
            {label ?? "Código QR"}
          </DialogTitle>
        </DialogHeader>

        <QRCodeCanvas value={value} size={size} level="H" />

        <p className="text-sm text-gray-600 text-center">{value}</p>

        <Button
          variant="secondary"
          onClick={() => setOpen(false)}
          className="mt-2 print:hidden"
        >
          Cerrar
        </Button>
      </DialogContent>
    </Dialog>
  );
}
