"use client";

import { useTranslations } from "next-intl";
import { MenuIcon } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

import { Button } from "./ui/button";
import { SidenavSheet } from "./sidenav-sheet";
import { AppSidebar } from "~/components/app-sidebar";

// ⬇️ importa el provider del sidebar de tu lib (shadcn/ui)
import { SidebarProvider } from "~/components/ui/sidebar";
// ^ ajustá la ruta según tu proyecto: a veces es "@/components/ui/sidebar"

export type AppLayoutProps = {
  children: React.ReactNode;
  title?: React.ReactNode | string;
};

export default function AppLayout({ children }: AppLayoutProps) {

  return (
    <SidebarProvider>
      {/* TOP BAR */}
      <header className="bg-[#3C8DBC] fixed left-0 right-0 top-0 z-10 flex flex-row-reverse h-[50px] items-center shadow-none border-none px-2 backdrop-blur-md md:px-4">

        <div className="flex gap-4 pr-1">
          <UserButton afterSwitchSessionUrl="/" />
        </div>
      </header>

      <div className="flex w-full">
        <aside className="fixed md:relative top-[50px] bottom-0 hidden md:block w-[250px] border-none overflow-y-auto">
          <AppSidebar />
        </aside>

        <main className="flex-grow mt-[50px] p-2 bg-[#ECF0F5]">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
