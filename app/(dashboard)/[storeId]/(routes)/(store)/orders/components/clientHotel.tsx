"use client";

import { useParams, useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columnsHotel, OrderColumnHotel } from "./columnsHotel";

interface OrderClientHotelProps {
  data: OrderColumnHotel[];
}

export const OrderClientHotel: React.FC<OrderClientHotelProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <Heading title={`Orders(${data.length})`} description="Manage orders for your Hotel" />
      <Separator />
      <DataTable searchKey="title" columns={columnsHotel} data={data} />
    </>
  );
};