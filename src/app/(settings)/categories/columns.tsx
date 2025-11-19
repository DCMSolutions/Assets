"use client";

import { ColumnDef } from "@tanstack/react-table";

// Definir el tipo de datos para la tabla de reservas.
export type CategoriesTableRecord = {
  id: string;
  nombre: string;
};

export const categoriesTableColumns: ColumnDef<CategoriesTableRecord>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("nombre") || "-"}</div>
    ),
  },
];
