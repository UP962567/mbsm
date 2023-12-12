import prismadb from "@/lib/prismadb"

interface GraphData {
  name: string;
  total: number;
}

export const getGraphHotelRevenueTest = async (storeId: string): Promise<GraphData[]> => {
  const teardate = new Date();
  const startYear = teardate.getUTCFullYear();
  const endYear = startYear + 3;

  const bookings = await prismadb.calendarBooking.findMany({
    where: {
      storeId,
      start_time: {
        gte: new Date(`${startYear}-01-01T00:00:00Z`),
        lt: new Date(`${endYear}-01-01T00:00:00Z`),
      },
    },
    include: {
      room: true,
    },
  });

  const yearlyRevenue: { [key: number]: number } = {};

  for (const booking of bookings) {
    const year = booking.start_time.getFullYear();
    let revenueForBooking = booking.totalPrice.toNumber();

    yearlyRevenue[year] = (yearlyRevenue[year] || 0) + revenueForBooking;
  }

  const graphData: GraphData[] = [];

  for (const year in yearlyRevenue) {
    graphData.push({
      name: `${year}`,
      total: yearlyRevenue[parseInt(year)],
    });
  }

  return graphData;
};
