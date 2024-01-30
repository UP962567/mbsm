import prismadb from "@/lib/prismadb";

interface GraphData {
  name: string;
  total: number;
}

export const getGraphRevenuePast = async (storeId: string): Promise<GraphData[]> => {
  const teardate = new Date;
  const thisyear = teardate.getUTCFullYear();
  const pastyear = thisyear - 1;
  const nextyear = pastyear + 1;

  const bookings = await prismadb.sales.findMany({
    where: {
      storeId,
      sold: {
        gte: new Date(pastyear + "-01-01T00:00:00Z"),
        lt: new Date(nextyear + "-01-01T00:00:00Z"),
      },
    }
  });

  const monthlyRevenue: { [key: number]: number } = {};

  for (const booking of bookings) {
    const month = booking.sold.getMonth();
    let revenueForBooking = booking.total.toNumber();

    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForBooking;
  }

  const graphData: GraphData[] = [
    { name: "Jan", total: 0 },
    { name: "Feb", total: 0 },
    { name: "Mar", total: 0 },
    { name: "Apr", total: 0 },
    { name: "May", total: 0 },
    { name: "Jun", total: 0 },
    { name: "Jul", total: 0 },
    { name: "Aug", total: 0 },
    { name: "Sep", total: 0 },
    { name: "Oct", total: 0 },
    { name: "Nov", total: 0 },
    { name: "Dec", total: 0 },
  ];

  for (const month in monthlyRevenue) {
    graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
  }

  return graphData;
};
