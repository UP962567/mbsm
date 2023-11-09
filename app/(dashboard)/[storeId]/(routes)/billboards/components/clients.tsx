"use client";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { BillboardColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface BillboardClientProps {
    data: BillboardColumn[]
}

export const BillboardClient: React.FC<BillboardClientProps> = ({data}) => {

    const routes = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Billboards (${data.length})`}
                    descriptions="Billboards are the main way to display your ads. You can create a new billboard by clicking the button below."
                />
                <Button onClick={() => routes.push(`/${params.storeId}/billboards/new`)}>
                    <Plus className="mr-2 w-4 h-4" />
                    Add New
                </Button>
            </div>

            <Separator />

            <DataTable columns={columns} data={data} searchKey="label"/>

            <Heading title="API" descriptions="API calls for Billboards" />

            <Separator />

            <ApiList  entityName="billboards" entityIdName="billboardId"/>
        </>
    )
}