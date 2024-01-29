import prismadb from "@/lib/prismadb";

export const getTotalHotelRevenue = async (storeId: string) => {
  const bookings = await prismadb.calendarBooking.findMany({
    where: {
      storeId,
    }
  });

  const totalRevenue = bookings.reduce((total, booking) => {
    const numericTotalPrice = booking.totalPrice.toNumber(); 
    return total + numericTotalPrice;
  }, 0);

  return totalRevenue;
};
