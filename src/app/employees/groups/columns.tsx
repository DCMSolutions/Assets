"use client";

import { ColumnDef } from "@tanstack/react-table";
import { GroupForTable } from "~/server/api/routers/groups";


export const groupsTableColumns: ColumnDef<GroupForTable>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("nombre") || "-"}</div>
    ),
  },
  {
    accessorKey: "esAdministrador",
    header: "Admin",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("esAdministrador")
        ? "Si"
        : "No"}
      </div>
    ),
  },
  {
    accessorKey: "esMantenimiento",
    header: "Mantenimiento",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("esMantenimiento")
        ? "Si"
        : "No"}
      </div>
    ),
  },
  // {
  //   accessorKey: "id",
  //   header: "ID",
  //   cell: ({ row }) => (
  //     <div className="text-center">{row.getValue("id") || "-"}</div>
  //   ),
  // },
];
