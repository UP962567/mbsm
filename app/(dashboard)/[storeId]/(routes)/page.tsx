import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { CreditCard, DollarSign, Lamp, Package, Users } from "lucide-react";
import { Cloud, Github, Keyboard, LifeBuoy, LogOut, Mail, MessageSquare, Plus, PlusCircle, Settings, User, UserPlus, } from "lucide-react"

import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";

import { Overview } from "@/components/overview";
import { HotelDropdownMenuCheckboxes } from "@/components/hotel-check";

import { formatter } from "@/lib/utils";
import prismadb from "@/lib/prismadb";

import { getTotalRevenue } from "@/actions/store/get-store-total-revenue";
import { getSalesCount } from "@/actions/store/get-store-sales-count";
import { getGraphRevenue } from "@/actions/store/get-store-graph-revenue";
import { getStockCount } from "@/actions/store/get-store-stock-count";

import { getRoomsCount } from "@/actions/hotel/get-hotel-rooms-count";
import { getBookingCount } from "@/actions/hotel/get-hotel-booking-count";
import { getTotalHotelRevenue } from "@/actions/hotel/get-hotel-revenue";
import { getGraphHotelRevenue } from "@/actions/hotel/get-hotel-graph-revenue";
import { getTotalMonthRevenue } from "@/actions/hotel/get-hotel-month-revenue";
import { getTotalHotelClients } from "@/actions/hotel/get-hotel-clients-count";
import { getTotalMonthClients } from "@/actions/hotel/get-hotel-month-client";
import { getTotalMonthBooknig } from "@/actions/hotel/get-hotel-month-booking";
import { StoreDropdownMenuCheckboxes } from "@/components/store-check";
import { getCountCategory } from "@/actions/store/get-store-category-count";
import { getCountSize } from "@/actions/store/get-store-size-count";
import { getCountColor } from "@/actions/store/get-store-color-count";
import { getCountTag } from "@/actions/store/get-store-tag-count";
import { getGraphHotelRevenueTest } from "@/actions/hotel/1-to-work-prediction-scema-test-data";
import { getPreviewOverwier } from "@/actions/hotel/get-hotel-yearly-revenue";


interface DashboardPageProps {
  params: {
    storeId: string;
  };
};

