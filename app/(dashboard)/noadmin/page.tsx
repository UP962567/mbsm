import { Separator } from "@/components/ui/separator";
import { UserButton, auth } from "@clerk/nextjs";

const NoAdmin = () => {

    const userIdOrg = auth().sessionClaims?.organization;

    const organizationUserCh = 'org_2XzdMdgMgTlwzjqimSW1OMKoKYU' as keyof typeof userIdOrg;
    const organizationAdminCh = 'org_2XzTkZZfgnh78732dC7OwwJNxG1' as keyof typeof userIdOrg;


    if (userIdOrg && userIdOrg[organizationAdminCh] === "admin" || userIdOrg && userIdOrg[organizationAdminCh] === "basic_member") {
        console.log("SDON 1")
    } else
        if (userIdOrg && userIdOrg[organizationUserCh] === "basic_member") {
            console.log("SDON 2")
        } else {
            return (
                <div className="h-full w-full">
                    <div className="flex items-center justify-center">
                        <div className="">
                            <h1 className="font-bold text-red-600">You have no access!!!</h1>
                        </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-center">
                        <div className="">
                            <h1 className="font-bold text-red-600">This will be reported to our sys-admin!!!</h1>
                        </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-center h-1/6">
                        <h1 className="font-bold text-red-600">LogOut NOW : </h1>
                        <div className=""> 
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </div>
                    <div>

                    </div>
                </div>
            );
        }
}

export default NoAdmin;