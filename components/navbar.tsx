import { UserButton, auth } from "@clerk/nextjs";
import { MainNav } from "@/components/main-nav";
import StoreSwithcer from "@/components/store-switch";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";

const Navbar = async () => {
    const { userId } = auth();

    if (!userId) {
        redirect("/sign-in")
    }

    const stores = await prismadb.store.findMany({
        where: {
            userId: userId,
        },

    })

    return (
        <div className="birder-b">
            <div className="flex h-16 items-center px-4">
                <StoreSwithcer items={stores}/>
                <MainNav className="mx-6" />
                <div className="ml-auto flex items-center space-x-4">
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </div>
    );
}

export default Navbar;