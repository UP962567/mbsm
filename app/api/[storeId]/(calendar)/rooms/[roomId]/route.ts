import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    if (!params.roomId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const product = await prismadb.calendarRoom.findUnique({
      where: {
        uuid: params.roomId
      },
      include: {
        floor: true,
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[CAL_ROOM_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { roomId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.roomId) {
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

    const product = await prismadb.calendarRoom.deleteMany({
      where: {
        uuid: params.roomId,
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[CAL_ROOM_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { roomId: string, storeId: string } }
) {
  try {
    const body = await req.json();

    const { title, slug, price, floorId } = body;

    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!title) return new NextResponse("Missing name", { status: 400 });

    if (!slug) return new NextResponse("Missing description", { status: 400 });

    if (!price) return new NextResponse("Missing price", { status: 400 });

    if (!floorId) return new NextResponse("Missing categoryId", { status: 400 });

    if (!params.storeId) return new NextResponse("Missing Store ID", { status: 400 });


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

    const product = await prismadb.calendarRoom.update({
      where: {
        uuid: params.roomId,
      },
      data: {
        title,
        slug,
        price,
        floorId,
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[CLA_ROOM_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};