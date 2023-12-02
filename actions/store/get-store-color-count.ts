import prismadb from "@/lib/prismadb";

export const getCountColor = async (storeId: string) => {
  const count = await prismadb.color.count({
    where: {
      storeId,
    }
  });

  return count;
};