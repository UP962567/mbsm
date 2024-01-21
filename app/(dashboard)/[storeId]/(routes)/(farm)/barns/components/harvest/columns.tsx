"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type Column = {
  id: number;
  uuid: string;
  name: string;
  quantity: number;
  productId: string;
  productName: string;
  harvested: Date;
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
    accessorKey: "harvested",
    header: "Harvested",
  },
  {
    accessorKey: "productName",
    header: "Product Name",
  },
  {
    accessorKey: "productId",
    header: "Product ID",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },

]
