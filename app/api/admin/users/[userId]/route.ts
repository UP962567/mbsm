import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {

    const pusher = await prismadb.user.findUnique({
      where: {
        uuid: params.userId
      }
    });
  
    return NextResponse.json(pusher);
  } catch (error) {
    console.log('[ADMIN_USER_GET_ID]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {

    if (!params.userId) {
      return new NextResponse("USER id is required", { status: 400 });
    }

    const pusher = await prismadb.user.delete({
      where: {
        uuid: params.userId,
      }
    });
  
    return NextResponse.json(pusher);
  } catch (error) {
    console.log('[ADMIN_USER_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {   

    const body = await req.json();
    
    const { name, password, email, uuid, address, phone, username, status, active } = body;
    
    const pusher = await prismadb.user.update({
      where: {
        uuid: params.userId,
      },
      data: {
        name,
        password,
        email,
        uuid,
        address,
        phone,
        username,
        status,
        active
      }
    });
  
    return NextResponse.json(pusher);
  } catch (error) {
    console.log('[ADMIN_USER_UPDATE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};