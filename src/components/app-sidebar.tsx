import { useTranslations } from "next-intl";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { setLang } from "~/app/actions";
import { Languages } from "~/translations";
import { Home, Menu } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import Link from "next/link";


export function AppSidebar({ lang }: { lang?: string }) {
  const t = useTranslations("HomePage");

  const sidebarContent = [
    {
      title: "Activos",
      links: [
        {
          name: "Todos los activos",
          href: "/assets",
        },
        {
          name: "Asignados",
          href: "/assets",
        },
        {
          name: "En el locker",
          href: "/assets",
        },
        {
          name: "En usuarios",
          href: "/assets",
        },
        {
          name: "En reparación",
          href: "/assets",
        },
      ]
    },
    {
      title: "Usuarios",
      links: [
        {
          name: "Todos los usuarios",
          href: "/employees",
        },
        {
          name: "Súper Administradores",
          href: "/employees",
        },
        {
          name: "Administradores",
          href: "/employees",
        },
        {
          name: "Usuarios",
          href: "/employees",
        },
        {
          name: "Habilitados",
          href: "/employees",
        },
        {
          name: "Grupos de usuarios",
          href: "/employees/groups",
        }
      ]
    },
    {
      title: "Ajustes",
      links: [
        {
          name: "Modelos de activos",
          href: "/",
        },
        {
          name: "Categorías de activos",
          href: "/",
        },
        {
          name: "Marcas de activos",
          href: "/",
        },
        {
          name: "Proveedores de activos",
          href: "/",
        },
        {
          name: "Departamentos",
          href: "/",
        },
        {
          name: "Empresas",
          href: "/",
        },
        {
          name: "Locaciones",
          href: "/",
        },
      ]
    },
    {
      title: "Configuración",
      links: [
        {
          name: "Configuración general",
          href: "/",
        },
        {
          name: "Notificaciones",
          href: "/",
        },
      ]
    },
    {
      title: "Reportes",
      links: [
        {
          name: "Actividad",
          href: "/",
        },
        {
          name: "Ocupación por día",
          href: "/",
        },
        {
          name: "Log de accesos",
          href: "/",
        },
        {
          name: "Activos en reparación",
          href: "/",
        },
      ]
    },
    {
      title: "Permisos",
      links: [
        {
          name: "Permisos",
          href: "/",
        },
        {
          name: "Roles",
          href: "/",
        },
      ]
    },
    {
      title: "Monitor",
      links: [
        {
          name: "Monitor de lockers",
          href: "/monitor",
        },
      ]
    }
  ]
  return (
    <Sidebar className="text-white h-full z-10 border-none" collapsible="icon">
      <SidebarHeader className="h-16 mb-4">
        <div className="flex flex-row-reverse">
          <SidebarTrigger className="hover:text-black">
            <Menu className="size-20" />
          </SidebarTrigger>
        </div>
        <div className="mt-4">
          <a href="/" >
            <span className="text-lg bg-[#1E282C]">Panel de Control</span>
          </a>
        </div>
      </SidebarHeader>
      <SidebarContent className="mt-4">
        <Accordion type="single" collapsible>
          {
            sidebarContent.map(element => {
              return (
                <AccordionItem key={element.title} value={element.title} className="pt-1 pb-1 border border-black pl-1">
                  <AccordionTrigger className=" text-lg hover:font-bold hover:no-underline pb-1 pt-1">{element.title}</AccordionTrigger>
                  <AccordionContent className="pb-0">
                    {
                      element.links.map(link => {
                        return (
                          <SidebarMenuButton key={link.name} asChild>
                            <Link href={link.href} className="bg-[#2C3B41] ">
                              <span className="text-base">{link.name}</span>
                            </Link>
                          </SidebarMenuButton>
                        )
                      })
                    }
                  </AccordionContent>
                </AccordionItem>
              )
            })
          }
        </Accordion>
      </SidebarContent>
    </Sidebar>
  );
}
