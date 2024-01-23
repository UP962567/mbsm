import prismadb from "@/lib/prismadb";
import { Client } from "./components/client";
import { n_formatter } from "@/lib/utils";

const Page = async ({
    params
}: {
    params: {storeId: string;}
}) => {
    const data = await prismadb.farmAnimal.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            location: true
        }
    });

    const dataWithLocationNames = data.map(animal => ({
        ...animal,
        locationName: animal.location.name,
        price: n_formatter.format(animal.price?.toNumber() ?? 0),
    }));

    const harvest = await prismadb.farmHarvest.findMany({
        where: {
            storeId: params.storeId,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const feed = await prismadb.farmFeed.findMany({
        where: {
            storeId: params.storeId,
            type: 'ANIMALS',
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const dataWithFeedPrice = feed.map(feed => ({
        ...feed,
        price: n_formatter.format(feed.price?.toNumber() ?? 0),
    }));


    const feedUsage = await prismadb.farmFeedUsed.findMany({
        where: {
            storeId: params.storeId,
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            feed: true,
        }
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-8">
                <Client data={dataWithLocationNames}
                    harvest={harvest}
                    feedU={feedUsage}
                    feed={dataWithFeedPrice}
                />
            </div>
        </div>
    );
}

export default Page;