"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";

export default function AboutDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-question-mark-icon lucide-circle-question-mark"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <img src="/assets.png" />
        </DialogHeader>
        <p className="font-bold text-2xl">Versión 0.8.3</p>
        <p className="font-bold text-2xl">Fecha: 27 de noviembre de 2025</p>
        <div className="flex flex-col">
          <p className="font-light text-nowrap">Licencia: Evaluación</p>
          <p className="font-light text-nowrap">Copyright © Locker Inteligentes DCM Solution S.A.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
