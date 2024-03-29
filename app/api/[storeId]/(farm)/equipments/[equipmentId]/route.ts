import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { equipmentId: string } }
) {
  try {
    if (!params.equipmentId) {
      return new NextResponse("Data id is required", { status: 400 });
    }

    const product = await prismadb.farmEquipment.findUnique({
      where: {
        uuid: params.equipmentId
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[ERROR_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { equipmentId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.equipmentId) {
      return new NextResponse("DATA id is required", { status: 400 });
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

    const product = await prismadb.farmEquipment.deleteMany({
      where: {
        uuid: params.equipmentId,
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[ERROR_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { equipmentId: string, storeId: string } }
) {
  try {
    const body = await req.json();

    const { name, information, usage, bought, sold, outOfUse, quantity, locationId } = body;

    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    // if (!name) return new NextResponse("Missing data 1", { status: 400 });
    // if (!usage) return new NextResponse("Missing data 2", { status: 400 });
    // if (!information) return new NextResponse("Missing data 3", { status: 400 });
    // if (!bought) return new NextResponse("Missing data 4", { status: 400 });
    // if (!quantity) return new NextResponse("Missing data 6", { status: 400 });
    // if (!locationId) return new NextResponse("Missing data 7", { status: 400 });


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

    const product = await prismadb.farmEquipment.update({
      where: {
        uuid: params.equipmentId,
      },
      data: {
        name,
        information,
        usage,
        bought,
        sold,
        outOfUse,
        quantity,
        locationId,
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[ERROR_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};