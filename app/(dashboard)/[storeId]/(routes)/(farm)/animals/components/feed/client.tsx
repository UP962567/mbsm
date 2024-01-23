"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns, Column } from "./columns";

interface ClientProps {
  data: Column[];
}

export const ClientDataFeed: React.FC<ClientProps> = ({
  data
}) => {
  return (
    <>
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};