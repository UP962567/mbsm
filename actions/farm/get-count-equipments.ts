import prismadb from "@/lib/prismadb";

export const getCountEquipment = async (storeId: string) => {
  const count = await prismadb.farmEquipment.count({
    where: {
      storeId,
    }
  });

  return count;
};