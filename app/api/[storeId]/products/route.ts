import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string}}
) {
    try {
        const body = await req.json();

        const { name, description, price, categoryId, colorId, sizeId, tagId, images, isFeatured, isArchived } = body;

        const { userId } = auth();

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

        if (!name) return new NextResponse("Missing name", { status: 400 });

        if (!description) return new NextResponse("Missing description", { status: 400 });

        if (!tagId) return new NextResponse("Missing tag", { status: 400 });

        if (!price) return new NextResponse("Missing price", { status: 400 });

        if (!categoryId) return new NextResponse("Missing categoryId", { status: 400 });

        if (!colorId) return new NextResponse("Missing colorId", { status: 400 });

        if (!sizeId) return new NextResponse("Missing sizeId", { status: 400 });

        if (!images || !images.length) return new NextResponse("Missing Image", { status: 400 });

        if (!params.storeId) return new NextResponse("Missing Store ID", { status: 400 });

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                uuid: params.storeId,
                userId
            },
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 401 });

        const product = await prismadb.product.create({
            data: {
                name,
                description,
                price,
                categoryId,
                colorId,
                sizeId,
                tagId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: {url: string}) => image)
                        ]
                    }
                },
                isFeatured,
                isArchived,
                storeId: params.storeId,
            },
        });

        return NextResponse.json(product);
    }
    catch (error) {
        console.log('[PRODUCT_POST_C1]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string}}
) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get('categoryId') || undefined;
        const colorId = searchParams.get('colorId') || undefined;
        const sizeId = searchParams.get('sizeId') || undefined;
        const tagId = searchParams.get('tagId') || undefined;
        const isFeatured = searchParams.get('isFeatured');

        if (!params.storeId) return new NextResponse("Missing Store ID", { status: 400 });


        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                colorId,
                sizeId,
                tagId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false,
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true,
                store: true,
                tag: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(products);
    }
    catch (error) {
        console.log('[PRODUCTS_GET_C1]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}