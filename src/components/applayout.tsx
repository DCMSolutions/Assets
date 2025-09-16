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

export default function AppLayout({ children, title }: AppLayoutProps) {
  const t = useTranslations("layout"); // opcional

  return (
    <SidebarProvider>
      {/* TOP BAR */}
      <header className="fixed left-0 right-0 top-0 z-10 flex h-[50px] items-center border-b bg-background/70 px-2 backdrop-blur-md md:px-4">
        <SidenavSheet
          trigger={
            <Button variant="ghost" className="md:hidden">
              <MenuIcon />
            </Button>
          }
          content={<AppSidebar />}
        />

        <div className="w-full">
          {typeof title === "string" ? (
            <span className="text-sm font-semibold">{title}</span>
          ) : (
            title
          )}
        </div>

        <div className="flex gap-4 pr-1">
          <UserButton afterSwitchSessionUrl="/" />
        </div>
      </header>

      {/* SIDEBAR desktop */}
      <aside className="fixed bottom-0 left-0 top-[50px] hidden max-h-full w-[250px] overflow-y-auto border-r md:block">
        <AppSidebar />
      </aside>

      {/* MAIN */}
      <main className="relative mt-[50px] p-2 md:ml-[250px]">{children}</main>
    </SidebarProvider>
  );
}
