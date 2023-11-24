"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type Column = {
  uuid: string
  userId: string
  storeId: string
}

export const columns: ColumnDef<Column>[] = [
  {
    accessorKey: "userId",
    header: "userId",
  },
  {
    accessorKey: "storeId",
    header: "storeId",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },

]
