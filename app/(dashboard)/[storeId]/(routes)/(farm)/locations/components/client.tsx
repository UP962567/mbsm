"use client";

import { Edit, Plus, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export const Client = () => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Locations ()`} description="Manage Locations for your store" />
        <Button onClick={() => router.push(`/${params.storeId}/locations/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      {/* <DataTable searchKey="name" columns={columns} data={data} /> */}

      <div className="grid grid-cols-3 gap-4" >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Name: NAME</CardTitle>
            <Button >
              <Edit className="h-4 w-4 text-muted-foreground" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">Location: MOLLAS CERRIKE</div>
            <div className="text-sm font-medium">Google Maps: <a className="bg-red-500" href="https://maps.app.goo.gl/Pfpt27dfXpWNLFVR7"> Mollas </a> </div>
            <div className="text-sm font-medium">Size Hectars: 24 H</div>
            <Separator />
          </CardContent>
        </Card>
      </div>
      <Separator />
      <Heading title="API" description="API Calls for Locations" />
      <Separator />
      <ApiList entityName="locations" entityIdName="locationId" />
    </>
  );
};