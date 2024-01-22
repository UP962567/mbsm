import prismadb from "@/lib/prismadb";

export const getCountStore = async () => {
  const count = await prismadb.store.count({
  });

  return count;
};