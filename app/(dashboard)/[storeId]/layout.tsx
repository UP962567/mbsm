import Leftbar from "@/components/leftbar";
import LeftbarHotel from "@/components/leftbar-hotel";
import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { redirect, useParams } from "next/navigation";

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
            userId,
        },
    });

    if (!store) {
        redirect('/')
    }

    // console.log("Test ", store.type)

    const storeType = store.type;


    return (
        <div>
            < Navbar />
            <div className="h-screen flex flex-row justify-start">
                {storeType === "STORE" ? <Leftbar />: null}
                {storeType === "HOTEL" ? <LeftbarHotel /> : null}

                <div className="flex-1 p-4">
                    {children}
                </div>
            </div>
        </div>
    )
}