import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { treeId: string } }
) {
  try {
    if (!params.treeId) {
      return new NextResponse("Data id is required", { status: 400 });
    }

    const product = await prismadb.farmTree.findUnique({
      where: {
        uuid: params.treeId
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
  { params }: { params: { treeId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.treeId) {
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

    const product = await prismadb.farmTree.deleteMany({
      where: {
        uuid: params.treeId,
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
  { params }: { params: { treeId: string, storeId: string } }
) {
  try {
    const body = await req.json();

    const { name, type, information, quantity, planted, harvest, price, locationId, fieldId } = body;

    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    // if (!name) return new NextResponse("Missing data", { status: 400 });
    // if (!type) return new NextResponse("Missing data", { status: 400 });
    // if (!information) return new NextResponse("Missing data", { status: 400 });
    // if (!quantity) return new NextResponse("Missing data", { status: 400 });
    // if (!harvest) return new NextResponse("Missing data", { status: 400 });
    // if (!price) return new NextResponse("Missing data", { status: 400 });
    // if (!planted) return new NextResponse("Missing data", { status: 400 });
    // if (!fieldId) return new NextResponse("Missing data", { status: 400 });
    // if (!locationId) return new NextResponse("Missing data", { status: 400 });


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

    const product = await prismadb.farmTree.update({
      where: {
        uuid: params.treeId,
      },
      data: {
        name, 
        type, 
        information, 
        quantity, 
        planted, 
        harvest, 
        price, 
        locationId, 
        fieldId,
        storeId: params.storeId,
        },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[ERROR_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};