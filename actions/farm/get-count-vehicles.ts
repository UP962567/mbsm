import prismadb from "@/lib/prismadb";

export const getCountVehicle = async (storeId: string) => {
  const count = await prismadb.farmVehicle.count({
    where: {
      storeId,
    }
  });

  return count;
};