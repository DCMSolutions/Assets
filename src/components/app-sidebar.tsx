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

function Item({ text, url }: { text: string; url: string }) {
  return (
    <ul className="main-nav ">
      <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-home current-menu-item page_item page-item-11 current_page_item menu-item-27 first depth-0">
        <a href={url} data-level="1">
          <span className="menu-item-text">
            <span className="menu-text">{text}</span>
          </span>
        </a>
      </li>
    </ul>
  );
}

export function AppSidebar({ lang }: { lang?: string }) {
  const t = useTranslations("HomePage");

  const sidebarContent = [
    {
      title: "Personas",
      links: [
        {
          name: "Empleados",
          href: "/employees",
        },
        {
          name: "Grupos",
          href: "/employees/groups",
        }
      ]
    },
    {
      title: "Ativos",
      links: [
        {
          name: "Todos los activos",
          href: "/assets",
        },
        {
          name: "Categorías",
          href: "/assets/categories",
        }
      ]
    },
    {
      title: "Ajustes",
      links: []
    },
    {
      title: "Configuración",
      links: []
    },
    {
      title: "Monitor",
      links: []
    }
  ]
  return (
    <Sidebar className="text-white border-none mt-[50px]" collapsible="icon">
      <SidebarHeader className="h-16">
        <div className="flex flex-row-reverse">
          <SidebarTrigger className="hover:text-black">
            <Menu />
          </SidebarTrigger>
        </div>
        <div className="flex flex-row-reverse">
          <a href="/" className="pr-0.5">
            <Home />
          </a>
        </div>
      </SidebarHeader>
      <SidebarContent className="mt-2">
        <Accordion type="single" collapsible>
          {
            sidebarContent.map(element => {
              return (
                <AccordionItem value={element.title} className="pt-1 pb-1 border border-black pl-4">
                  <AccordionTrigger className=" text-lg hover:font-bold hover:no-underline pb-1 pt-1">{element.title}</AccordionTrigger>
                  <AccordionContent className="pb-0">
                    {
                      element.links.map(link => {
                        return (
                          <SidebarMenuButton asChild>
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
