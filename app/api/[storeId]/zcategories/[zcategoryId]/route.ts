import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { zcategoryId: string } }
) {
  try {
    if (!params.zcategoryId) {
      return new NextResponse("Color id is required", { status: 400 });
    }

    const pusher = await prismadb.zCategory.findUnique({
      where: {
        uuid: params.zcategoryId
      }
    });
  
    return NextResponse.json(pusher);
  } catch (error) {
    console.log('[ZPC_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { zcategoryId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.zcategoryId) {
      return new NextResponse("ZPC id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        uuid: params.storeId,
        userId,
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const pusher = await prismadb.zCategory.delete({
      where: {
        uuid: params.zcategoryId,
      }
    });
  
    return NextResponse.json(pusher);
  } catch (error) {
    console.log('[ZPC_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { zcategoryId: string, storeId: string } }
) {
  try {   
    const { userId } = auth();

    const body = await req.json();
    
    const { name, value } = body;
    
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!params.zcategoryId) {
      return new NextResponse("Color id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        uuid: params.storeId,
        userId,
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const pusher = await prismadb.zCategory.update({
      where: {
        uuid: params.zcategoryId,
      },
      data: {
        name,
        value,
      }
    });
  
    return NextResponse.json(pusher);
  } catch (error) {
    console.log('[ZPC_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};