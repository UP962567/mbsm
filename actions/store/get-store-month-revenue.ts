import prismadb from "@/lib/prismadb";

export const getStoreMonthRevenue = async (storeId: string) => {

    const teardate = new Date;
    const year = teardate.getUTCFullYear();
    const month = teardate.getUTCMonth();

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 1);

    const salesMonthly = await prismadb.sales.findMany({
        where: {
          storeId,
          sold: {
            gte: startDate,
            lt: endDate,
          },
        }
      });

    const totalRevenue = salesMonthly.reduce((total, booking) => {
        const numericTotalPrice = booking.total.toNumber();
        return total + numericTotalPrice;
    }, 0);

    return totalRevenue;
};
