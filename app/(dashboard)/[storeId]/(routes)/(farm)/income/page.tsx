import prismadb from "@/lib/prismadb";
import { n_formatter } from "@/lib/utils";

const Page = async ({
    params
}: {
    params: {storeId: string;}
}) => {
    const pC = await prismadb.calendarAddon.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-8">
                HELO TEST
            </div>
        </div>
    );
}

export default Page;