import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

        if (!params.storeId) return new NextResponse("Missing Store ID", { status: 400 });

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                uuid: params.storeId,
                StoreToUser: {
                    some: {
                        userId: userId
                    }
                }
            },
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 401 });


        const pusher = await prismadb.user.findMany({
          });

        return NextResponse.json(pusher);
    }
    catch (error) {
        console.log('[FILTER_GET_C1]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string } }
  ) {
    try {
      const body = await req.json();

      const { userId } = auth();

      if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
  
      const { 
        hotel_monthly_booking,
        hotel_monthly_clients,
        hotel_monthly_revenue,
        hotel_total_booking,
        hotel_total_clients,
        hotel_total_revenue,
        hotel_total_rooms,

        store_total_revenue,
        store_total_sales,
        store_total_products,
        store_total_category,
        store_total_sizes,
        store_total_colors,
        store_total_tags,

        farm_count_location,
        farm_count_animal,
        farm_count_field,
        farm_count_worker,
        farm_count_tree,
        farm_count_barn,
        farm_count_equipment,
        farm_count_vehicle,

        hotel_filter_row,
        store_filter_row,
        farm_filter_row,
       } = body;


      const product = await prismadb.user.update({
        where: {
          uuid: userId,
        },
        data: {
            hotel_monthly_booking,
            hotel_monthly_clients,
            hotel_monthly_revenue,
            hotel_total_booking,
            hotel_total_clients,
            hotel_total_revenue,
            hotel_total_rooms,

            store_total_revenue,
            store_total_sales,
            store_total_products,
            store_total_category,
            store_total_sizes,
            store_total_colors,
            store_total_tags,

            farm_count_location,
            farm_count_animal,
            farm_count_field,
            farm_count_worker,
            farm_count_tree,
            farm_count_barn,
            farm_count_equipment,
            farm_count_vehicle,

            hotel_filter_row,
            store_filter_row,
            farm_filter_row,
        }
      });
  
      return NextResponse.json(product);
    } catch (error) {
      console.log('[FILTER_UPT_C2]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };