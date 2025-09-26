"use client";

import { ColumnDef } from "@tanstack/react-table";

// Definir el tipo de datos para la tabla de reservas.
export type GroupsTableRecord = {
  id: number,
  nombre: string
};

export const groupsTableColumns: ColumnDef<GroupsTableRecord>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("nombre") || "-"}</div>
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
