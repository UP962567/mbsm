import prismadb from "@/lib/prismadb";

export const getTotalMonthBooknig = async (storeId: string) => {

    const teardate = new Date;
    const year = teardate.getUTCFullYear();
    const month = teardate.getUTCMonth();

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 1);

    const bookingForMonth = await prismadb.calendarBooking.count({
        where: {
          storeId,
          start_time: {
            gte: startDate,
            lt: endDate,
          },
        },
      });


    return bookingForMonth;
};
