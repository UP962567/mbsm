import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { Column } from "./components/columns";
import { Client } from "./components/client";
import { formatter } from "@/lib/utils";

const PCPage = async ({
    params
}: {
    params: {storeId: string;}
}) => {
    const pC = await prismadb.calendarRoom.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });


    const formated: Column[] = pC.map((item) => ({
        uuid: item.uuid,
        name: item.title,
        slug: item.slug,
        price: formatter.format(item.price.toNumber()),
        floorId: item.floorId || 'N/A',
        createdAt: format(item.createdAt, 'MMMM do, yyyy')
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-8">
                <Client data={formated} />
            </div>
        </div>
    );
}

export default PCPage;