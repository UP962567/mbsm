import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const body = await req.json();

        const { name, role, contact, information, start, end, holidays, sickdays, wage, locationId } = body;

        const { userId } = auth();

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

        if (!name) return new NextResponse("Missing data", { status: 400 });
        if (!role) return new NextResponse("Missing data", { status: 400 });
        if (!information) return new NextResponse("Missing data", { status: 400 });
        if (!contact) return new NextResponse("Missing data", { status: 400 });
        if (!start) return new NextResponse("Missing data", { status: 400 });
        if (!wage) return new NextResponse("Missing data", { status: 400 });
        if (!locationId) return new NextResponse("Missing data", { status: 400 });

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

        const product = await prismadb.farmWorker.create({
            data: {
                name, role, contact, information, start, end, holidays, sickdays, wage, locationId,
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


        const products = await prismadb.farmWorker.findMany({
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