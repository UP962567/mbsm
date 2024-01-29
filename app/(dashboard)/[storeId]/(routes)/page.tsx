import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { CreditCard, DollarSign, Lamp, Package, Users } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Overview } from "@/components/overview";
import { FarmDropdownMenuCheckboxes } from "@/components/farm-check";
import { HotelDropdownMenuCheckboxes } from "@/components/hotel-check";
import { StoreDropdownMenuCheckboxes } from "@/components/store-check";

import { formatter } from "@/lib/utils";
import prismadb from "@/lib/prismadb";

import { getSalesCount } from "@/actions/store/get-store-sales-count";
import { getGraphRevenue } from "@/actions/store/get-store-graph-revenue";
import { getStockCount } from "@/actions/store/get-store-stock-count";
import { getCountSize } from "@/actions/store/get-store-size-count";
import { getCountColor } from "@/actions/store/get-store-color-count";
import { getCountTag } from "@/actions/store/get-store-tag-count";
import { getCountCategory } from "@/actions/store/get-store-category-count";

import { getRoomsCount } from "@/actions/hotel/get-hotel-rooms-count";
import { getBookingCount } from "@/actions/hotel/get-hotel-booking-count";
import { getTotalHotelRevenue } from "@/actions/hotel/get-hotel-revenue";
import { getGraphHotelRevenue } from "@/actions/hotel/get-hotel-graph-revenue";
import { getTotalMonthRevenue } from "@/actions/hotel/get-hotel-month-revenue";
import { getTotalHotelClients } from "@/actions/hotel/get-hotel-clients-count";
import { getTotalMonthClients } from "@/actions/hotel/get-hotel-month-client";
import { getTotalMonthBooknig } from "@/actions/hotel/get-hotel-month-booking";
import { getGraphHotelRevenueTest } from "@/actions/hotel/1-to-work-prediction-scema-test-data";
import { getPreviewOverwier } from "@/actions/hotel/get-hotel-yearly-revenue";

import { getCountLocation } from "@/actions/farm/get-count-locations";
import { getCountAnimal } from "@/actions/farm/get-count-animals";
import { getCountBarn } from "@/actions/farm/get-count-barns";
import { getCountField } from "@/actions/farm/get-count-fields";
import { getCountTree } from "@/actions/farm/get-count-trees";
import { getCountVehicle } from "@/actions/farm/get-count-vehicles";
import { getCountWorker } from "@/actions/farm/get-count-workers";
import { getCountEquipment } from "@/actions/farm/get-count-equipments";


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

  // FARM
  const FARMcountLocation = await getCountLocation(params.storeId);
  const FARMcountAnimal = await getCountAnimal(params.storeId);
  const FARMcountBarn = await getCountBarn(params.storeId);
  const FARMcountField = await getCountField(params.storeId);
  const FARMcountTree = await getCountTree(params.storeId);
  const FARMcountVehicle = await getCountVehicle(params.storeId);
  const FARMcountWorker = await getCountWorker(params.storeId);
  const FARMcountEquipment = await getCountEquipment(params.storeId);

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
                  <div className="text-2xl font-bold">TEST</div>
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
                  View this year sales
                </div>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview data={graphHotelData} />
              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>This Year Overview</CardTitle>
                  Total Income of this year
                </div>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview data={testdata} />
              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>History Overview</CardTitle>
                  From the last 8 years
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
  } else if (store?.type === "FARM") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex justify-between">
            <Heading title="Dashboard" description="Overview of your Farm" />
            <div className="flex">
              <FarmDropdownMenuCheckboxes data={filters} />
            </div>
          </div>
          <Separator />
          <div className={
            filters?.farm_filter_row === "3" ? "grid grid-cols-3 gap-4" : "" ||
              filters?.farm_filter_row === "4" ? "grid grid-cols-4 gap-4" : "" ||
                filters?.farm_filter_row === "5" ? "grid grid-cols-5 gap-4" : "" ||
                  filters?.farm_filter_row === "6" ? "grid grid-cols-6 gap-4" : "" ||
                    filters?.farm_filter_row === "7" ? "grid grid-cols-7 gap-4" : "" ||
                      filters?.farm_filter_row === "8" ? "grid grid-cols-8 gap-4" : ""
          }>
            {filters?.farm_count_location ?
              <Card>
                <a href={params.storeId + "/locations"}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Count <b style={{ color: 'green' }}>Locations</b></CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{FARMcountLocation}</div>
                  </CardContent>
                </a>
              </Card>
              : null}
            {filters?.farm_count_field ?
              <Card>
                <a href={params.storeId + "/fields"}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Count <b style={{ color: 'green' }}>Fields</b></CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{FARMcountField}</div>
                  </CardContent>
                </a>
              </Card>
              : null}
            {filters?.farm_count_tree ?
              <Card>
                <a href={params.storeId + "/trees"}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Count <b style={{ color: 'green' }}>Trees</b></CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{FARMcountTree}</div>
                  </CardContent>
                </a>
              </Card>
              : null}
            {filters?.farm_count_barn ?
              <Card>
                <a href={params.storeId + "/barns"}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Count <b style={{ color: 'green' }}>Barns</b></CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{FARMcountBarn}</div>
                  </CardContent>
                </a>
              </Card>
              : null}
            {filters?.farm_count_vehicle ?
              <Card>
                <a href={params.storeId + "/vehicles"}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Count <b style={{ color: 'green' }}>Vehicles</b></CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{FARMcountVehicle}</div>
                  </CardContent>
                </a>
              </Card>
              : null}
            {filters?.farm_count_worker ?
              <Card>
                <a href={params.storeId + "/workers"}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Count <b style={{ color: 'green' }}>Workers</b></CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{FARMcountWorker}</div>
                  </CardContent>
                </a>
              </Card>
              : null}
            {filters?.farm_count_animal ?
              <Card>
                <a href={params.storeId + "/animals"}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Count <b style={{ color: 'green' }}>Animals</b></CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{FARMcountAnimal}</div>
                  </CardContent>
                </a>
              </Card>
              : null}
            {filters?.farm_count_equipment ?
              <Card>
                <a href={params.storeId + "/equipments"}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Count <b style={{ color: 'green' }}>Equipments</b></CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{FARMcountEquipment}</div>
                  </CardContent>
                </a>
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
          </div>

        </div>
      </div>
    );
  }
}

export default DashboardPage;