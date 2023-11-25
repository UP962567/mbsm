import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string}}
) {
    try {
        const body = await req.json();

        const { title, price, slug, floorId } = body;

        const { userId } = auth();

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

        if (!title) return new NextResponse("Missing name", { status: 400 });

        if (!price) return new NextResponse("Missing description", { status: 400 });

        if (!slug) return new NextResponse("Missing tag", { status: 400 });

        if (!price) return new NextResponse("Missing price", { status: 400 });

        if (!floorId) return new NextResponse("Missing categoryId", { status: 400 });

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

        const product = await prismadb.calendarRoom.create({
            data: {
                title,
                slug,
                price,
                floorId,
                storeId: params.storeId,
            },
        });

        return NextResponse.json(product);
    }
    catch (error) {
        console.log('[CAL_ROOM_POST_C1]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string}}
) {
    try {
        const { searchParams } = new URL(req.url);
        const floorId = searchParams.get('floorId') || undefined;

        if (!params.storeId) return new NextResponse("Missing Store ID", { status: 400 });


        const products = await prismadb.calendarRoom.findMany({
            where: {
                storeId: params.storeId,
                floorId: floorId || undefined,
            },
            include: {
                floor: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(products);
    }
    catch (error) {
        console.log('[CAL_ROOMS_GET_C1]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}