import prismadb from "@/lib/prismadb";

export const getTotalMonthRevenue = async (storeId: string) => {

    const teardate = new Date;
    const year = teardate.getUTCFullYear();
    const month = teardate.getUTCMonth();

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 1);

    const bookingsForMonth = await prismadb.calendarBooking.findMany({
        where: {
          storeId,
          start_time: {
            gte: startDate,
            lt: endDate,
          },
        },
        include: {
          room: true,
        },
      });

    const totalRevenue = bookingsForMonth.reduce((total, booking) => {
        const numericTotalPrice = booking.totalPrice.toNumber();
        return total + numericTotalPrice;
    }, 0);

    return totalRevenue;
};
