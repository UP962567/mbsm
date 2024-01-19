import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { vehicleId: string } }
) {
  try {
    if (!params.vehicleId) {
      return new NextResponse("Data id is required", { status: 400 });
    }

    const product = await prismadb.farmVehicle.findUnique({
      where: {
        uuid: params.vehicleId
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
  { params }: { params: { vehicleId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.vehicleId) {
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

    const product = await prismadb.farmVehicle.deleteMany({
      where: {
        uuid: params.vehicleId,
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
  { params }: { params: { vehicleId: string, storeId: string } }
) {
  try {
    const body = await req.json();

    const { name, plate, information, model, bought, sold, outOfUse, quantity, petrolType, locationId } = body;

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

    const product = await prismadb.farmVehicle.update({
      where: {
        uuid: params.vehicleId,
      },
      data: {
        name, plate, information, model, bought, sold, outOfUse, quantity, petrolType, locationId,
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[ERROR_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};