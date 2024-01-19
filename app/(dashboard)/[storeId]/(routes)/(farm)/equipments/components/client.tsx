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
  information: string;
  usage: string;
  bought: Date;
  outOfUse: boolean;
  sold: Date | null;
  locationName: string;
  // Add other fields from your Prisma model as needed
};

export const Client = ({ data }: { data: FarmLocation[] }) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Equipment (${data.length})`} description="Manage Equipments" />
        <Button onClick={() => router.push(`/${params.storeId}/equipments/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <div className="grid grid-cols-3 gap-4">
        {data.map((equipment) => (
          <Card key={equipment.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Name: {equipment.name}</CardTitle>
              <Button onClick={() => router.push(`/${params.storeId}/equipments/${equipment.uuid}`)}>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </Button>
            </CardHeader>
            <CardContent>
              <Separator className="m-2" />
              <div className="text-sm font-medium">Location: {equipment.locationName}</div>

              <Separator className="m-2" />
              <div className="text-sm font-medium">Bought: {equipment.bought.toLocaleDateString()}</div>
              <div className="text-sm font-medium">Sold: {equipment.sold?.toLocaleDateString() === undefined ? "Not Sold" : equipment.sold?.toLocaleDateString()}</div>
              <div className="text-sm font-medium">Out Of Use: {equipment.outOfUse === false ? "no" : "yes"}</div>
              <Separator className="m-2" />
              <div className="text-sm font-medium">Information: {equipment.information}</div>
              <div className="text-sm font-medium">Usage: {equipment.usage}</div>

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