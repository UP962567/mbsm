import Leftbar from "@/components/leftbar";
import Navbar from "@/components/admin-navbar";
import { auth } from "@clerk/nextjs"
import { redirect, useParams } from "next/navigation";
import prismadb from "@/lib/prismadb";

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

    const user = await prismadb.user.findUnique({
        where: {
            uuid: userId
        }
    });


    if (user?.role !== "ADMIN") {
        redirect('/')
    }

    return (
        <div>
            < Navbar />
            <div className="h-screen flex flex-row justify-start">
                <Leftbar />

                <div className="flex-1 p-4">
                    {children}
                </div>
            </div>
        </div>
    )
}