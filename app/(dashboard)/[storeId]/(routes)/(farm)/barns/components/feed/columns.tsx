"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type Column = {
  id: number;
  uuid: string;
  name: string;
  quantity: number;
  information: string;
  used: Date;
  feeded: string;
  animal: string;
}

export const columns: ColumnDef<Column>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "used",
    header: "Used",
  },
  {
    accessorKey: "information",
    header: "Information",
  },
  {
    accessorKey: "feeded",
    header: "Feeded",
  },
  {
    accessorKey: "animal",
    header: "Animal",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },

]
