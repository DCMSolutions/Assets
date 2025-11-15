import { ColumnDef } from "@tanstack/react-table";
import { BriefcaseIcon, LockIcon, UnlockIcon } from "lucide-react";
import { Box } from "~/server/api/routers/lockers";

export const monitorTableColumns: ColumnDef<Box>[] = [
  {
    accessorKey: "idFisico",
    header: "ID BOX",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("idFisico")}</div>
    ),
  },
  {
    accessorKey: "ocupacion",
    header: "Ocupación",
    cell: ({ row }) => (
      <div className="lowercase">
        {row.getValue("ocupacion") ? <BriefcaseIcon /> : ""}
      </div>
    ),
  },
  {
    accessorKey: "puerta",
    header: "Puerta",
    cell: ({ row }) => (
      <div className="lowercase">
        {row.getValue("puerta") ? <LockIcon /> : <UnlockIcon />}
      </div>
    ),
  },
];
