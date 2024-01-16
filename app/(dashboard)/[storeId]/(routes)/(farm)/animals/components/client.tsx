"use client";

import { Edit, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiList } from "@/components/ui/api-list";

type Farm = {
  id: number;
  uuid: string;
  name: string;
  number: number;
  locationId: string;
  locationName: string;
};

export const Client = ({ data }: { data: Farm[] }) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Animals (${data.length})`} description="Manage Animals" />
        <Button onClick={() => router.push(`/${params.storeId}/animals/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <div className="grid grid-cols-3 gap-4">
        {data.map((data) => (
          <Card key={data.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Name: {data.name}</CardTitle>
              <Button onClick={() => router.push(`/${params.storeId}/animals/${data.uuid}`)}>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">Total: {data.number}</div>

              <div className="text-sm font-medium">Location: {data.locationName}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Separator />
      <Heading title="API" description="API Calls for Animals" />
      <Separator />
      <ApiList entityName="animals" entityIdName="animalId" />
    </>
  );
};