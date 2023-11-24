import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {

    const pusher = await prismadb.store.findUnique({
      where: {
        uuid: params.storeId
      }
    });
  
    return NextResponse.json(pusher);
  } catch (error) {
    console.log('[ADMIN_STORE_GET_ID]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const pusher = await prismadb.store.delete({
      where: {
        uuid: params.storeId,
      }
    });
  
    return NextResponse.json(pusher);
  } catch (error) {
    console.log('[ADMIN_STORE_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {   

    const body = await req.json();
    
    const { name, uuid, type } = body;
    
    const pusher = await prismadb.store.update({
      where: {
        uuid: params.storeId,
      },
      data: {
        name,
        type,
        uuid,
      }
    });
  
    return NextResponse.json(pusher);
  } catch (error) {
    console.log('[ADMIN_USER_UPDATE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};