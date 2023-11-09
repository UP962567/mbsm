"use client";

import { useOrigin } from "@/hooks/use-origin";
import { useParams } from "next/navigation";
import { ApiAlert } from "@/components/ui/api-alert";

interface ApiListProps {
    entityName: string;
    entityIdName: string;
}

export const ApiList: React.FC<ApiListProps> = ({ entityIdName, entityName }) => {

    const params = useParams();
    const origin = useOrigin();

    const baseUrl = `${origin}/api/${params.storeId}`;

    return (
        <div>
            <ApiAlert
                title="GET"
                variant="public"
                description={`${baseUrl}/${entityName}`}
            />

            <ApiAlert
                title="GET"
                variant="public"
                description={`${baseUrl}/${entityName}/{${entityIdName}}`}
            />
            
            <ApiAlert
                title="POS"
                variant="admin"
                description={`${baseUrl}/${entityName}/${entityIdName}`}
            />
            
            <ApiAlert
                title="PAT"
                variant="admin"
                description={`${baseUrl}/${entityName}/{${entityIdName}}`}
            />

            <ApiAlert
                title="DEL"
                variant="admin"
                description={`${baseUrl}/${entityName}/{${entityIdName}}`}
            />
        </div>
    )
}