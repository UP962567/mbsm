import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { storeId: string}}
) {
    try {

        const pusher = await prismadb.store.findMany({

        });

        return NextResponse.json(pusher);
    }
    catch (error) {
        console.log('[ADMIN_ERROR_USER_GET]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(
    req: Request,
    { params }: { params: { storeId: string}}
) {
    try {
        const body = await req.json();

        const { name, type } = body;

        const pusher = await prismadb.store.create({
            data: {
                name,
                type,
            },
        });

        return NextResponse.json(pusher);
    }
    catch (error) {
        console.log('[ADMIN_ERROR_STORE_POST]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}