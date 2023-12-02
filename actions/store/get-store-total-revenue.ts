import prismadb from "@/lib/prismadb";

export const getTotalRevenue = async (storeId: string) => {
  const bookings = await prismadb.calendarBooking.findMany({
    where: {
      storeId,
    },
    include: {
      room: true, // Include the related room data
    },
  });

  const totalRevenue = bookings.reduce((total, booking) => {
    const numericTotalPrice = booking.totalPrice.toNumber();
    return total + numericTotalPrice;
  }, 0);

  return totalRevenue;
};
