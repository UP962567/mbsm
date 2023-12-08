import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    if (!params.bookingId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const product = await prismadb.calendarBooking.findUnique({
      where: {
        uuid: params.bookingId
      },
      include: {
        room: true,
        calendarAddon: true
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[CAL_BOOKING_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { bookingId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.bookingId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        uuid: params.storeId,
        StoreToUser: {
          some: {
            userId: userId
          }
        }
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const product = await prismadb.calendarBooking.deleteMany({
      where: {
        uuid: params.bookingId,
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[CAL_BOOKING_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { bookingId: string, storeId: string } }
) {
  try {
    const body = await req.json();

    const { title, group, start_time, end_time, totalPrice, clients, addonId, discount } = body;

    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!title) return new NextResponse("Missing data", { status: 400 });

    if (!group) return new NextResponse("Missing data", { status: 400 });

    if (!start_time) return new NextResponse("Missing data", { status: 400 });

    if (!end_time) return new NextResponse("Missing data", { status: 400 });

    if (!totalPrice) return new NextResponse("Missing total Price", { status: 400 })

    if (!params.storeId) return new NextResponse("Missing Store ID", { status: 400 });
    
    if (!clients) return new NextResponse("Missing data", { status: 400 });

    if (!addonId) return new NextResponse("Missing data", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        uuid: params.storeId,
        StoreToUser: {
          some: {
            userId: userId
          }
        }
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const product = await prismadb.calendarBooking.update({
      where: {
        uuid: params.bookingId,
      },
      data: {
        title,
        group,
        start_time,
        end_time,
        totalPrice,
        clients,
        discount,
        addonId
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[CLA_BOOKING_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};