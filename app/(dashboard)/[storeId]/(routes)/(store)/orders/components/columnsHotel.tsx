"use client"

import { ColumnDef } from "@tanstack/react-table"

export type OrderColumnHotel = {
  uuid: string
  title: string
  group: string
  start_time: string
  end_time: string
  createdAt: string;
}

export const columnsHotel: ColumnDef<OrderColumnHotel>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "group",
    header: "Room",
  },
  {
    accessorKey: "start_time",
    header: "Start Time",
  },
  {
    accessorKey: "end_time",
    header: "End Time",
  },
]
