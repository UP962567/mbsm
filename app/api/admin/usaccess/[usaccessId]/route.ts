import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { usaccessId: string } }
) {
  try {

    const pusher = await prismadb.storeToUser.findUnique({
      where: {
        uuid: params.usaccessId
      }
    });
  
    return NextResponse.json(pusher);
  } catch (error) {
    console.log('[ADMIN_ACUSER_USGET_ID]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { usaccessId: string } }
) {
  try {

    if (!params.usaccessId) {
      return new NextResponse("USER id is required", { status: 400 });
    }

    const pusher = await prismadb.storeToUser.delete({
      where: {
        uuid: params.usaccessId,
      }
    });
  
    return NextResponse.json(pusher);
  } catch (error) {
    console.log('[ADMIN_ACUSER_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { usaccessId: string } }
) {
  try {   

    const body = await req.json();
    
    const { storeId, userId } = body;
    
    const pusher = await prismadb.storeToUser.update({
      where: {
        uuid: params.usaccessId,
      },
      data: {
        storeId,
        userId,
      }
    });
  
    return NextResponse.json(pusher);
  } catch (error) {
    console.log('[ADMIN_ACUSER_UPDATE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};