import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string}}
) {
    try {
        const body = await req.json();

        const { name, billboardId } = body;

        const { userId } = auth();

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

        if (!name) return new NextResponse("Missing Label", { status: 400 });

        if (!billboardId) return new NextResponse("Missing Image", { status: 400 });

        if (!params.storeId) return new NextResponse("Missing Store ID", { status: 400 });

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                uuid: params.storeId,
                StoreToUser: {
                    some: {
                        userId: userId
                    }
                }
            },
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 401 });

        const categories = await prismadb.category.create({
            data: {
                name,
                billboardId,
                storeId: params.storeId,
            },
        });

        return NextResponse.json(categories);
    }
    catch (error) {
        console.log('[CATEGORY_POST_C1]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string}}
) {
    try {

        if (!params.storeId) return new NextResponse("Missing Store ID", { status: 400 });


        const categories = await prismadb.category.findMany({
            where: {
                storeId: params.storeId,
            },
        });

        return NextResponse.json(categories);
    }
    catch (error) {
        console.log('[CATEGORY_GET_C1]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}