import prismadb from "@/lib/prismadb";

export const getTotalHotelClients = async (storeId: string) => {
  const bookings = await prismadb.calendarBooking.findMany({
    where: {
      storeId,
    },
  });

  const totalClients = bookings.reduce((total, booking) => {
    const numericTotalClients = booking.clients || 0; 
    return total + numericTotalClients;
  }, 0);

  return totalClients;
};
