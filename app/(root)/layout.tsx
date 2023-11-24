import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Setuplayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { userId } = auth();

    if (!userId) {
        redirect('/sign-in')
    }
    
    const store = await prismadb.store.findFirst({
        where: {
            StoreToUser: {
                some: {
                    userId: userId
                }
            }
        }
    });

    if (store) {
        redirect(`/${store.uuid}`)
    }

    const user = await prismadb.user.findUnique({
        where: {
            uuid: userId
        }
    });


    if (user?.role === "ADMIN") {
        return (
            <>
                {children}
            </>
        )

    } else if (user?.role === "USER") {
        return (
            <>
                {children}
            </>
        )
    }
    else {
        redirect("/noadmin")
    }
}