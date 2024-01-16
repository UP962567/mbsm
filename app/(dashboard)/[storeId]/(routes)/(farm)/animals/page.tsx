import prismadb from "@/lib/prismadb";
import { Client } from "./components/client";

const Page = async ({
    params
}: {
    params: {storeId: string;}
}) => {
    const data = await prismadb.farmLocation.findMany({
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
                <Client data={data}/>
            </div>
        </div>
    );
}

export default Page;