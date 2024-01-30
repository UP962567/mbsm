import prismadb from "@/lib/prismadb";

export const getSalesCount = async (storeId: string) => {
  const salesCount = await prismadb.sales.count({
    where: {
      storeId,
    },
  });

  return salesCount;
};