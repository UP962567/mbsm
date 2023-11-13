import { UserButton, auth } from "@clerk/nextjs";
import { MainNav } from "@/components/main-nav";
import StoreSwithcer from "@/components/store-switch";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { Button } from "./ui/button";
import Link from "next/link";
import { SecondNav } from "./second-nav";


const Navbar = async () => {
    const { userId } = auth();
    const userUI = auth();
    const userIdOrg = auth().sessionClaims?.organization;

    const organizationId = userIdOrg ? Object.keys(userIdOrg)[0] : '';

    console.log("USer: ", userUI)
    console.log("Organi: ", userIdOrg)

    if (!userId) {
        redirect("/sign-in")
    }

    if (organizationId !== "org_2XzTkZZfgnh78732dC7OwwJNxG1") {
        redirect("/noadmin")
    }

    const stores = await prismadb.store.findMany({
        where: {
            userId: userId,
        },
    })

    return (
        <div className="border-b border-solid border-blue-700">
            <div className="flex h-16 items-center px-4">
                <StoreSwithcer items={stores} />
                <MainNav className="mx-6" />
                <SecondNav className="mx-6" />
                <div className="ml-auto flex items-center space-x-4">
                    <Link href="/admin">
                        <Button variant="destructive" size="sm">
                            Admin
                        </Button>
                    </Link>
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </div>
    );
}

export default Navbar;