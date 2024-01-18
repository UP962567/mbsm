"use client";

import { Edit, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiList } from "@/components/ui/api-list";


type FamrBarn = {
  id: number;
  uuid: string;
  name: string;
  quantity: number;
  information: string;
  planted: Date;
  locationName: string;
  fieldName: string;
  harvest: Date | null;
  price: string; // using '?' to denote that this field is optional
  // Add other fields from your Prisma model as needed
};

export const Client = ({ data }: { data: FamrBarn[] }) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Barns (${data.length})`} description="Manage Barns" />
        <Button onClick={() => router.push(`/${params.storeId}/barns/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <div className="grid grid-cols-3 gap-4">
        {data.map((barns) => (
          <Card key={barns.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Name: <b>{barns.name}</b></CardTitle>
              <Button onClick={() => router.push(`/${params.storeId}/barns/${barns.uuid}`)}>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">Quantity: <b>{barns.quantity}</b></div>
              <div className="text-sm font-medium">Price/Seed: <b>{barns.price}</b> </div>
              <Separator className="m-2"/>
              <div className="text-sm font-medium">Location of Field: <b>{barns.locationName}</b> </div>
              <div className="text-sm font-medium">Field Name: <b>{barns.fieldName}</b> </div>
              <Separator className="m-2"/>
              <div className="text-sm font-medium">Planted: <b>{barns.planted.toLocaleDateString()}</b> </div>
              <div className="text-sm font-medium">Harvested: <b>{barns.harvest?.toLocaleDateString()}</b> </div>
              <Separator className="m-2"/>
              <div className="text-sm font-medium">Information: <b>{barns.information}</b> </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Separator />
      <Heading title="API" description="API Calls for Barns" />
      <Separator />
      <ApiList entityName="barns" entityIdName="barnId" />
    </>
  );
};