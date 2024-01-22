import prismadb from "@/lib/prismadb";

export const getCountUsers = async () => {
  const count = await prismadb.user.count({
    where: {
      status: {
        notIn: ["Pending", "pending"] // Exclude both "Pending" and "pending"
      },
    }
  });

  return count;
};