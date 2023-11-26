import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { Column } from "./components/columns";
import { Client } from "./components/client";
import { n_formatter } from "@/lib/utils";

const PCPage = async ({
    params
}: {
    params: {storeId: string;}
}) => {
    const pC = await prismadb.calendarBooking.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formated: Column[] = pC.map((item) => ({
        uuid: item.uuid,
        title: item.title,
        group: n_formatter.format(item.group),
        start_time: format(item.start_time, 'MMMM do, yyyy'),
        end_time: format(item.end_time, 'MMMM do, yyyy'),
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