const DashboardPage: React.FC<DashboardPageProps> = async ({
  params
}) => {

  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in')
  }

  const store = await prismadb.store.findUnique({
    where: {
      uuid: params.storeId
    }
  });

  const filters = await prismadb.user.findUnique({
    where: {
      uuid: userId,
    }
  });

  // STORE
  const totalRevenue = await getTotalRevenue(params.storeId);
  const graphRevenue = await getGraphRevenue(params.storeId);
  const salesCount = await getSalesCount(params.storeId);
  const stockCount = await getStockCount(params.storeId);
  const categoryCount = await getCountCategory(params.storeId);
  const sizeCount = await getCountSize(params.storeId);
  const colorCount = await getCountColor(params.storeId);
  const tagCount = await getCountTag(params.storeId);

  // HOTEL
  const roomsCount = await getRoomsCount(params.storeId);
  const bookingCount = await getBookingCount(params.storeId);
  const bookingRevenue = await getTotalHotelRevenue(params.storeId);
  const monthlyRevenue = await getTotalMonthRevenue(params.storeId);
  const hotelClients = await getTotalHotelClients(params.storeId);
  const monlyClients = await getTotalMonthClients(params.storeId);
  const monlyBooking = await getTotalMonthBooknig(params.storeId);
  const graphHotelData = await getGraphHotelRevenue(params.storeId);

  const testdata = await getGraphHotelRevenueTest(params.storeId);
  const testdata2 = await getPreviewOverwier(params.storeId);


  if (store?.type === "STORE") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex justify-between">
            <Heading title="Dashboard" description="Overview of your Hotel" />
            <div className="flex">
              <StoreDropdownMenuCheckboxes data={filters} />
            </div>
          </div>
          <Separator />
          <div className={
            filters?.store_filter_row === "3" ? "grid grid-cols-3 gap-4" : "" ||
              filters?.store_filter_row === "4" ? "grid grid-cols-4 gap-4" : "" ||
                filters?.store_filter_row === "5" ? "grid grid-cols-5 gap-4" : "" ||
                  filters?.store_filter_row === "6" ? "grid grid-cols-6 gap-4" : "" ||
                    filters?.store_filter_row === "7" ? "grid grid-cols-7 gap-4" : "" ||
                      filters?.store_filter_row === "8" ? "grid grid-cols-8 gap-4" : ""
          }>
            {filters?.store_total_revenue ?
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatter.format(totalRevenue)}</div>
                </CardContent>
              </Card>
              : null}
            {filters?.store_total_sales ?
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sales</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{salesCount}</div>
                </CardContent>
              </Card>
              : null}
            {filters?.store_total_products ?
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Product</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stockCount}</div>
                </CardContent>
              </Card>
              : null}
            {filters?.store_total_category ?
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Category</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{categoryCount}</div>
                </CardContent>
              </Card>
              : null}
            {filters?.store_total_colors ?
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Color</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{colorCount}</div>
                </CardContent>
              </Card>
              : null}
            {filters?.store_total_tags ?
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tag</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tagCount}</div>
                </CardContent>
              </Card>
              : null}
            {filters?.store_total_sizes ?
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Size</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sizeCount}</div>
                </CardContent>
              </Card>
              : null}
          </div>

          <Separator />
          <div className="grid grid-cols-4 gap-4">

            <Card className="col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Present Overview</CardTitle>
                  Test
                </div>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview data={graphRevenue} />
              </CardContent>
            </Card>

          </div>
        </div>
      </div >
    );
  } else if (store?.type === "HOTEL") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex justify-between">
            <Heading title="Dashboard" description="Overview of your Hotel" />
            <div className="flex">
              <HotelDropdownMenuCheckboxes data={filters} />
            </div>
          </div>
          <Separator />
          <div className={
            filters?.hotel_filter_row === "3" ? "grid grid-cols-3 gap-4" : "" ||
              filters?.hotel_filter_row === "4" ? "grid grid-cols-4 gap-4" : "" ||
                filters?.hotel_filter_row === "5" ? "grid grid-cols-5 gap-4" : "" ||
                  filters?.hotel_filter_row === "6" ? "grid grid-cols-6 gap-4" : "" ||
                    filters?.hotel_filter_row === "7" ? "grid grid-cols-7 gap-4" : "" ||
                      filters?.hotel_filter_row === "8" ? "grid grid-cols-8 gap-4" : ""
          }>
            {filters?.hotel_total_revenue ?
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatter.format(bookingRevenue)}</div>
                </CardContent>
              </Card>
              : null}
            {filters?.hotel_monthly_revenue ?
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatter.format(monthlyRevenue)}</div>
                </CardContent>
              </Card>
              : null}
            {filters?.hotel_total_booking ?
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Booking</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bookingCount}</div>
                </CardContent>
              </Card>
              : null}
            {filters?.hotel_monthly_booking ?
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Booking</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{monlyBooking}</div>
                </CardContent>
              </Card>
              : null}
            {filters?.hotel_total_rooms ?
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
                  <Lamp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{roomsCount}</div>
                </CardContent>
              </Card>
              : null}
            {filters?.hotel_total_clients ?
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{hotelClients}</div>
                </CardContent>
              </Card>
              : null}
            {filters?.hotel_monthly_clients ?
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Clients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{monlyClients}</div>
                </CardContent>
              </Card>
              : null}
          </div>

          <Separator />

          <div className="grid grid-cols-4 gap-4">

            <Card className="col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Present Overview</CardTitle>
                  Test
                </div>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview data={graphHotelData} />
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Prediction Overview</CardTitle>
                  Test
                </div>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview data={testdata} />
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>History Overview</CardTitle>
                  Test
                </div>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview data={testdata2} />
              </CardContent>
            </Card>

          </div>

        </div>
      </div>
    );
  }
}

export default DashboardPage;