import prismadb from "@/lib/prismadb";
import { Client } from "./components/client";
import { n_formatter } from "@/lib/utils";

const Page = async ({
    params
}: {
    params: { storeId: string; }
}) => {
    const data = await prismadb.farmFeed.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const dataWithLocationNames = data.map(maps => ({
        ...maps,
        price: n_formatter.format(maps.price?.toNumber() ?? 0),
    }));

    const dataUsed = await prismadb.farmFeedUsed.findMany({
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
                <Client data={dataWithLocationNames}
                    feed={dataUsed}
                />
            </div>
        </div>
    );
}

export default Page;