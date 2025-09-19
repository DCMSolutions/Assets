"use client";

import { ColumnDef } from "@tanstack/react-table";

// Definir el tipo de datos para la tabla de reservas.
export type EmployeesTableRecord = {
  rfid: string;
  firstName: string;
  lastName: string;
  email: string | null;
  active: boolean;
};

export const employeesTableColumns: ColumnDef<EmployeesTableRecord>[] = [
  {
    accessorKey: "rfid",
    header: "RFID",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("rfid") || "-"}</div>
    ),
  },
  {
    accessorKey: "firstName",
    header: "Nombre",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("firstName") || "-"}</div>
    ),
  },
  {
    accessorKey: "lastName",
    header: "Apellido",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("lastName") || "-"}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("email") || "-"}</div>
    ),
  },
  {
    accessorKey: "active",
    header: "Active",
    cell: ({ row }) => (
      <span
        className={`inline-block h-3 w-3 rounded-full ${row.getValue("active") ? "bg-green-500" : "bg-red-500"}`}
      />
    ),
  },
];
