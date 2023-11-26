"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type Column = {
  uuid: string
  title: string
  group: string
  start_time: string
  end_time: string
  createdAt: string;
}

export const columns: ColumnDef<Column>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "group",
    header: "Group",
  },
  {
    accessorKey: "start_time",
    header: "CheckIn",
  },
  {
    accessorKey: "end_time",
    header: "CheckOut",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },

]
