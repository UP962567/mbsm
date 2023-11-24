import { UserButton, auth } from "@clerk/nextjs";
import { MainNav } from "@/components/main-nav";
import StoreSwithcer from "@/components/store-switch";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { Button } from "./ui/button";
import Link from "next/link";

const Navbar = async () => {
    const { userId } = auth();

    if (!userId) {
        redirect("/sign-in")
    }

    const user = await prismadb.user.findUnique({
        where: {
            uuid: userId
        }
    });

    const stores = await prismadb.store.findMany({
        where: {
            StoreToUser: {
                some: {
                    userId: userId
                }
            }
        },
    });


    return (
        <div className="border-b border-solid border-blue-700">
            <div className="flex h-16 items-center px-4">

                <StoreSwithcer items={stores} />

                <MainNav className="mx-6" />

                <div className="ml-auto flex items-center space-x-4">
                    {user?.role === "ADMIN" ? <Link href="/admin"><Button variant="destructive" size="sm">Admin</Button></Link> : null}
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </div>
    );

}

export default Navbar;