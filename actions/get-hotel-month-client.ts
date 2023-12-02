import prismadb from "@/lib/prismadb";

export const getTotalMonthClients = async (storeId: string) => {

    const teardate = new Date;
    const year = teardate.getUTCFullYear();
    const month = teardate.getUTCMonth();

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 1);

    const clientsForMonth = await prismadb.calendarBooking.findMany({
        where: {
          storeId,
          start_time: {
            gte: startDate,
            lt: endDate,
          },
        },
      });

    const totalRevenue = clientsForMonth.reduce((total, booking) => {
        const numericTotalClient = booking.clients || 0;
        return total + numericTotalClient;
    }, 0);

    return totalRevenue;
};
