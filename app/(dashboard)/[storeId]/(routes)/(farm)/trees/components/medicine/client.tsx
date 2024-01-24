"use client";

import { DataTable } from "@/components/ui/data-table2";
import { columns, Column } from "./columns";

interface ClientProps {
  data_medicine: Column[];
}

export const ClientDataMedicine: React.FC<ClientProps> = ({
  data_medicine
}) => {
  return (
    <>
      <DataTable searchKey="name" searchKey2="animal" columns={columns} data={data_medicine} />
    </>
  );
};