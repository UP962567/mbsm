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
  medicineId: string;
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
    accessorKey: "information",
    header: "Information",
  },
  {
    accessorKey: "used",
    header: "Producted Used",
  },
  {
    accessorKey: "medicineId",
    header: "Medicine ID",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },

]
