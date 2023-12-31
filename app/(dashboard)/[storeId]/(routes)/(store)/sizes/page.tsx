import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { SizeClient } from "./components/client";
import { SizesColumn } from "./components/columns";

const SizesPage = async ({
    params
}: {
    params: {storeId: string;}
}) => {
    const sizes = await prismadb.size.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formatedSizes: SizesColumn[] = sizes.map((item) => ({
        uuid: item.uuid,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, 'MMMM do, yyyy')
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-8">
                <SizeClient data={formatedSizes} />
            </div>
        </div>
    );
}

export default SizesPage;