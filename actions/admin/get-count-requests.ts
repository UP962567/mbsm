import prismadb from "@/lib/prismadb";

export const getCountRequests = async () => {
  const count = await prismadb.user.count({
    where: {
      status: {
        in: ["Pending", "pending"] // Exclude both "Pending" and "pending"
      },
    }
  });

  return count;
};