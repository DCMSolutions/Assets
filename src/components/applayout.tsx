"use client";

import { useTranslations } from "next-intl";
import { MenuIcon } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

import { Button } from "./ui/button";
import { SidenavSheet } from "./sidenav-sheet";
import { AppSidebar } from "~/components/app-sidebar";

// ⬇️ importa el provider del sidebar de tu lib (shadcn/ui)
import { SidebarProvider } from "~/components/ui/sidebar";
import TopBar from "./topbar";
// ^ ajustá la ruta según tu proyecto: a veces es "@/components/ui/sidebar"

export type AppLayoutProps = {
  children: React.ReactNode;
  title?: React.ReactNode | string;
};

export default function AppLayout({ children }: AppLayoutProps) {

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <TopBar />
        <main className="flex-grow mt-[50px] bg-[#ECF0F5]">
          <div className="pl-4">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </>
  );
}
