import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string}}
) {
    try {
        const body = await req.json();

        const { name, value } = body;

        const { userId } = auth();

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

        if (!name) return new NextResponse("Missing Label", { status: 400 });

        if (!value) return new NextResponse("Missing Image", { status: 400 });

        if (!params.storeId) return new NextResponse("Missing Store ID", { status: 400 });

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                uuid: params.storeId,
                userId
            },
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 401 });

        const pusher = await prismadb.zCategory.create({
            data: {
                name,
                value,
                storeId: params.storeId,
            },
        });

        return NextResponse.json(pusher);
    }
    catch (error) {
        console.log('[ZPC_POST_C1]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string}}
) {
    try {

        if (!params.storeId) return new NextResponse("Missing Store ID", { status: 400 });


        const pusher = await prismadb.zCategory.findMany({
            where: {
                storeId: params.storeId,
            },
        });

        return NextResponse.json(pusher);
    }
    catch (error) {
        console.log('[ZPC_GET_C1]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}