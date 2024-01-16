import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const body = await req.json();

        const { name, maps, maps_dsc, size } = body;

        const { userId } = auth();

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

        if (!name) return new NextResponse("Missing data", { status: 400 });
        if (!maps) return new NextResponse("Missing data", { status: 400 });
        if (!maps_dsc) return new NextResponse("Missing data", { status: 400 });
        if (!size) return new NextResponse("Missing data", { status: 400 });

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

        const product = await prismadb.farmLocation.create({
            data: {
                name,
                size,
                maps,
                maps_dsc,
                storeId: params.storeId,
            },
        });

        return NextResponse.json(product);
    }
    catch (error) {
        console.log('[POST_ERROR]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        if (!params.storeId) return new NextResponse("Missing Store ID", { status: 400 });


        const products = await prismadb.farmLocation.findMany({
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
        console.log('[GET_ERROR]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}