import prismadb from "@/lib/prismadb";

export const getCountAccesses = async () => {
  const count = await prismadb.storeToUser.count({
  });

  return count;
};