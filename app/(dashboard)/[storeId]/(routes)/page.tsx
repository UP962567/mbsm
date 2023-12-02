import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { CreditCard, DollarSign, Lamp, Package, Users } from "lucide-react";
import { Cloud, Github, Keyboard, LifeBuoy, LogOut, Mail, MessageSquare, Plus, PlusCircle, Settings, User, UserPlus, } from "lucide-react"

import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";

import { Overview } from "@/components/overview";
import { DropdownMenuCheckboxes } from "@/components/hotel-check";

import { formatter } from "@/lib/utils";
import prismadb from "@/lib/prismadb";

import { getTotalRevenue } from "@/actions/get-store-total-revenue";
import { getSalesCount } from "@/actions/get-store-sales-count";
import { getGraphRevenue } from "@/actions/get-store-graph-revenue";
import { getStockCount } from "@/actions/get-store-stock-count";

import { getRoomsCount } from "@/actions/get-hotel-rooms-count";
import { getBookingCount } from "@/actions/get-hotel-booking-count";
import { getTotalHotelRevenue } from "@/actions/get-hotel-revenue";
import { getGraphHotelRevenue } from "@/actions/get-hotel-graph-revenue";
import { getTotalMonthRevenue } from "@/actions/get-hotel-month-revenue";
import { getTotalHotelClients } from "@/actions/get-hotel-clients-count";
import { getTotalMonthClients } from "@/actions/get-hotel-month-client";
import { getTotalMonthBooknig } from "@/actions/get-hotel-month-booking";


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

  const filters = await prismadb.userFilter.findUnique({
    where: {
      storeId: params.storeId,
      userId: userId || undefined,
      uuid: userId,
      type: store?.type
    }
  });

  const totalRevenue = await getTotalRevenue(params.storeId);
  const graphRevenue = await getGraphRevenue(params.storeId);
  const salesCount = await getSalesCount(params.storeId);
  const stockCount = await getStockCount(params.storeId);

  const roomsCount = await getRoomsCount(params.storeId);
  const bookingCount = await getBookingCount(params.storeId);
  const bookingRevenue = await getTotalHotelRevenue(params.storeId);
  const graphHotelData = await getGraphHotelRevenue(params.storeId);
  const monthlyRevenue = await getTotalMonthRevenue(params.storeId);
  const hotelClients = await getTotalHotelClients(params.storeId);

  const monlyClients = await getTotalMonthClients(params.storeId);
  const monlyBooking = await getTotalMonthBooknig(params.storeId);


  if (store?.type === "STORE") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <Heading title="Dashboard" description="Overview of your Store" />
          <Separator />
          <div className="grid gap-4 grid-cols-3">
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{salesCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products In Stock</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stockCount}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview data={graphRevenue} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } else if (store?.type === "HOTEL") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex justify-between">
            <Heading title="Dashboard" description="Overview of your Hotel" />
            <div className="flex">
              <DropdownMenuCheckboxes data={filters} />
            </div>

          </div>
          <Separator />
          <div className="grid gap-4 grid-cols-4">
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

          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview data={graphHotelData} />
            </CardContent>
          </Card>

          <Separator />
          <div>
            Test
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardPage;