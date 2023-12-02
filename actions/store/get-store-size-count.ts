import prismadb from "@/lib/prismadb";

export const getCountSize = async (storeId: string) => {
  const count = await prismadb.size.count({
    where: {
      storeId,
    }
  });

  return count;
};