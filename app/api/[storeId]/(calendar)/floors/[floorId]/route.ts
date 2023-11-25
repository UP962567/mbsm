import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { floorId: string } }
) {
  try {
    if (!params.floorId) {
      return new NextResponse("ID is required", { status: 400 });
    }

    const pusher = await prismadb.calendarFloor.findUnique({
      where: {
        uuid: params.floorId
      }
    });

    return NextResponse.json(pusher);
  } catch (error) {
    console.log('[CAL_FLOOR_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { floorId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.floorId) {
      return new NextResponse("ID is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        uuid: params.storeId,
        StoreToUser: {
          some: {
            userId: userId
          }
        },
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const pusher = await prismadb.calendarFloor.delete({
      where: {
        uuid: params.floorId,
      }
    });

    return NextResponse.json(pusher);
  } catch (error) {
    console.log('[CAL_FLOOR_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { floorId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Data is required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Data is required", { status: 400 });
    }

    if (!params.floorId) {
      return new NextResponse("ID is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        uuid: params.storeId,
        StoreToUser: {
          some: {
            userId: userId
          }
        },
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const pusher = await prismadb.calendarFloor.update({
      where: {
        uuid: params.floorId,
      },
      data: {
        name,
        value,
      }
    });

    return NextResponse.json(pusher);
  } catch (error) {
    console.log('[CAL_FLOOR_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};