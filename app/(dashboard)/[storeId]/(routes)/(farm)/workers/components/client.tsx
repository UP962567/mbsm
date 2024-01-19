"use client";

import { Edit, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiList } from "@/components/ui/api-list";

type FarmWorker = {
  id: number;
  uuid: string;
  name: string;
  information: string;
  contact: number;
  role: string;
  holidays: number | null;
  sickdays: number | null;
  wage: string;
  start: Date;
  end: Date | null;
  locationName: string;
  // Add other fields from your Prisma model as needed
};

export const Client = ({ data }: { data: FarmWorker[] }) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Worker (${data.length})`} description="Manage Workers" />
        <Button onClick={() => router.push(`/${params.storeId}/workers/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <div className="grid grid-cols-3 gap-4">
        {data.map((workers) => (
          <Card key={workers.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Name: {workers.name}</CardTitle>
              <Button onClick={() => router.push(`/${params.storeId}/workers/${workers.uuid}`)}>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </Button>
            </CardHeader>
            <CardContent>
              <Separator className="m-2" />
              <div className="text-sm font-medium">Role: {workers.role}</div>
              <div className="text-sm font-medium">Contact: {workers.contact}</div>
              <div className="text-sm font-medium">Wage: {workers.wage}</div>
              <Separator className="m-2" />
              <div className="text-sm font-medium">Started: {workers.start.toLocaleDateString()}</div>
              <div className="text-sm font-medium">Ended: {workers.end?.toLocaleDateString() === undefined ? "Not Sold" : workers.end?.toLocaleDateString()}</div>
              <Separator className="m-2" />
              <div className="text-sm font-medium">Holidays: {workers.holidays}</div>
              <div className="text-sm font-medium">Sickdays: {workers.sickdays}</div>
              <Separator className="m-2" />
              <div className="text-sm font-medium">Information: {workers.information}</div>

            </CardContent>
          </Card>
        ))}
      </div>
      <Separator />
      <Heading title="API" description="API Calls for Workers" />
      <Separator />
      <ApiList entityName="workers" entityIdName="workerId" />
    </>
  );
};