import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const body = await req.json();

        const { name, quantity, information, type, bought, price, outOfUse } = body;

        const { userId } = auth();

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

        if (!name) return new NextResponse("Missing data", { status: 400 });
        if (!quantity) return new NextResponse("Missing data", { status: 400 });
        if (!information) return new NextResponse("Missing data", { status: 400 });
        if (!bought) return new NextResponse("Missing data", { status: 400 });
        if (!price) return new NextResponse("Missing data", { status: 400 });
        // if (!outOfUse) return new NextResponse("Missing data", { status: 400 });


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

        const product = await prismadb.farmMedicine.create({
            data: {
                name, quantity, information, type, bought, price, outOfUse,
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


        const products = await prismadb.farmMedicine.findMany({
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