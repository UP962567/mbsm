import prismadb from "@/lib/prismadb";
import { Client } from "./components/client";
import { n_formatter } from "@/lib/utils";

const Page = async ({
    params
}: {
    params: {storeId: string;}
}) => {
    const data = await prismadb.farmTree.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            location: true,
            field: true
        }
    });

    const harvest = await prismadb.farmHarvest.findMany({
        where: {
            storeId: params.storeId,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const dataWithLocationNames = data.map(maps => ({
        ...maps,
        locationName: maps.location.name, // Assuming 'name' is the field for the location name in FarmLocation
        fieldName: maps.field.name,
        price: n_formatter.format(maps.price?.toNumber() ?? 0),
    }));

        // ----------------------------------------------
    // Feed

    const feed = await prismadb.farmFeed.findMany({
        where: {
            storeId: params.storeId,
            type: 'TREES',
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const dataWithFeedPrice = feed.map(feed => ({
        ...feed,
        price: feed.price ? feed.price.toNumber() : 0,
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

    // Feed
    // ----------------------------------------------

    // ----------------------------------------------
    // Medicine

    const medicine = await prismadb.farmMedicine.findMany({
        where: {
            storeId: params.storeId,
            type: 'TREES',
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const dataWithMedicinePrice = medicine.map(medicine => ({
        ...medicine,
        price: medicine.price ? medicine.price.toNumber() : 0,
    }));


    const medicineUsage = await prismadb.farmMedicineUsed.findMany({
        where: {
            storeId: params.storeId,
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            medicine: true,
        }
    });

    // Medicine
    // ----------------------------------------------

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-8">
                <Client 
                    data={dataWithLocationNames} 
                    harvest={harvest}
                    feed={dataWithFeedPrice}
                    feedU={feedUsage}
                    medicine={dataWithMedicinePrice}
                    medicineU={medicineUsage}
                />
            </div>
        </div>
    );
}

export default Page;