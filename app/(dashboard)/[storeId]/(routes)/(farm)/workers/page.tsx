import prismadb from "@/lib/prismadb";
import { Client } from "./components/client";
import { n_formatter } from "@/lib/utils";

const Page = async ({
    params
}: {
    params: { storeId: string; }
}) => {
    const data = await prismadb.farmWorker.findMany({
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

    const dataWithLocationNames = data.map(worker => ({
        ...worker,
        locationName: worker.location.name, // Assuming 'name' is the field for the location name in FarmLocation
        wage: n_formatter.format(worker.wage?.toNumber() ?? 0),
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-8">
                <Client data={dataWithLocationNames} />
            </div>
        </div>
    );
}

export default Page;