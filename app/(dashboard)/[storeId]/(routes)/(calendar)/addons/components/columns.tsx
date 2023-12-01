"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type Column = {
  uuid: string
  title: string
  price: string
}

export const columns: ColumnDef<Column>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },

]
