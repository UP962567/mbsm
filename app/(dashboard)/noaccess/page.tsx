import { Separator } from "@/components/ui/separator";
import { UserButton, auth } from "@clerk/nextjs";
import RequestAccessPage from "./request";
import prismadb from "@/lib/prismadb";

type User = {
    id: number;
    uuid: string;
    fullName: string;
    email: string;
    contact: string;
    username: string;
    password: string;
    location: string;
    role: string;
    status: string;
}
const NoAdmin = async () => {

    const userIdOrg = auth().sessionClaims?.organization;

    const organizationUserCh = 'org_2XzdMdgMgTlwzjqimSW1OMKoKYU' as keyof typeof userIdOrg;
    const organizationAdminCh = 'org_2XzTkZZfgnh78732dC7OwwJNxG1' as keyof typeof userIdOrg;

    const rawData = await prismadb.user.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });

    const data: User[] = rawData.map((item) => ({
        id: item.id,
        uuid: item.uuid,
        fullName: item.name, // Assuming item.name should be mapped to fullName
        email: item.email,
        contact: item.phone, // Assuming item.phone should be mapped to contact
        username: item.username,
        password: item.password,
        location: item.address, // Assuming item.address should be mapped to location
        role: item.role,
        status: item.status,
        // ... map other required properties from item to User type
    }));

    if (userIdOrg && userIdOrg[organizationAdminCh] === "admin" || userIdOrg && userIdOrg[organizationAdminCh] === "basic_member") {
        console.log("SDON 1")
    } else
        if (userIdOrg && userIdOrg[organizationUserCh] === "basic_member") {
            console.log("SDON 2")
        } else {
            return (
                <div>
                    <RequestAccessPage data={data} />
                </div>
            );
        }
}

export default NoAdmin;