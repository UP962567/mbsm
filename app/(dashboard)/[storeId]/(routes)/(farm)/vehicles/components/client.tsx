"use client";

import { Edit, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiList } from "@/components/ui/api-list";

type FarmLocation = {
  id: number;
  uuid: string;
  name: string;
  quantity: number;
  plate: string;
  model: string;
  petrolType: string;
  information: string;
  bought: Date;
  sold: Date | null;
  outOfUse: boolean;
  locationName: string;
  // Add other fields from your Prisma model as needed
};

export const Client = ({ data }: { data: FarmLocation[] }) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Vehicle (${data.length})`} description="Manage Vehicles" />
        <Button onClick={() => router.push(`/${params.storeId}/vehicles/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <div className="grid grid-cols-3 gap-4">
        {data.map((vehicles) => (
          <Card key={vehicles.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Name: {vehicles.name}</CardTitle>
              <Button onClick={() => router.push(`/${params.storeId}/vehicles/${vehicles.uuid}`)}>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </Button>
            </CardHeader>
            <CardContent>
              <Separator className="m-2" />
              <div className="text-sm font-medium">Location: {vehicles.locationName}</div>
              <div className="text-sm font-medium">Quantity: {vehicles.quantity}</div>
              <div className="text-sm font-medium">Plate: {vehicles.plate}</div>
              <div className="text-sm font-medium">Model: {vehicles.model}</div>
              <Separator className="m-2" />
              <div className="text-sm font-medium">Bought: {vehicles.bought.toLocaleDateString()}</div>
              <div className="text-sm font-medium">Sold: {vehicles.sold?.toLocaleDateString() === undefined ? "Not Sold" : vehicles.sold?.toLocaleDateString()}</div>
              <div className="text-sm font-medium">Out Of Use: {vehicles.outOfUse === false ? "no" : "yes"}</div>
              <Separator className="m-2" />
              <div className="text-sm font-medium">Information: {vehicles.information}</div>
              <div className="text-sm font-medium">Gas Type: {vehicles.petrolType}</div>

            </CardContent>
          </Card>
        ))}
      </div>
      <Separator />
      <Heading title="API" description="API Calls for Equipments" />
      <Separator />
      <ApiList entityName="equipments" entityIdName="equipmentId" />
    </>
  );
};