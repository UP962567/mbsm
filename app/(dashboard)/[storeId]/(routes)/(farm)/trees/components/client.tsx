"use client";

import { Edit, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiList } from "@/components/ui/api-list";

type FamrTree = {
  id: number;
  uuid: string;
  name: string;
  quantity: number;
  information: string;
  type: string;
  planted: Date;
  locationName: string;
  fieldName: string;
  harvest: Date | null;
  price: string; // using '?' to denote that this field is optional
  // Add other fields from your Prisma model as needed
};

export const Client = ({ data }: { data: FamrTree[] }) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Trees (${data.length})`} description="Manage Trees" />
        <Button onClick={() => router.push(`/${params.storeId}/trees/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <div className="grid grid-cols-3 gap-4">
        {data.map((location) => (
          <Card key={location.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Name: <b>{location.name}</b></CardTitle>
              <Button onClick={() => router.push(`/${params.storeId}/trees/${location.uuid}`)}>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">Quantity: <b>{location.quantity}</b></div>
              <div className="text-sm font-medium">Type: <b>{location.type}</b> </div>
              <div className="text-sm font-medium">Price/Tree: <b>{location.price}</b> </div>
              <Separator className="m-2"/>
              <div className="text-sm font-medium">Location of Field: <b>{location.locationName}</b> </div>
              <div className="text-sm font-medium">Field Name: <b>{location.fieldName}</b> </div>
              <Separator className="m-2"/>
              <div className="text-sm font-medium">Planted: <b>{location.planted.toLocaleDateString()}</b> </div>
              <div className="text-sm font-medium">Harvested: <b>{location.harvest?.toLocaleDateString()}</b> </div>
              <Separator className="m-2"/>
              <div className="text-sm font-medium">Information: <b>{location.information}</b> </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Separator />
      <Heading title="API" description="API Calls for Trees" />
      <Separator />
      <ApiList entityName="trees" entityIdName="treeId" />
    </>
  );
};