import { UserButton, auth } from "@clerk/nextjs";
import { MainNav } from "@/components/admin-main-nav";
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

    return (
        <div className="border-b border-solid border-blue-700">
            <div className="flex h-16 items-center px-4">

                <Link href="/admin"><Button variant="outline" size="sm">ADMIN AREA</Button></Link>

                <MainNav className="mx-6" />

                <div className="ml-auto flex items-center space-x-4">
                    <Link href="/"><Button variant="outline" size="sm">Back</Button></Link>
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </div>
    );

}

export default Navbar;