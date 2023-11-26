import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { OrderClient } from "./components/client";
import { OrderColumn, OrderColumnHotel } from "./components/columns";
import { formatter } from "@/lib/utils";

const OrdersPage = async ({
    params
}: {
    params: { storeId: string; }
}) => {
    const store = await prismadb.store.findFirst({
        where: {
            uuid: params.storeId
        }
    });

    console.log(store?.type)

    const order = await prismadb.order.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

// WORKING

    if (store?.type === "STORE") {
        const formatedOrders: OrderColumn[] = order.map((item) => ({
            uuid: item.uuid,
            phone: item.phone,
            address: item.address,
            isPaid: item.isPaid,
            products: item.orderItems.map((orderItem) => orderItem.product.name).join(', '),
            totalPrice: formatter.format(item.orderItems.reduce((total, item) => {
                return total + Number(item.product.price);
            }, 0)),
            createdAt: format(item.createdAt, 'MMMM do, yyyy')
        }));

        return (
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-8">
                    <OrderClient data={formatedOrders} />
                </div>
            </div>
        );
    } else if (store?.type === "HOTEL") {
        const formatedOrders: OrderColumnHotel[] = order.map((item) => ({
            uuid: item.uuid,
            phone: item.phone,
            address: item.address,
            isPaid: item.isPaid,
            products: item.orderItems.map((orderItem) => orderItem.product.name).join(', '),
            totalPrice: formatter.format(item.orderItems.reduce((total, item) => {
                return total + Number(item.product.price);
            }, 0)),
            createdAt: format(item.createdAt, 'MMMM do, yyyy')
        }));

        return (
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-8">
                    <OrderClient data={formatedOrders} />
                </div>
            </div>
        );
    }



}

export default OrdersPage;