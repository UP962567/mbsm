import prismadb from "@/lib/prismadb";

export const getCountField = async (storeId: string) => {
  const count = await prismadb.farmField.count({
    where: {
      storeId,
    }
  });

  return count;
};