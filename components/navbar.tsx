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

    const stores = await prismadb.store.findMany({
        where: {
            userId: userId,
        },
    });

    const userIdOrg = auth().sessionClaims?.organization;

    const organizationUserCh = 'org_2XzdMdgMgTlwzjqimSW1OMKoKYU' as keyof typeof userIdOrg; 
    const organizationAdminCh = 'org_2XzTkZZfgnh78732dC7OwwJNxG1' as keyof typeof userIdOrg;

    console.log(userIdOrg)

    if (userIdOrg && userIdOrg[organizationAdminCh] === "admin" || userIdOrg && userIdOrg[organizationAdminCh] === "basic_member") {
        return (
            <div className="border-b border-solid border-blue-700">
                <div className="flex h-16 items-center px-4">
    
                    <StoreSwithcer items={stores} />
    
                    <MainNav className="mx-6" />
    
                    <div className="ml-auto flex items-center space-x-4">
                        <Link href="/admin"><Button variant="destructive" size="sm">Admin</Button></Link>
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </div>
            </div>
        );
    } else if (userIdOrg && userIdOrg[organizationUserCh] === "basic_member") {
        return (
            <div className="border-b border-solid border-blue-700">
                <div className="flex h-16 items-center px-4">
    
                    <MainNav className="mx-6" />
    
                    <div className="ml-auto flex items-center space-x-4">
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </div>
            </div>
        );
    } else {
        redirect("/noadmin")
    }
}

export default Navbar;