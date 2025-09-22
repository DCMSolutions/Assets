"use client";

import { ColumnDef } from "@tanstack/react-table";

// Definir el tipo de datos para la tabla de reservas.
export type EmployeesTableRecord = {
  id: string;
  name: string
};

export const employeesTableColumns: ColumnDef<EmployeesTableRecord>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("nombre") || "-"}</div>
    ),
  },
];
