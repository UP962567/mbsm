import prismadb from "@/lib/prismadb";
import { BillboardClient } from "./components/clients";

const Billboardspage = async ({
    params
}: {
    params: {storeId: string;}
}) => {
    const billboards = await prismadb.billboard.findMany({
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
                <BillboardClient data={billboards} />
            </div>
        </div>
    );
}

export default Billboardspage;