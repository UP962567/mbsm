import prismadb from "@/lib/prismadb";

export const getCountAnimal = async (storeId: string) => {
  const count = await prismadb.farmAnimal.count({
    where: {
      storeId,
    }
  });

  return count;
};