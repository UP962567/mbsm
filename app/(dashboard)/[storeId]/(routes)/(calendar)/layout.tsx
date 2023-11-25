import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation";

export default async function Dashboardlayout({
    children,
    params

}: {
    children: React.ReactNode;
    params: { storeId: string }
}) {
    const { userId } = auth();

    if (!userId) {
        redirect('/sign-in')
    }

    const store = await prismadb.store.findFirst({
        where: {
            uuid: params.storeId,
            StoreToUser: {
                some: {
                    userId: userId
                }
            },
            type: "HOTEL"
        },
    });

    if (!store) {
        redirect('/')
    }

    return (
        <div>
            <div className="flex-1 p-4">
                {children}
            </div>
        </div>
    )
}