import prismadb from '@/lib/prismadb';
import React from 'react'
import { Column } from "./components/columns";
import { Client } from "./components/client";
import { format } from "date-fns";

const Users = async ({
    params
}: {
    params: {storeId: string;}
}) => {
    const datas = await prismadb.store.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formated: Column[] = datas.map((item) => ({
        uuid: item.uuid,
        name: item.type,
        type: item.name,
        createdAt: format(item.createdAt, 'MMMM do, yyyy')
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-8">
                <Client data={formated} />
            </div>
        </div>
    );
}

export default Users;