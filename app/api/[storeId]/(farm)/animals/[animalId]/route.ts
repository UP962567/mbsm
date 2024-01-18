import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { animalId: string } }
) {
  try {
    if (!params.animalId) {
      return new NextResponse("Data id is required", { status: 400 });
    }

    const product = await prismadb.farmAnimal.findUnique({
      where: {
        uuid: params.animalId
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
  { params }: { params: { animalId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.animalId) {
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

    const product = await prismadb.farmAnimal.deleteMany({
      where: {
        uuid: params.animalId,
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
  { params }: { params: { animalId: string, storeId: string } }
) {
  try {
    const body = await req.json();

    const { name, quantity, information, feedType, bought, sold, price, outOfUse, locationId } = body;

    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    // if (!name) return new NextResponse("Missing data", { status: 400 });
    // if (!quantity) return new NextResponse("Missing data", { status: 400 });
    // if (!information) return new NextResponse("Missing data", { status: 400 });
    // if (!feedType) return new NextResponse("Missing data", { status: 400 });
    // if (!bought) return new NextResponse("Missing data", { status: 400 });
    // if (!price) return new NextResponse("Missing data", { status: 400 });

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

    const product = await prismadb.farmAnimal.update({
      where: {
        uuid: params.animalId,
      },
      data: {
        name,
        quantity,
        information,
        feedType,
        bought,
        sold,
        price,
        outOfUse,
        locationId,
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[ERROR_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};