import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        uuid: params.productId
      },
      include: {
        images: true,
        color: true,
        size: true,
        category: true,
        store: true,
        tag: true,
      }
    });
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
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

    const product = await prismadb.product.deleteMany({
      where: {
        uuid: params.productId,
      }
    });
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { productId: string, storeId: string } }
) {
  try {   
    const body = await req.json();

    const { name, description, price, categoryId, colorId, sizeId, tagId, images, isFeatured, isArchived } = body;

    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!name) return new NextResponse("Missing name", { status: 400 });

    if (!description) return new NextResponse("Missing description", { status: 400 });

    if (!price) return new NextResponse("Missing price", { status: 400 });

    if (!categoryId) return new NextResponse("Missing categoryId", { status: 400 });

    if (!colorId) return new NextResponse("Missing colorId", { status: 400 });

    if (!sizeId) return new NextResponse("Missing sizeId", { status: 400 });

    if (!tagId) return new NextResponse("Missing tagId", { status: 400 });

    if (!images || !images.length) return new NextResponse("Missing Image", { status: 400 });

    if (!params.storeId) return new NextResponse("Missing Store ID", { status: 400 });

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
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

    await prismadb.product.update({
      where: {
        uuid: params.productId,
      },
      data: {
        name,
        description,
        price,
        categoryId,
        colorId,
        sizeId,
        tagId,
        images: {
          deleteMany: {}
        },
        isFeatured,
        isArchived,
      }
    });

    const product = await prismadb.product.update({
      where: {
        uuid: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [
              ...images.map((image: {url: string}) => image)
            ]
          }
        },
      }
    });
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};