import prismadb from "@/lib/prismadb";

import { Former } from "./components/form";

const Page = async ({
  params
}: {
  params: { workerId: string , storeId: string }
}) => {
  const data = await prismadb.farmWorker.findUnique({
    where: {
      uuid: params.workerId,
      storeId: params.storeId
    }
  });

  const data1 = await prismadb.farmLocation.findMany({
    where: {
      storeId: params.storeId
    }
  });


  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Former initialData={data} 
          location={data1}
        />
      </div>
    </div>
  );
}

export default Page;