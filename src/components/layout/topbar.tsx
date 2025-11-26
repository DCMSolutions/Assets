"use client";

import { UserButton } from "@clerk/nextjs";
import { Barcode, Users } from "lucide-react";
import { useSidebar } from "~/components/ui/sidebar";
import { SearchBox } from "../searchbox";
import { api } from "~/trpc/react";
import AboutDialog from "./about-dialog";

export default function TopBar() {
  const { state } = useSidebar();

  const { data: assetsOptions, isLoading } = api.assets.getAllAsOptions.useQuery(undefined, {
    refetchOnWindowFocus: false
  })

  return (
    <header
      className="
        fixed top-0 right-0 h-[50px] w-[calc(100%-var(--sidebar-width)] flex flex-grow items-center justify-between px-4 z-10
        bg-[#3C8DBC] text-white transition-[left,width] duration-200 ease-linear
        md:left-[--sidebar-width]
        md:data-[state=collapsed]:left-[--sidebar-width-icon]
      "
      data-state={state}
    >
      <a href="/" className="flex items-center">
        <img src="/assets.png" alt="Assets logo" width={160} height={40} />
      </a>

      <div className="flex space-x-4">
        <a title="Ir a usuarios" href="/employees" className="flex items-center">
          <Users />
        </a>
        <a title="Ir a activos" href="/assets" className="flex items-center">
          <Barcode />
        </a>
        <div>
          <SearchBox
            options={assetsOptions!}
            link="/assets"
            placeholder="Buscar activo"
            isLoading={isLoading}
          />
        </div>
      </div>

      <div className="flex space-x-4">
        <UserButton afterSwitchSessionUrl="/" />
        <AboutDialog />
      </div>
    </header>
  );
}
