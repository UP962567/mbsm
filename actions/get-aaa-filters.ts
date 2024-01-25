import prismadb from "@/lib/prismadb";

export const getFilters = async (userId: string) => {
  const filters = await prismadb.user.findMany({
    where: {
      uuid: userId,
    },
  }
  );
  return filters;
};