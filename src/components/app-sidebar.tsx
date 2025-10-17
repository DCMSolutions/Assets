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
import { Menu } from "lucide-react";
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

  return (
    <Sidebar className="text-white border-none" collapsible="icon">
      <SidebarHeader className="items-end">
        <SidebarTrigger>
          <Menu className="text-white" />
        </SidebarTrigger>
      </SidebarHeader>
      <SidebarContent className="mt-[114px]">
        <SidebarMenu >
          <SidebarMenuItem>
            <Accordion type="single" collapsible>
              <AccordionItem value="people" className="p-0 border border-black">
                <AccordionTrigger className=" text-lg hover:font-bold hover:no-underline">Personas</AccordionTrigger>
                <AccordionContent className="pb-0">
                  <SidebarMenuButton asChild >
                    <Link href={"/employees"} className="bg-[#2C3B41] border-b border-black">
                      <span className="text-base"> Empleados </span>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuButton asChild>
                    <Link href={"/employees/groups"} className="bg-[#2C3B41] ">
                      <span className="text-base"> Grupos </span>
                    </Link>
                  </SidebarMenuButton>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="assets" className="p-0 border border-black">
                <AccordionTrigger className=" text-lg hover:font-bold hover:no-underline">Activos</AccordionTrigger>
                <AccordionContent>
                  <SidebarMenuButton asChild>
                    <Link href={"/assets"} className="bg-[#2C3B41] ">
                      <span className="text-base"> Activos </span>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuButton asChild>
                    <Link href={"/assets/categories"} className="bg-[#2C3B41] ">
                      <span className="text-base"> Categorías </span>
                    </Link>
                  </SidebarMenuButton>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <SidebarMenuButton asChild>
              <div className="mt-auto w-[80%] justify-self-center">
                <Select
                  defaultValue={lang}
                  onValueChange={(v) =>
                    setLang(v as Languages).catch(console.error)
                  }
                >
                  <SelectTrigger className="border-none">
                    <SelectValue placeholder={t("language")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
