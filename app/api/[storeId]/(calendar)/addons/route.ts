import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string}}
) {
    try {
        const body = await req.json();

        const { title, price } = body;

        const { userId } = auth();

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

        if (!title) return new NextResponse("Missing data", { status: 400 });

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

        const product = await prismadb.calendarAddon.create({
            data: {
                title,
                price,
                storeId: params.storeId,
            },
        });

        return NextResponse.json(product);
    }
    catch (error) {
        console.log('[CAL_ADDON_POST_C1]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string}}
) {
    try {
        if (!params.storeId) return new NextResponse("Missing Store ID", { status: 400 });


        const products = await prismadb.calendarAddon.findMany({
            where: {
                storeId: params.storeId,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(products);
    }
    catch (error) {
        console.log('[CAL_ADDON_GET_C1]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}