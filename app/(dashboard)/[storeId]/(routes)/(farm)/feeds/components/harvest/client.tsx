"use client";

import { useParams, useRouter } from "next/navigation";

import { DataTable } from "@/components/ui/data-table";


import { columns, Column } from "./columns";

interface ClientProps {
  data: Column[];
}

export const ClientData: React.FC<ClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};