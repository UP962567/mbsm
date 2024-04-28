import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const now = new Date();
const currentYear = now.getFullYear();


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
                    gte: new Date(currentYear, 0, 1), // January 1st of the year
                    lt: new Date(currentYear + 1, 0, 1) // January 1st of the next year              
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