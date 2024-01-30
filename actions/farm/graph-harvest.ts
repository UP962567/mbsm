import prismadb from "@/lib/prismadb";

interface GraphData {
  name: string;
  total: number;
}

export const getGraphHarvest = async (storeId: string): Promise<GraphData[]> => {
  const teardate = new Date;
  const thisyear = teardate.getUTCFullYear();
  const nextyear = thisyear + 1;

  const harvests = await prismadb.farmHarvest.findMany({
    where: {
      storeId,
      harvested: {
        gte: new Date(thisyear + "-01-01T00:00:00Z"),
        lt: new Date(nextyear + "-01-01T00:00:00Z"),
      },
    }
  });

  const monthlyharvest: { [key: number]: number } = {};

  for (const harvest of harvests) {
    const month = harvest.harvested.getMonth();
    let revenueForBooking = harvest.quantity;

    monthlyharvest[month] = (monthlyharvest[month] || 0) + revenueForBooking;
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

  for (const month in monthlyharvest) {
    graphData[parseInt(month)].total = monthlyharvest[parseInt(month)];
  }

  return graphData;
};
