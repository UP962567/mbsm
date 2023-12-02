import prismadb from "@/lib/prismadb";

export const getRoomsCount = async (storeId: string) => {
  const roomsCount = await prismadb.calendarRoom.count({
    where: {
      storeId,
    }
  });

  return roomsCount;
};