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
            userId
        }
    });

    if (store) {
        redirect(`/${store.uuid}`)
    }

    const userIdOrg = auth().sessionClaims?.organization;

    const organizationUserCh = 'org_2XzdMdgMgTlwzjqimSW1OMKoKYU' as keyof typeof userIdOrg;
    const organizationAdminCh = 'org_2XzTkZZfgnh78732dC7OwwJNxG1' as keyof typeof userIdOrg;


    if (userIdOrg && userIdOrg[organizationAdminCh] === "admin" || userIdOrg && userIdOrg[organizationAdminCh] === "basic_member") {
        return (
            <>
                {children}
            </>
        )

    } else if (userIdOrg && userIdOrg[organizationUserCh] === "basic_member") {
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