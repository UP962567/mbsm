import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json()
        const { name } = body;

        if (!userId) return new NextResponse('Unauthorized', { status: 401 });
        if (!name) return new NextResponse('Name is required', { status: 400 });
        if (!params.storeId) return new NextResponse('Store ID is required', { status: 400 });

        const store = await prismadb.store.updateMany({
            where: {
                uuid: params.storeId,
                userId
            },
            data: {
                name
            }
        });

        return NextResponse.json(store)


    } catch (error) {
        console.log("[STORE_PATCH_C2]", error)
        return new NextResponse('Internal server error', { status: 500 })
    }
}


export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) return new NextResponse('Unauthorized', { status: 401 });

        const store = await prismadb.store.deleteMany({
            where: {
                uuid: params.storeId,
                userId
            }
        });

        return NextResponse.json(store)

    } catch (error) {
        console.log("[STORE_DELETE_C3]", error)
        return new NextResponse('Internal server error', { status: 500 })
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        const store = await prismadb.store.findUnique({
            where: {
                uuid: params.storeId
            }
        });

        return NextResponse.json(store);
    } catch (error) {
        console.log('[STORE_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};