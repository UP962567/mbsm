import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { addonId: string } }
) {
  try {
    if (!params.addonId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const product = await prismadb.calendarAddon.findUnique({
      where: {
        uuid: params.addonId
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[CAL_ADDON_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { addonId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.addonId) {
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

    const product = await prismadb.calendarAddon.deleteMany({
      where: {
        uuid: params.addonId,
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[CAL_ADDON_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { addonId: string, storeId: string } }
) {
  try {
    const body = await req.json();

    const { title, price } = body;

    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!title) return new NextResponse("Missing data", { status: 400 });


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

    const product = await prismadb.calendarAddon.update({
      where: {
        uuid: params.addonId,
      },
      data: {
        title,
        price
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[CLA_ADDON_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};