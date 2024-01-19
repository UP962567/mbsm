import prismadb from "@/lib/prismadb";

export const getCountBarn = async (storeId: string) => {
  const count = await prismadb.farmBarn.count({
    where: {
      storeId,
    }
  });

  return count;
};