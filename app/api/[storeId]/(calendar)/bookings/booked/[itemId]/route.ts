import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { itemId: string } }
) {
  try {
    if (!params.itemId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const itemId = parseInt(params.itemId, 10); // Parse the ID to an integer
    if (isNaN(itemId)) {
      return new NextResponse("Invalid product id", { status: 400 });
    }

    const product = await prismadb.calendarBooking.findUnique({
      where: {
        id: itemId // Use the parsed integer value for the id
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('[CAL_BOOKING_GET] Error:', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
