import prismadb from "@/lib/prismadb";

export const getCountWorker = async (storeId: string) => {
  const count = await prismadb.farmWorker.count({
    where: {
      storeId,
    }
  });

  return count;
};