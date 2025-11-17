"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EmployeeForTable } from "~/server/api/routers/employees";


export const employeesTableColumns: ColumnDef<EmployeeForTable>[] = [
  {
    accessorKey: "id",
    header: "UID",
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
    accessorKey: "apellido",
    header: "Apellido",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("apellido") || "-"}</div>
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
    // accessorKey: "",
    header: "Título",
    cell: ({ row }) => (
      <div className="text-center">{"-"}</div>
    ),
  },
  {
    // accessorKey: "",
    header: "Departamento",
    cell: ({ row }) => (
      <div className="text-center">{"-"}</div>
    ),
  },
  {
    // accessorKey: "",
    header: "Locación",
    cell: ({ row }) => (
      <div className="text-center">{"-"}</div>
    ),
  },
  {
    // accessorKey: "",
    header: "Empresa",
    cell: ({ row }) => (
      <div className="text-center">{"-"}</div>
    ),
  },
  {
    // accessorKey: "",
    header: "Activos asignados",
    cell: ({ row }) => (
      <div className="text-center">{"-"}</div>
    ),
  },
  {
    // accessorKey: "",
    header: "Activos posesión",
    cell: ({ row }) => (
      <div className="text-center">{"-"}</div>
    ),
  },
  {
    // accessorKey: "",
    header: "Activos vencidos",
    cell: ({ row }) => (
      <div className="text-center">{"-"}</div>
    ),
  },
  {
    accessorKey: "habilitado",
    header: "Habilitado",
    cell: ({ row }) => (
      <div className="flex items-center justify-center" >
        <span
          className={`inline-block h-3 w-3 rounded-full ${row.getValue("habilitado") ? "bg-green-500" : "bg-red-500"}`}
        />
      </div>
    ),
  },
]
