import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const currentYear = new Date().getFullYear();
const nextYear = currentYear + 1;


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
                start_time: {
                    gte: new Date(''+ currentYear +'-01-01T00:00:00.000Z'),
                    lt: new Date(''+ nextYear +'-01-01T00:00:00.000Z')
                }
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