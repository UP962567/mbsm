import prismadb from "@/lib/prismadb";

export const getFilters = async (userId: string) => {
  const filters = await prismadb.userFilter.findMany({
    where: {
      userId
    }
  });

  return filters;
};