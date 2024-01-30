import prismadb from "@/lib/prismadb";

export const getTotalStoreRevenue = async (storeId: string) => {
  const sales = await prismadb.sales.findMany({
    where: {
      storeId,
    }
  });

  const totalRevenue = sales.reduce((total, sales) => {
    const numericTotalPrice = sales.total.toNumber(); 
    return total + numericTotalPrice;
  }, 0);

  return totalRevenue;
};
