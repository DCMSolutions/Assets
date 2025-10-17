"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EmployeeForTable } from "~/server/api/routers/employees";


export const employeesTableColumns: ColumnDef<EmployeeForTable>[] = [
  {
    accessorKey: "id",
    header: "RFID",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("id") || "-"}</div>
    ),
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("nombre") || "-"}</div>
    ),
  },
  {
    accessorKey: "mail",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("mail") || "-"}</div>
    ),
  },
  {
    accessorKey: "habilitado",
    header: "Habilitado",
    cell: ({ row }) => (
      <div className="text-center" >
        <span
          className={`inline-block h-3 w-3 rounded-full ${row.getValue("habilitado") ? "bg-green-500" : "bg-red-500"}`}
        />
      </div>
    ),
  },
];
