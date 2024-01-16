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
  maps: string;
  maps_dsc: string;
  size?: number | null; // using '?' to denote that this field is optional
  // Add other fields from your Prisma model as needed
};

export const Client = ({ data }: { data: FarmLocation[] }) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Locations (${data.length})`} description="Manage Locations" />
        <Button onClick={() => router.push(`/${params.storeId}/locations/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <div className="grid grid-cols-3 gap-4">
        {data.map((location) => (
          <Card key={location.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Name: {location.name}</CardTitle>
              <Button onClick={() => router.push(`/${params.storeId}/locations/${location.uuid}`)}>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">Location: {location.maps_dsc}</div>
              <div className="text-sm font-medium">
                Google Maps: <a className="bg-red-500" href={location.maps}>Link</a>
              </div>
              <div className="text-sm font-medium">Size Hectars: {location.size} H</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Separator />
      <Heading title="API" description="API Calls for Locations" />
      <Separator />
      <ApiList entityName="locations" entityIdName="locationId" />
    </>
  );
};