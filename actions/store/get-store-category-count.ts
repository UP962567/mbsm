import prismadb from "@/lib/prismadb";

export const getCountCategory = async (storeId: string) => {
  const count = await prismadb.category.count({
    where: {
      storeId,
    }
  });

  return count;
};