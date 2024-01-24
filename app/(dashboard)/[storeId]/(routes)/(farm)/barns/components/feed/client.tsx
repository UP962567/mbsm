"use client";

import { DataTable } from "@/components/ui/data-table2";
import { columns, Column } from "./columns";

interface ClientProps {
  data_feed: Column[];
}

export const ClientDataFeed: React.FC<ClientProps> = ({
  data_feed
}) => {
  return (
    <>
      <DataTable searchKey="name" searchKey2="animal" columns={columns} data={data_feed} />
    </>
  );
};