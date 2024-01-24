import prismadb from "@/lib/prismadb";
import { Client } from "./components/client";

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
        price: animal.price ? animal.price.toString() : null,
    }));

    const harvest = await prismadb.farmHarvest.findMany({
        where: {
            storeId: params.storeId,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // ----------------------------------------------
    // Feed

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
            type: 'ANIMALS',
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
                <Client data={dataWithLocationNames}
                    harvest={harvest}
                    feedU={feedUsage}
                    feed={dataWithFeedPrice}
                    medicineU={medicineUsage}
                    medicine={dataWithMedicinePrice}
                />
            </div>
        </div>
    );
}

export default Page;