"use client";

import { ColumnDef } from "@tanstack/react-table";

// Definir el tipo de datos para la tabla de reservas.
export type EmployeesTableRecord = {
  id: string;
  nombre: string;
};

export const employeesTableColumns: ColumnDef<EmployeesTableRecord>[] = [
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
  // {
  //   accessorKey: "email",
  //   header: "Email",
  //   cell: ({ row }) => (
  //     <div className="text-center">{row.getValue("email") || "-"}</div>
  //   ),
  // },
  // {
  //   accessorKey: "active",
  //   header: "Active",
  //   cell: ({ row }) => (
  //     <span
  //       className={`inline-block h-3 w-3 rounded-full ${row.getValue("active") ? "bg-green-500" : "bg-red-500"}`}
  //     />
  //   ),
  // },
];
