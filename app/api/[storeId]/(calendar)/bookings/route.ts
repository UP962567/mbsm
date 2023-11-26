import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string}}
) {
    try {
        const body = await req.json();

        const { title, group, start_time, end_time } = body;

        const { userId } = auth();

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

        if (!title) return new NextResponse("Missing data", { status: 400 });

        if (!group) return new NextResponse("Missing data", { status: 400 });

        if (!start_time) return new NextResponse("Missing data", { status: 400 });

        if (!end_time) return new NextResponse("Missing data", { status: 400 });

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

        const product = await prismadb.calendarBooking.create({
            data: {
                title,
                group,
                start_time,
                end_time,
                storeId: params.storeId,
                userId: userId,
            },
        });

        return NextResponse.json(product);
    }
    catch (error) {
        console.log('[CAL_BOOKING_POST_C1]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string}}
) {
    try {
        const { searchParams } = new URL(req.url);

        if (!params.storeId) return new NextResponse("Missing Store ID", { status: 400 });


        const products = await prismadb.calendarBooking.findMany({
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
        console.log('[CAL_BOOKINGS_GET_C1]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}