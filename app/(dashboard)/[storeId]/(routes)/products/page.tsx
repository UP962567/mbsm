import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

const ProductsPage = async ({
    params
}: {
    params: {storeId: string;}
}) => {
    const products = await prismadb.product.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            category: true,
            size: true,
            color: true,
            zcategory: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formatedProducts: ProductColumn[] = products.map((item) => ({
        uuid: item.uuid,
        name: item.name,
        description: item.description,
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        price: formatter.format(item.price.toNumber()),
        category: item.category.name,
        size: item.size.name,
        color: item.color.value,
        zcategory: item.zcategory.value,
        createdAt: format(item.createdAt, 'MMMM do, yyyy')
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-8">
                <ProductClient data={formatedProducts} />
            </div>
        </div>
    );
}

export default ProductsPage;