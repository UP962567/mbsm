import prismadb from "@/lib/prismadb";

export const getCountTree = async (storeId: string) => {
  const count = await prismadb.farmTree.count({
    where: {
      storeId,
    }
  });

  return count;
};