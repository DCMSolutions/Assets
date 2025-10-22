"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AssetForTable } from "~/server/api/routers/assets";

// Definir el tipo de datos para la tabla de reservas.
// export type AssetTableRecord = {
//   id: string;
//   modelo: string;
//   poseedorActual: string | undefined;
//   categoria: string;
//   idEmpleadoAsignado: string | undefined;
//   idBoxAsignado: number;
//   nroSerieLocker: string;
//   estado: string;
// };

export const assetsTableColumns: ColumnDef<AssetForTable>[] = [
  {
    accessorKey: "id",
    header: "TAG",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("id") || "-"}</div>
    ),
  },
  {
    accessorKey: "modelo",
    header: "Modelo",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("modelo") || "-"}</div>
    ),
  },
  {
    accessorKey: "categoria",
    header: "Categoria",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("categoria") || "-"}</div>
    ),
  },
  {
    accessorKey: "nombreEmpleadoAsignado",
    header: "Empleado Asignado",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("nombreEmpleadoAsignado") || "-"}</div>
    ),
  },
  {
    accessorKey: "nombrePoseedorActual",
    header: "En manos de",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("nombrePoseedorActual") || ""}</div>
    ),
  },
  {
    accessorKey: "idBoxAsignado",
    header: "Box Asignado",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("idBoxAsignado") || "-"}</div>
    ),
  },
  {
    accessorKey: "nroSerieLocker",
    header: "Locker",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("nroSerieLocker") || "-"}</div>
    ),
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("estado") || "-"}</div>
    ),
  },
];
