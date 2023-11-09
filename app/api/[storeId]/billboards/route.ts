import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string}}
) {
    try {
        const body = await req.json();

        const { label, imageUrl } = body;

        const { userId } = auth();

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

        if (!label) return new NextResponse("Missing Label", { status: 400 });

        if (!imageUrl) return new NextResponse("Missing Image", { status: 400 });

        if (!params.storeId) return new NextResponse("Missing Store ID", { status: 400 });

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            },
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 401 });

        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId,
            },
        });

        return NextResponse.json(billboard);
    }
    catch (error) {
        console.log('[BILLBOARD_POST_C1]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string}}
) {
    try {

        if (!params.storeId) return new NextResponse("Missing Store ID", { status: 400 });


        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId,
            },
        });

        return NextResponse.json(billboards);
    }
    catch (error) {
        console.log('[BILLBOARDS_GET_C1]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}