import prismadb from "@/lib/prismadb";

export const getCountLocation = async (storeId: string) => {
  const count = await prismadb.farmLocation.count({
    where: {
      storeId,
    }
  });

  return count;
};