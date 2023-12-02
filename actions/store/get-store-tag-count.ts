import prismadb from "@/lib/prismadb";

export const getCountTag = async (storeId: string) => {
  const count = await prismadb.tag.count({
    where: {
      storeId,
    }
  });

  return count;
};