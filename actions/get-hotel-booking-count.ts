import prismadb from "@/lib/prismadb";

export const getBookingCount = async (storeId: string) => {
  const bookingCount = await prismadb.calendarBooking.count({
    where: {
      storeId,
    }
  });

  return bookingCount;
};