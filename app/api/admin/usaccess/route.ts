import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { usaccessId: string}}
) {
    try {
        const body = await req.json();

        const { storeId, userId} = body;

        const pusher = await prismadb.storeToUser.create({
            data: {
                storeId,
                userId,
            },
        });

        return NextResponse.json(pusher);
    }
    catch (error) {
        console.log('[ADMIN_ERROR_USAUSER_POST]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: { usaccessId: string}}
) {
    try {

        const pusher = await prismadb.storeToUser.findMany({

        });

        return NextResponse.json(pusher);
    }
    catch (error) {
        console.log('[ADMIN_ERROR_USAUSER_GET]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}