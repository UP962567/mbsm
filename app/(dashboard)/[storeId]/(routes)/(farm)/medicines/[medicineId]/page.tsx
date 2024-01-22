import prismadb from "@/lib/prismadb";

import { Former } from "./components/form";

const Page = async ({
  params
}: {
  params: { medicineId: string , storeId: string }
}) => {
  const data = await prismadb.farmMedicine.findUnique({
    where: {
      uuid: params.medicineId,
      storeId: params.storeId
    }
  });


  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Former initialData={data} 
        />
      </div>
    </div>
  );
}

export default Page;