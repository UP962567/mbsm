import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string}}
) {
    try {
        const body = await req.json();

        const { name, email, password, uuid, phone, address, username } = body;

        const pusher = await prismadb.user.create({
            data: {
                name,
                email,
                password,
                username,
                uuid,
                phone,
                address,
            },
        });

        return NextResponse.json(pusher);
    }
    catch (error) {
        console.log('[ADMIN_ERROR_USER_POST]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string}}
) {
    try {

        const pusher = await prismadb.user.findMany({

        });

        return NextResponse.json(pusher);
    }
    catch (error) {
        console.log('[ADMIN_ERROR_USER_GET]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}