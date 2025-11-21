"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { AssetEventForTable } from "~/server/api/routers/assets";

function dateFormatForTable(datetime: string) {
  const date = datetime.split("T")[0]
  const time = datetime.split("T")[1]
  return `${date} ${time?.split(".")[0]}`
}

export const historyTableColumns: ColumnDef<AssetEventForTable>[] = [
  {
    accessorKey: "fechaEvento",
    header: "Fecha",
    cell: ({ row }) => (
      <div className="text-center">{dateFormatForTable(row.getValue("fechaEvento"))}</div>
    ),
  },
  {
    accessorKey: "evento",
    header: "Acción",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("evento")}</div>
    ),
  },
  {
    accessorKey: "asset.modelo",
    header: "Activo",
    cell: ({ row }) => (
      <div className="text-center">{<Link className="hover:font-semibold hover:underline"
        href={`/assets/${row.original.idAsset}`}
      >{row.original.asset.modelo}</Link>}</div>
    ),
  },
  {
    accessorKey: "assetsEmpleado",
    header: "Usuario",
    cell: ({ row }) => (
      <div className="text-center">{<Link className="hover:font-semibold hover:underline"
        href={`/employees/${row.original.idEmpleado}`}
      >{`${row.original.assetsEmpleado?.nombre} ${row.original.assetsEmpleado?.apellido}`}</Link>}</div>
    ),
  },
];
