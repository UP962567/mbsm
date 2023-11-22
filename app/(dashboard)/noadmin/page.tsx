import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const NoAdmin = () => {

    const userUI = auth();
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
            <div>
                <h1>no admin</h1>
                <UserButton afterSignOutUrl="/" />
            </div>
         );
    }
}
 
export default NoAdmin;