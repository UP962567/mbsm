import prismadb from "@/lib/prismadb";

interface GraphData {
  name: string;
  total: number;
}

export const getGraphMedicine = async (storeId: string): Promise<GraphData[]> => {
  const teardate = new Date;
  const thisyear = teardate.getUTCFullYear();
  const nextyear = thisyear + 1;

  const medicines = await prismadb.farmMedicineUsed.findMany({
    where: {
      storeId,
      used: {
        gte: new Date(thisyear + "-01-01T00:00:00Z"),
        lt: new Date(nextyear + "-01-01T00:00:00Z"),
      },
    }
  });

  const monthlymedicin: { [key: number]: number } = {};

  for (const medicine of medicines) {
    const month = medicine.used.getMonth();
    let revenueForBooking = medicine.quantity;

    monthlymedicin[month] = (monthlymedicin[month] || 0) + revenueForBooking;
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

  for (const month in monthlymedicin) {
    graphData[parseInt(month)].total = monthlymedicin[parseInt(month)];
  }

  return graphData;
};
